package com.smartagriculture.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartagriculture.exception.BadRequestException;
import java.math.BigDecimal;
import java.time.Instant;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class WeatherApiClient {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final String openMeteoBaseUrl;

    public WeatherApiClient(
            RestClient restClient,
            ObjectMapper objectMapper,
            @Value("${app.weather.open-meteo-base-url}") String openMeteoBaseUrl) {
        this.restClient = restClient;
        this.objectMapper = objectMapper;
        this.openMeteoBaseUrl = openMeteoBaseUrl;
    }

    public record CurrentWeatherPayload(
            BigDecimal latitude,
            BigDecimal longitude,
            BigDecimal temperatureC,
            BigDecimal humidityPercent,
            String summary,
            String rawJson,
            Instant fetchedAt) {}

    public CurrentWeatherPayload fetchCurrent(BigDecimal latitude, BigDecimal longitude) {
        String uri = UriComponentsBuilder.fromUriString(openMeteoBaseUrl + "/forecast")
                .queryParam("latitude", latitude)
                .queryParam("longitude", longitude)
                .queryParam("current", "temperature_2m,relative_humidity_2m,weather_code")
                .queryParam("timezone", "UTC")
                .build()
                .toUriString();

        String body = restClient.get().uri(uri).retrieve().body(String.class);
        if (body == null || body.isBlank()) {
            throw new BadRequestException("Empty weather API response");
        }
        try {
            JsonNode root = objectMapper.readTree(body);
            JsonNode current = root.path("current");
            if (current.isMissingNode()) {
                throw new BadRequestException("Weather response missing 'current' block");
            }
            BigDecimal latOut = root.path("latitude").isNumber()
                    ? root.path("latitude").decimalValue()
                    : latitude;
            BigDecimal lonOut = root.path("longitude").isNumber()
                    ? root.path("longitude").decimalValue()
                    : longitude;
            BigDecimal temp = current.path("temperature_2m").decimalValue();
            BigDecimal hum = current.path("relative_humidity_2m").decimalValue();
            int code = current.path("weather_code").asInt(0);
            String summary = summarizeWmo(code);
            return new CurrentWeatherPayload(latOut, lonOut, temp, hum, summary, body, Instant.now());
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new BadRequestException("Unable to parse weather response: " + e.getMessage());
        }
    }

    private static String summarizeWmo(int code) {
        return switch (code) {
            case 0 -> "Clear sky";
            case 1, 2, 3 -> "Mainly clear / partly cloudy / overcast";
            case 45, 48 -> "Fog";
            case 51, 53, 55 -> "Drizzle";
            case 61, 63, 65 -> "Rain";
            case 71, 73, 75 -> "Snow";
            case 80, 81, 82 -> "Rain showers";
            case 95, 96, 99 -> "Thunderstorm";
            default -> "Weather code " + code;
        };
    }
}
