# 🌱 Smart Agriculture System

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge\&logo=react\&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge\&logo=vite\&logoColor=white)](https://vitejs.dev/)
[![Spring Boot](https://img.shields.io/badge/SpringBoot-6DB33F?style=for-the-badge\&logo=springboot\&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge\&logo=openjdk\&logoColor=white)](https://www.java.com/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge\&logo=mysql\&logoColor=white)](https://www.mysql.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge\&logo=jsonwebtokens\&logoColor=white)](https://jwt.io/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge\&logo=tailwind-css\&logoColor=white)](https://tailwindcss.com/)
[![Hibernate](https://img.shields.io/badge/Hibernate-59666C?style=for-the-badge\&logo=hibernate\&logoColor=white)](https://hibernate.org/)

---

# 📋 Project Overview

> **Smart Agriculture System** is a modern full-stack agriculture management platform developed using React, Spring Boot, MySQL, and JWT Authentication.
> The system helps farmers manage crops, irrigation, sensor monitoring, weather data, and notifications through an interactive dashboard.

This project demonstrates:

* Full-stack development
* REST API integration
* JWT authentication
* Real-world agriculture monitoring concepts
* Modern responsive UI/UX

---

# ✨ Features at a Glance

| Module                      | Key Features                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------------ |
| 👨‍🌾 **Farmer Management** | • Farmer Profile Creation<br>• Farm Details Management<br>• Land & Soil Information        |
| 🌾 **Crop Management**      | • Add Crops<br>• Crop Status Tracking<br>• Sowing & Harvest Records                        |
| 💧 **Irrigation System**    | • Start/Stop Irrigation<br>• Irrigation History<br>• Water Level Monitoring                |
| 📡 **Sensor Monitoring**    | • Soil Moisture Monitoring<br>• Temperature & Humidity Data<br>• Real-Time Sensor Readings |
| 🌦️ **Weather Module**      | • Weather Tracking<br>• Environmental Monitoring                                           |
| 🔔 **Notifications**        | • Smart Alerts<br>• Irrigation Notifications<br>• Sensor-Based Alerts                      |
| 🔐 **Authentication**       | • JWT Login/Register<br>• Secure APIs<br>• Protected Routes                                |

---

# 🚀 Workflow Diagram

```mermaid
flowchart LR
    A[Farmer Login/Register] --> B[Create Farmer Profile]
    B --> C[Add Crops]
    C --> D[Monitor Sensor Data]
    D --> E[Check Soil Moisture]
    E --> F[Start Irrigation]
    F --> G[Monitor Water Level]
    G --> H[Stop Irrigation]
    H --> I[View Notifications & Reports]
```

# 🛠️ Tech Stack

| Technology    | Usage                     |
| ------------- | ------------------------- |
| React + Vite  | Frontend Development      |
| Spring Boot   | Backend REST APIs         |
| Hibernate/JPA | Database ORM              |
| MySQL         | Database                  |
| JWT           | Authentication & Security |
| Tailwind CSS  | UI Styling                |
| Framer Motion | Animations                |
| Recharts      | Dashboard Charts          |

---

# 📂 Project Structure

```bash
Smart-Agriculture-System
│
├── Backend
│   ├── controller
│   ├── service
│   ├── repository
│   ├── entity
│   ├── dto
│   └── security
│
├── Frontend
│   ├── components
│   ├── pages
│   ├── services
│   ├── layouts
│   └── routes
```

---

# 🗄️ Database Tables

* users
* farmers
* crops
* irrigation_events
* sensor_data
* weather_records
* notifications

---

# ⚡ Installation & Setup

## 🔹 Backend Setup

```bash
cd Backend
mvn spring-boot:run
```

Backend runs on:

```bash
http://localhost:8080
```

---

## 🔹 Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# 🔑 API Testing

Swagger UI:

```bash
http://localhost:8080/swagger-ui/index.html
```

---

# 🌍 Real-World Use Case

This system can be integrated with:

* Arduino
* ESP8266
* Soil Moisture Sensors
* Temperature Sensors
* IoT-based irrigation systems

to automate smart farming operations.

---

# 🚀 Future Improvements

* 🤖 AI Crop Recommendations
* 📲 SMS/Email Alerts
* 🌐 IoT Integration
* 📡 Real-Time Sensor Streaming
* 🌾 Crop-wise Irrigation
* ☁️ Cloud Deployment

---

# 👨‍💻 Author

### Pranav Nanaware

Full Stack Java Developer
Passionate about Java, Spring Boot, React, and IoT-based Smart Systems.

---

# 📜 License

This project is developed for educational and learning purposes.
