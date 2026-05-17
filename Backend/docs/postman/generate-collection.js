/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

const collection = {
  info: {
    _postman_id: "sa-api-001",
    name: "Smart Agriculture API",
    description:
      "Smart Agriculture backend — all REST endpoints.\n\n**Setup:** Import this file + `Smart-Agriculture.local.postman_environment.json`. Select the environment.\n\n**JWT:** Run **Register** or **Login**; the test script saves `accessToken` to collection variables. Other requests use Bearer auth from the collection.",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
  },
  auth: {
    type: "bearer",
    bearer: [{ key: "token", value: "{{accessToken}}", type: "string" }],
  },
  variable: [
    { key: "baseUrl", value: "http://localhost:8080" },
    { key: "accessToken", value: "" },
    { key: "farmerId", value: "1" },
    { key: "cropId", value: "1" },
  ],
  item: [
    {
      name: "01 Authentication",
      item: [
        {
          name: "Register (FARMER)",
          event: [
            {
              listen: "test",
              script: {
                type: "text/javascript",
                exec: [
                  "if (pm.response.code === 201) {",
                  "  const j = pm.response.json();",
                  "  if (j.accessToken) pm.collectionVariables.set('accessToken', j.accessToken);",
                  "}",
                ],
              },
            },
          ],
          request: {
            auth: { type: "noauth" },
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  fullName: "Ravi Kumar",
                  email: "ravi@example.com",
                  password: "password123",
                  phoneNumber: "+919876543210",
                  role: "FARMER",
                },
                null,
                2
              ),
            },
            url: "{{baseUrl}}/api/v1/auth/register",
            description:
              "Public. When `app.security.allow-only-farmer-self-registration=true`, only **FARMER** is allowed.",
          },
          response: [
            {
              name: "201 Created — sample",
              originalRequest: {},
              status: "Created",
              code: 201,
              _postman_previewlanguage: "json",
              header: [],
              cookie: [],
              body: JSON.stringify(
                {
                  accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example",
                  tokenType: "Bearer",
                  expiresInMs: 86400000,
                },
                null,
                2
              ),
            },
            {
              name: "409 Conflict — email exists",
              status: "Conflict",
              code: 409,
              _postman_previewlanguage: "json",
              header: [],
              cookie: [],
              body: JSON.stringify(
                {
                  timestamp: "2026-05-14T10:00:00Z",
                  status: 409,
                  error: "Conflict",
                  message: "Email is already registered",
                  path: "/api/v1/auth/register",
                },
                null,
                2
              ),
            },
          ],
        },
        {
          name: "Login",
          event: [
            {
              listen: "test",
              script: {
                type: "text/javascript",
                exec: [
                  "if (pm.response.code === 200) {",
                  "  const j = pm.response.json();",
                  "  if (j.accessToken) pm.collectionVariables.set('accessToken', j.accessToken);",
                  "}",
                ],
              },
            },
          ],
          request: {
            auth: { type: "noauth" },
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                { email: "ravi@example.com", password: "password123" },
                null,
                2
              ),
            },
            url: "{{baseUrl}}/api/v1/auth/login",
          },
          response: [
            {
              name: "200 OK — sample",
              status: "OK",
              code: 200,
              _postman_previewlanguage: "json",
              header: [],
              cookie: [],
              body: JSON.stringify(
                {
                  accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example",
                  tokenType: "Bearer",
                  expiresInMs: 86400000,
                },
                null,
                2
              ),
            },
            {
              name: "401 Unauthorized",
              status: "Unauthorized",
              code: 401,
              _postman_previewlanguage: "json",
              header: [],
              cookie: [],
              body: JSON.stringify(
                {
                  timestamp: "2026-05-14T10:00:00Z",
                  status: 401,
                  error: "Unauthorized",
                  message: "Invalid credentials",
                  path: "/api/v1/auth/login",
                },
                null,
                2
              ),
            },
          ],
        },
      ],
    },
    {
      name: "02 Users",
      item: [
        {
          name: "Get current user (me)",
          request: {
            method: "GET",
            header: [],
            url: "{{baseUrl}}/api/v1/users/me",
            description: "Requires `Authorization: Bearer {{accessToken}}` (collection auth).",
          },
          response: [
            {
              name: "200 OK — sample",
              status: "OK",
              code: 200,
              _postman_previewlanguage: "json",
              header: [],
              cookie: [],
              body: JSON.stringify(
                {
                  id: 1,
                  fullName: "Ravi Kumar",
                  email: "ravi@example.com",
                  role: "FARMER",
                  phoneNumber: "+919876543210",
                  enabled: true,
                  createdAt: "2026-05-14T10:00:00Z",
                },
                null,
                2
              ),
            },
          ],
        },
      ],
    },
    {
      name: "03 Farmers",
      item: [
        {
          name: "Create farmer",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  userId: null,
                  farmerName: "Ravi Kumar",
                  village: "Nelamangala",
                  district: "Bangalore Rural",
                  state: "Karnataka",
                  landArea: 12.5,
                  soilType: "Red loam",
                },
                null,
                2
              ),
            },
            url: "{{baseUrl}}/api/v1/farmers",
            description:
              "**FARMER:** omit `userId` (uses current user). **ADMIN:** set `userId` to the target FARMER user id.",
          },
          response: [
            {
              name: "201 Created — sample",
              status: "Created",
              code: 201,
              _postman_previewlanguage: "json",
              header: [],
              cookie: [],
              body: JSON.stringify(
                {
                  id: 1,
                  userId: 1,
                  farmerName: "Ravi Kumar",
                  village: "Nelamangala",
                  district: "Bangalore Rural",
                  state: "Karnataka",
                  landArea: 12.5,
                  soilType: "Red loam",
                },
                null,
                2
              ),
            },
          ],
        },
        {
          name: "List all farmers (ADMIN only)",
          request: {
            method: "GET",
            header: [],
            url: "{{baseUrl}}/api/v1/farmers",
          },
          response: [
            {
              name: "200 OK — sample",
              status: "OK",
              code: 200,
              _postman_previewlanguage: "json",
              header: [],
              cookie: [],
              body: JSON.stringify(
                [
                  {
                    id: 1,
                    userId: 1,
                    farmerName: "Ravi Kumar",
                    village: "Nelamangala",
                    district: "Bangalore Rural",
                    state: "Karnataka",
                    landArea: 12.5,
                    soilType: "Red loam",
                  },
                ],
                null,
                2
              ),
            },
            {
              name: "403 Forbidden (FARMER)",
              status: "Forbidden",
              code: 403,
              _postman_previewlanguage: "json",
              header: [],
              cookie: [],
              body: JSON.stringify(
                {
                  timestamp: "2026-05-14T10:00:00Z",
                  status: 403,
                  error: "Forbidden",
                  message: "Only administrators can list all farmers",
                  path: "/api/v1/farmers",
                },
                null,
                2
              ),
            },
          ],
        },
        {
          name: "Get farmer by id",
          request: { method: "GET", header: [], url: "{{baseUrl}}/api/v1/farmers/{{farmerId}}" },
        },
        {
          name: "Update farmer",
          request: {
            method: "PUT",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  userId: null,
                  farmerName: "Ravi Kumar",
                  village: "Nelamangala",
                  district: "Bangalore Rural",
                  state: "Karnataka",
                  landArea: 13.0,
                  soilType: "Red loam",
                },
                null,
                2
              ),
            },
            url: "{{baseUrl}}/api/v1/farmers/{{farmerId}}",
          },
        },
        {
          name: "Delete farmer",
          request: { method: "DELETE", header: [], url: "{{baseUrl}}/api/v1/farmers/{{farmerId}}" },
          response: [
            {
              name: "204 No Content",
              status: "No Content",
              code: 204,
              _postman_previewlanguage: "Text",
              header: [],
              cookie: [],
              body: "",
            },
          ],
        },
      ],
    },
    {
      name: "04 Crops",
      item: [
        {
          name: "Add crop",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  farmerId: 1,
                  cropName: "Tomato",
                  cropType: "Vegetable",
                  sowingDate: "2026-03-01",
                  harvestingDate: null,
                  cropStatus: "GROWING",
                },
                null,
                2
              ),
            },
            url: "{{baseUrl}}/api/v1/crops",
          },
          response: [
            {
              name: "201 Created — sample",
              status: "Created",
              code: 201,
              _postman_previewlanguage: "json",
              header: [],
              cookie: [],
              body: JSON.stringify(
                {
                  id: 1,
                  farmerId: 1,
                  cropName: "Tomato",
                  cropType: "Vegetable",
                  sowingDate: "2026-03-01",
                  harvestingDate: null,
                  cropStatus: "GROWING",
                },
                null,
                2
              ),
            },
          ],
        },
        {
          name: "List crops by farmer",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/api/v1/crops?farmerId={{farmerId}}",
              host: ["{{baseUrl}}"],
              path: ["api", "v1", "crops"],
              query: [{ key: "farmerId", value: "{{farmerId}}" }],
            },
          },
        },
        {
          name: "Get crop by id",
          request: { method: "GET", header: [], url: "{{baseUrl}}/api/v1/crops/{{cropId}}" },
        },
        {
          name: "Update crop",
          request: {
            method: "PUT",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  farmerId: 1,
                  cropName: "Tomato",
                  cropType: "Vegetable",
                  sowingDate: "2026-03-01",
                  harvestingDate: "2026-06-15",
                  cropStatus: "READY_TO_HARVEST",
                },
                null,
                2
              ),
            },
            url: "{{baseUrl}}/api/v1/crops/{{cropId}}",
          },
        },
        {
          name: "Delete crop",
          request: { method: "DELETE", header: [], url: "{{baseUrl}}/api/v1/crops/{{cropId}}" },
        },
      ],
    },
    {
      name: "05 Sensor data",
      item: [
        {
          name: "Add sensor data",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  farmerId: 1,
                  temperature: 28.5,
                  humidity: 62.0,
                  soilMoisture: 35.0,
                },
                null,
                2
              ),
            },
            url: "{{baseUrl}}/api/v1/sensor-data",
          },
          response: [
            {
              name: "201 Created — sample",
              status: "Created",
              code: 201,
              _postman_previewlanguage: "json",
              header: [],
              cookie: [],
              body: JSON.stringify(
                {
                  id: 1,
                  farmerId: 1,
                  temperature: 28.5,
                  humidity: 62.0,
                  soilMoisture: 35.0,
                  recordedAt: "2026-05-14T10:15:00Z",
                },
                null,
                2
              ),
            },
          ],
        },
        {
          name: "Latest sensor data",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/api/v1/sensor-data/latest?farmerId={{farmerId}}",
              host: ["{{baseUrl}}"],
              path: ["api", "v1", "sensor-data", "latest"],
              query: [{ key: "farmerId", value: "{{farmerId}}" }],
            },
          },
        },
        {
          name: "All sensor data for farmer",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/api/v1/sensor-data?farmerId={{farmerId}}",
              host: ["{{baseUrl}}"],
              path: ["api", "v1", "sensor-data"],
              query: [{ key: "farmerId", value: "{{farmerId}}" }],
            },
          },
        },
      ],
    },
    {
      name: "06 Irrigation",
      item: [
        {
          name: "Start irrigation",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({ waterLevel: 75.0 }, null, 2),
            },
            url: "{{baseUrl}}/api/v1/irrigation/farmers/{{farmerId}}/start",
            description: "Body optional. Empty `{}` or omit body allowed.",
          },
          response: [
            {
              name: "201 Created — sample",
              status: "Created",
              code: 201,
              _postman_previewlanguage: "json",
              header: [],
              cookie: [],
              body: JSON.stringify(
                {
                  id: 1,
                  farmerId: 1,
                  irrigationStatus: "RUNNING",
                  waterLevel: 75.0,
                  motorState: "ON",
                  irrigationDate: "2026-05-14T10:20:00Z",
                },
                null,
                2
              ),
            },
          ],
        },
        {
          name: "Stop irrigation",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({ waterLevel: 40.0 }, null, 2),
            },
            url: "{{baseUrl}}/api/v1/irrigation/farmers/{{farmerId}}/stop",
          },
          response: [
            {
              name: "201 Created — sample",
              status: "Created",
              code: 201,
              _postman_previewlanguage: "json",
              header: [],
              cookie: [],
              body: JSON.stringify(
                {
                  id: 2,
                  farmerId: 1,
                  irrigationStatus: "STOPPED",
                  waterLevel: 40.0,
                  motorState: "OFF",
                  irrigationDate: "2026-05-14T10:25:00Z",
                },
                null,
                2
              ),
            },
          ],
        },
        {
          name: "Irrigation history",
          request: {
            method: "GET",
            header: [],
            url: "{{baseUrl}}/api/v1/irrigation/farmers/{{farmerId}}/history",
          },
        },
      ],
    },
    {
      name: "07 Weather (Open-Meteo)",
      item: [
        {
          name: "Current weather",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/api/v1/weather/current?latitude=12.97&longitude=77.59",
              host: ["{{baseUrl}}"],
              path: ["api", "v1", "weather", "current"],
              query: [
                { key: "latitude", value: "12.97" },
                { key: "longitude", value: "77.59" },
              ],
            },
          },
          response: [
            {
              name: "200 OK — sample",
              status: "OK",
              code: 200,
              _postman_previewlanguage: "json",
              header: [],
              cookie: [],
              body: JSON.stringify(
                {
                  latitude: 12.97,
                  longitude: 77.59,
                  temperatureC: 29.2,
                  humidityPercent: 58.4,
                  summary: "Mainly clear / partly cloudy / overcast",
                  fetchedAt: "2026-05-14T10:30:00Z",
                },
                null,
                2
              ),
            },
          ],
        },
        {
          name: "Temperature only",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/api/v1/weather/temperature?latitude=12.97&longitude=77.59",
              host: ["{{baseUrl}}"],
              path: ["api", "v1", "weather", "temperature"],
              query: [
                { key: "latitude", value: "12.97" },
                { key: "longitude", value: "77.59" },
              ],
            },
          },
          response: [
            {
              name: "200 OK",
              code: 200,
              _postman_previewlanguage: "json",
              body: JSON.stringify({ temperatureC: 29.2 }, null, 2),
            },
          ],
        },
        {
          name: "Humidity only",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/api/v1/weather/humidity?latitude=12.97&longitude=77.59",
              host: ["{{baseUrl}}"],
              path: ["api", "v1", "weather", "humidity"],
              query: [
                { key: "latitude", value: "12.97" },
                { key: "longitude", value: "77.59" },
              ],
            },
          },
          response: [
            {
              name: "200 OK",
              code: 200,
              _postman_previewlanguage: "json",
              body: JSON.stringify({ humidityPercent: 58.4 }, null, 2),
            },
          ],
        },
        {
          name: "Temperature + humidity (metrics)",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/api/v1/weather/metrics?latitude=12.97&longitude=77.59",
              host: ["{{baseUrl}}"],
              path: ["api", "v1", "weather", "metrics"],
              query: [
                { key: "latitude", value: "12.97" },
                { key: "longitude", value: "77.59" },
              ],
            },
          },
          response: [
            {
              name: "200 OK",
              code: 200,
              _postman_previewlanguage: "json",
              body: JSON.stringify(
                { temperatureC: 29.2, humidityPercent: 58.4 },
                null,
                2
              ),
            },
          ],
        },
        {
          name: "Save weather snapshot",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                { latitude: 12.97, longitude: 77.59, farmerId: 1 },
                null,
                2
              ),
            },
            url: "{{baseUrl}}/api/v1/weather/save",
            description: "`farmerId` optional; when set, must be a farmer you may access.",
          },
          response: [
            {
              name: "201 Created — sample",
              status: "Created",
              code: 201,
              _postman_previewlanguage: "json",
              header: [],
              cookie: [],
              body: JSON.stringify(
                {
                  id: 1,
                  latitude: 12.97,
                  longitude: 77.59,
                  temperatureC: 29.2,
                  humidityPercent: 58.4,
                  summary: "Mainly clear / partly cloudy / overcast",
                  farmerId: 1,
                  fetchedAt: "2026-05-14T10:30:00Z",
                },
                null,
                2
              ),
            },
          ],
        },
      ],
    },
    {
      name: "08 Notifications",
      item: [
        {
          name: "Send notification",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  farmerId: 1,
                  title: "Reminder",
                  message: "Inspect drip lines in block A.",
                  notificationType: "GENERAL",
                },
                null,
                2
              ),
            },
            url: "{{baseUrl}}/api/v1/notifications/send",
          },
          response: [
            {
              name: "201 Created — sample",
              status: "Created",
              code: 201,
              _postman_previewlanguage: "json",
              header: [],
              cookie: [],
              body: JSON.stringify(
                {
                  id: 1,
                  farmerId: 1,
                  title: "Reminder",
                  message: "Inspect drip lines in block A.",
                  notificationType: "GENERAL",
                  createdAt: "2026-05-14T10:35:00Z",
                },
                null,
                2
              ),
            },
          ],
        },
        {
          name: "List notifications",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/api/v1/notifications?farmerId={{farmerId}}",
              host: ["{{baseUrl}}"],
              path: ["api", "v1", "notifications"],
              query: [{ key: "farmerId", value: "{{farmerId}}" }],
            },
          },
        },
        {
          name: "Alert — low soil moisture",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                { farmerId: 1, soilMoisture: 18.0, threshold: 25.0 },
                null,
                2
              ),
            },
            url: "{{baseUrl}}/api/v1/notifications/alerts/low-soil-moisture",
            description: "Creates a notification only when `soilMoisture` < `threshold`.",
          },
        },
        {
          name: "Alert — weather",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  farmerId: 1,
                  message: "Heavy rain expected tomorrow evening.",
                },
                null,
                2
              ),
            },
            url: "{{baseUrl}}/api/v1/notifications/alerts/weather",
          },
        },
        {
          name: "Alert — irrigation",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  farmerId: 1,
                  message: "Motor stopped unexpectedly. Check power supply.",
                },
                null,
                2
              ),
            },
            url: "{{baseUrl}}/api/v1/notifications/alerts/irrigation",
          },
        },
      ],
    },
    {
      name: "09 Actuator (optional)",
      item: [
        {
          name: "Health (no auth)",
          request: {
            auth: { type: "noauth" },
            method: "GET",
            header: [],
            url: "{{baseUrl}}/actuator/health",
          },
          response: [
            {
              name: "200 OK — sample",
              code: 200,
              _postman_previewlanguage: "json",
              body: JSON.stringify({ status: "UP" }, null, 2),
            },
          ],
        },
      ],
    },
  ],
};

const out = path.join(__dirname, "Smart-Agriculture-API.postman_collection.json");
fs.writeFileSync(out, JSON.stringify(collection, null, 2));
console.log("Wrote", out);
