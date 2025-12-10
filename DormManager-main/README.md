DormManager – Student Housing Management System

DormManager is a full-stack web application designed to manage student housing operations at the university.  
It includes spaces for **Étudiants**, **Gestionnaires**, **Agents Techniques**, and **Administrateurs**.

---

##  Project Overview

**Backend:** Spring Boot + Hibernate (MySQL)  
**Frontend:** React + TypeScript (Vite)  
**Database:** MySQL 8.0  
**Java Version:** 17 or higher

---

##  Prerequisites

Before running the project, make sure you have:

- [Java JDK 17+](https://www.oracle.com/java/technologies/javase-jdk17-downloads.html)
- [Maven](https://maven.apache.org/download.cgi)
- [Node.js 18+](https://nodejs.org/en/)
- [MySQL 8.0](https://dev.mysql.com/downloads/)
- [Git](https://git-scm.com/)

---

##  Backend Setup (Spring Boot)

### 1. Open the backend project
The backend source code is located in:
```

/dormmanager-backend/

````

### 2. Configure your database
Edit the `src/main/resources/application.properties` file:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/dormmanager_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.sql.init.mode=always
spring.jpa.defer-datasource-initialization=true
server.port=8081
````

### 3. Run the backend

#### Option 1: Using an IDE (recommended)

* Open the project in **NetBeans**, **IntelliJ**, or **Eclipse**
* Run the main class:

  ```
  com.dormmanager.DormManagerApplication
  ```

#### Option 2: Using terminal

```bash
cd dormmanager-backend
mvn spring-boot:run
```

###  Backend should start on:

```
http://localhost:8081
```

---

##  Frontend Setup (React + Vite)

### 1. Open the frontend project

```
/dormmanager-frontend/
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure proxy (optional)

To make sure frontend requests reach the backend, check `vite.config.js` and ensure it contains:

```js
server: {
  proxy: {
    '/api': 'http://localhost:8081'
  }
}
```

### 4. Run the frontend

```bash
npm run dev
```

###  Frontend runs on:

```
http://localhost:3000
```

---

##  Login Credentials (Demo)

| Role                | Email                                         | Password    |
| ------------------- | --------------------------------------------- | ----------- |
| **Admin**           | [admin@uiz.ac.ma](mailto:admin@uiz.ac.ma)     | admin123    |
| **Gestionnaire**    | [hassan@uiz.ac.ma](mailto:hassan@uiz.ac.ma)   | gestion123  |
| **Agent Technique** | [fatima@uiz.ac.ma](mailto:fatima@uiz.ac.ma)   | agent123    |
| **Étudiant**        | [yasmine@uiz.ac.ma](mailto:yasmine@uiz.ac.ma) | etudiant123 |

---

##  Features

### Étudiant

* Soumettre une demande d’hébergement
* Consulter l’état de ses demandes
* Voir ses affectations et réclamations

### Gestionnaire

* Consulter et valider/rejeter les demandes
* Gérer les chambres disponibles
* Visualiser les incidents et réclamations

### Agent Technique

* Suivre les incidents signalés
* Mettre à jour leur statut

### Administrateur

* Consulter les statistiques globales
* Gérer les utilisateurs et les rôles

---

##  Tech Stack

**Backend:**

* Spring Boot 3.x
* Spring Data JPA (Hibernate)
* MySQL 8
* Java 17
* RESTful API

**Frontend:**

* React 18 (Vite)
* TypeScript
* TailwindCSS
* Lucide Icons

---

##  Collaborators

* **Fatima Ezzahra Boulouiz**
* **Yasmine Ait Houssa**
* **ahmed elhiba**

---

##  Useful Commands

**Build backend:**

```bash
mvn clean install
```

**Run frontend in dev mode:**

```bash
npm run dev
```

**Build frontend for production:**

```bash
npm run build
```

**Run backend tests:**

```bash
mvn test
```

---

##  Tips

* If you restart the backend and lose data, check `spring.jpa.hibernate.ddl-auto` (set to `update`).
* The backend API endpoints are under:

  ```
  http://localhost:8081/api/
  ```
* The frontend auto-connects to these APIs through `/api/...`.

---

## 🩵 License

This project is for educational purposes at **Université Ibn Zohr – Master Ingénierie Logicielle**.

---

*Last Updated:* 20 November 2025

