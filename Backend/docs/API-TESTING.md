# Smart Agriculture API — testing with Swagger and Postman

This guide matches the backend under `Backend/` (base URL default `http://localhost:8080`).

## Swagger / OpenAPI

1. Start the app: `mvn spring-boot:run` (from the `Backend` directory).
2. Open **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
3. Open **OpenAPI JSON**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

### JWT in Swagger UI

1. Call **POST** `/api/v1/auth/register` or **POST** `/api/v1/auth/login` and execute with a JSON body (see examples below).
2. Copy `accessToken` from the response.
3. Click **Authorize** (lock icon), choose **bearer-jwt**, paste: `Bearer <your_access_token>` or only the token (depending on UI; usually paste raw JWT only if the scheme adds `Bearer`).
4. Click **Authorize**, then **Close**.
5. Try any secured operation (e.g. **GET** `/api/v1/users/me`).

Auth endpoints are public; all others require a valid JWT unless listed as public in `SecurityConfig` (e.g. `/actuator/health`, `/actuator/info`).

---

## Postman

### Import

1. **Collection:** `Backend/docs/postman/Smart-Agriculture-API.postman_collection.json`
2. **Environment:** `Backend/docs/postman/Smart-Agriculture.local.postman_environment.json`

In Postman: **Import** → drag both files → select the **Smart Agriculture — Local** environment → set `baseUrl` if not `http://localhost:8080`.

### JWT in Postman

- The collection uses **Bearer** auth with `{{accessToken}}`.
- Run **Register (FARMER)** or **Login** first; the **Tests** script on those requests saves `accessToken` to **collection variables** when the response is `201` / `200`.
- You can also paste a token manually: collection **Variables** → `accessToken`.

### Regenerate the collection (optional)

If you change the generator script:

```bash
node Backend/docs/postman/generate-collection.js
```

---

## Quick reference — request bodies and sample responses

### Auth

**POST** `/api/v1/auth/register`

```json
{
  "fullName": "Ravi Kumar",
  "email": "ravi@example.com",
  "password": "password123",
  "phoneNumber": "+919876543210",
  "role": "FARMER"
}
```

**201** sample:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresInMs": 86400000
}
```

**POST** `/api/v1/auth/login`

```json
{
  "email": "ravi@example.com",
  "password": "password123"
}
```

**200** same shape as register. **401** invalid credentials (JSON error body from global handler).

---

### Users

**GET** `/api/v1/users/me` — no body.

**200** sample:

```json
{
  "id": 1,
  "fullName": "Ravi Kumar",
  "email": "ravi@example.com",
  "role": "FARMER",
  "phoneNumber": "+919876543210",
  "enabled": true,
  "createdAt": "2026-05-14T10:00:00Z"
}
```

---

### Farmers

**POST** `/api/v1/farmers` — FARMER omits `userId`; ADMIN sets `userId` for the target user.

```json
{
  "userId": null,
  "farmerName": "Ravi Kumar",
  "village": "Nelamangala",
  "district": "Bangalore Rural",
  "state": "Karnataka",
  "landArea": 12.5,
  "soilType": "Red loam"
}
```

**201** sample: `id`, `userId`, same fields as request.

**GET** `/api/v1/farmers` — ADMIN only; **200** is a JSON array of farmer objects. **403** for non-admin.

**PUT** `/api/v1/farmers/{id}` — same body shape as POST.

**DELETE** `/api/v1/farmers/{id}` — **204** no body.

---

### Crops

**POST** `/api/v1/crops`

```json
{
  "farmerId": 1,
  "cropName": "Tomato",
  "cropType": "Vegetable",
  "sowingDate": "2026-03-01",
  "harvestingDate": null,
  "cropStatus": "GROWING"
}
```

**201** sample includes `id`, `farmerId`, and dates. `cropStatus` enum values include `PLANNED`, `SOWING`, `GROWING`, `READY_TO_HARVEST`, `HARVESTED`, `FAILED`.

**GET** `/api/v1/crops?farmerId=1` — **200** array.

---

### Sensor data

**POST** `/api/v1/sensor-data`

```json
{
  "farmerId": 1,
  "temperature": 28.5,
  "humidity": 62.0,
  "soilMoisture": 35.0
}
```

**GET** `/api/v1/sensor-data/latest?farmerId=1` — **200** single reading.

**GET** `/api/v1/sensor-data?farmerId=1` — **200** array (newest first).

---

### Irrigation

**POST** `/api/v1/irrigation/farmers/{farmerId}/start` — optional body:

```json
{ "waterLevel": 75.0 }
```

**POST** `/api/v1/irrigation/farmers/{farmerId}/stop` — optional body:

```json
{ "waterLevel": 40.0 }
```

**201** sample includes `irrigationStatus` (`RUNNING` / `STOPPED`), `motorState` (`ON` / `OFF`), `irrigationDate`.

**GET** `/api/v1/irrigation/farmers/{farmerId}/history` — **200** array.

---

### Weather (Open-Meteo; live values differ)

**GET** `/api/v1/weather/current?latitude=12.97&longitude=77.59`

**200** sample:

```json
{
  "latitude": 12.97,
  "longitude": 77.59,
  "temperatureC": 29.2,
  "humidityPercent": 58.4,
  "summary": "Mainly clear / partly cloudy / overcast",
  "fetchedAt": "2026-05-14T10:30:00Z"
}
```

**GET** `/api/v1/weather/temperature?...` → `{ "temperatureC": 29.2 }`  
**GET** `/api/v1/weather/humidity?...` → `{ "humidityPercent": 58.4 }`  
**GET** `/api/v1/weather/metrics?...` → both fields.

**POST** `/api/v1/weather/save`

```json
{
  "latitude": 12.97,
  "longitude": 77.59,
  "farmerId": 1
}
```

`farmerId` optional. **201** returns persisted `WeatherRecordResponse` including `id` and `fetchedAt`.

---

### Notifications

**POST** `/api/v1/notifications/send`

```json
{
  "farmerId": 1,
  "title": "Reminder",
  "message": "Inspect drip lines in block A.",
  "notificationType": "GENERAL"
}
```

Types: `GENERAL`, `LOW_SOIL_MOISTURE`, `WEATHER_ALERT`, `IRRIGATION_ALERT`.

**GET** `/api/v1/notifications?farmerId=1` — **200** array.

**POST** `/api/v1/notifications/alerts/low-soil-moisture`

```json
{
  "farmerId": 1,
  "soilMoisture": 18.0,
  "threshold": 25.0
}
```

**400** if moisture is not below threshold.

**POST** `/api/v1/notifications/alerts/weather` — `{ "farmerId": 1, "message": "..." }`  
**POST** `/api/v1/notifications/alerts/irrigation` — `{ "farmerId": 1, "message": "..." }`

---

### Validation error (typical **400**)

```json
{
  "timestamp": "2026-05-14T10:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/v1/auth/register",
  "fieldErrors": [
    { "field": "email", "message": "must be a well-formed email address" }
  ]
}
```

---

## More HTTP examples

See also `Backend/docs/api-samples.http` for the same payloads in editor REST-client format.
