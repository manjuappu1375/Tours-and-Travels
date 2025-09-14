# TravelX - Full-Stack Tour and Travel Agency

This is a full-stack, cloud-ready Travel & Tourism platform where users can discover, book, and explore tours, while administrators manage the entire ecosystem.

## Features

-   User authentication (Login/Register)
-   Tour browsing, searching, and filtering
-   Detailed tour pages with image galleries and daily itineraries
-   Wishlist functionality
-   Secure booking process with coupon support
-   AI-powered travel tips for each tour
-   User profile and booking history
-   Comprehensive Admin Panel:
    -   Dashboard with key metrics
    -   Manage Tours, Bookings, Users, and Coupons

## Technology Stack

-   **Frontend:** React, Vite, TypeScript, Tailwind CSS
-   **Backend:** Node.js, Express, MongoDB, Mongoose
-   **Authentication:** JWT (JSON Web Tokens)
-   **AI:** Google Gemini API
-   **Containerization:** Docker
-   **CI/CD:** Jenkins
-   **Orchestration:** Kubernetes
-   **Configuration Management:** Ansible

## Getting Started

To run this project locally, follow these steps. The setup is streamlined to start both the backend and frontend servers with a single command from the root directory.

### Prerequisites

-   Node.js (v18 or newer recommended)
-   npm (or your preferred package manager)
-   MongoDB (a local instance or a cloud service like MongoDB Atlas)

### 1. Backend Configuration

1.  **Navigate to the `server` directory:**
    ```bash
    cd server
    ```
2.  **Create a `.env` file:**
    In the `server` directory, create a file named `.env` and add the following environment variables. Replace the placeholder values with your actual data.

    ```env
    PORT=5000
    NODE_ENV=development
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key
    API_KEY=your_google_gemini_api_key
    ```
    -   `MONGO_URI`: Your connection string for your MongoDB database.
    -   `JWT_SECRET`: A long, random string for securing authentication tokens.
    -   `API_KEY`: Your API key for the Google Gemini API (required for the travel tips feature).

### 2. Install Dependencies & Seed Database

1.  **Go back to the project's root directory** (e.g., run `cd ..` if you are in the `server` directory).

2.  **Install all dependencies** for both the client and server with one command:
    ```bash
    npm run install:all
    ```

3.  **(Optional but Recommended) Seed the database:**
    From the root directory, run this command to populate the database with initial sample data (tours, users, coupons).
    ```bash
    npm run data:import
    ```

### 3. Start Both Servers

From the **root directory**, run the main development command:
```bash
npm run dev
```
This single command will:
-   Start the backend API server on `http://localhost:5000`.
-   Start the frontend Vite development server (usually on `http://localhost:5173`).

Your browser should open automatically, or you can navigate to the Vite server URL shown in your terminal. With both servers running correctly, the "Network Error" will be resolved.

---

## Deployment with Docker & Kubernetes

This project includes files to containerize the frontend and backend applications and deploy them to a Kubernetes cluster.

### 1. Kubernetes Secret

Before deploying, you must create a Kubernetes secret to hold the sensitive environment variables for the backend. Encode your values in Base64.

Example:
`echo -n 'your_mongodb_connection_string' | base64`

Create the secret using a manifest or imperative command:
```bash
kubectl create secret generic travelx-backend-secrets \
--from-literal=MONGO_URI='your_base64_encoded_mongo_uri' \
--from-literal=JWT_SECRET='your_base64_encoded_jwt_secret' \
--from-literal=API_KEY='your_base64_encoded_gemini_api_key'
```

### 2. Update API URL for Production

For a Kubernetes deployment, the frontend needs to know how to reach the backend service. You would typically update `client/services/api.ts` to point to the internal Kubernetes service name, or use an Ingress controller.

For example, change `baseURL` to `http://travelx-backend-service/api`. This change is best handled with build-time environment variables in a production pipeline.

### 3. Deploy to Cluster

Once your Docker images are built and pushed to a registry, and your secret is created, you can deploy the entire application stack:
```bash
kubectl apply -f deploy/k8s/
```
This command will create the ConfigMap, Deployments, and Services defined in the `deploy/k8s` directory.

---
