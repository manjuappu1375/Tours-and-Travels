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

## CI/CD Pipeline (Jenkins)

Below is a production-ready Jenkins declarative pipeline designed for this monorepo structure. It includes stages for code quality analysis (SonarQube), dependency vulnerability scanning (OWASP), container image scanning (Trivy), and deployment.

```groovy
pipeline {
  agent any

  environment {
    REGISTRY           = "YOUR_REGISTRY_URL"      // e.g. 123456789012.dkr.ecr.us-east-1.amazonaws.com
    DOCKER_CREDENTIALS = "docker-creds-id"        // Jenkins credentials id for your container registry
    APP_NAME           = "travelx"
    SONARQUBE_SERVER   = "SonarQube"              // Jenkins SonarQube server config name
    ARTIFACTORY        = "artifactory-server"     // Jenkins Artifactory server config name
    TRIVY_HOME         = "/usr/local/bin/trivy"   // Path to Trivy executable on the agent
    ODC_INSTALLATION   = "Default"                // OWASP Dependency-Check Jenkins tool installation name
    KUBECONFIG         = credentials('kubeconfig-id') // Jenkins credentials id for your Kubernetes cluster config
  }

  options {
    buildDiscarder(logRotator(numToKeepStr: '20'))
    timestamps()
  }

  stages {
    stage('Checkout') {
      steps {
        cleanWs()
        checkout scm
      }
    }

    stage('Install Dependencies') {
        parallel {
            stage('Install Client Deps') {
                steps {
                    dir('client') {
                        sh 'npm ci'
                    }
                }
            }
            stage('Install Server Deps') {
                steps {
                    dir('server') {
                        sh 'npm ci'
                    }
                }
            }
        }
    }

    stage('SonarQube Analysis') {
      steps {
        // This stage uses the sonar-scanner CLI, which is made available by the withSonarQubeEnv wrapper.
        // It reads its configuration from the sonar-project.properties file in the repository root.
        withSonarQubeEnv("${SONARQUBE_SERVER}") {
          sh "sonar-scanner"
        }
      }
    }

    stage('OWASP Dependency-Check') {
      steps {
        sh 'mkdir -p dependency-reports'
        // Frontend scan
        dir('client') {
          dependencyCheck additionalArguments: "--project ${APP_NAME}-frontend --scan . --format HTML --out ../dependency-reports/frontend", odcInstallation: "${ODC_INSTALLATION}"
        }
        // Backend scan
        dir('server') {
          dependencyCheck additionalArguments: "--project ${APP_NAME}-backend --scan . --format HTML --out ../dependency-reports/backend", odcInstallation: "${ODC_INSTALLATION}"
        }
      }
      post {
        always {
          publishHTML([allowMissing: true, reportDir: 'dependency-reports/frontend', reportFiles: 'dependency-check-report.html', reportName: 'OWASP Frontend Report', alwaysLinkToLastBuild: true])
          publishHTML([allowMissing: true, reportDir: 'dependency-reports/backend', reportFiles: 'dependency-check-report.html', reportName: 'OWASP Backend Report', alwaysLinkToLastBuild: true])
        }
      }
    }

    stage('Build Docker Images') {
      steps {
        parallel(
          "Frontend Image": {
            // Build context is the client directory
            sh "docker build -t ${REGISTRY}/${APP_NAME}-frontend:${BUILD_NUMBER} -f Dockerfile.frontend ."
          },
          "Backend Image": {
            // Build context is the root, but Dockerfile is specific to backend
            sh "docker build -t ${REGISTRY}/${APP_NAME}-backend:${BUILD_NUMBER} -f Dockerfile.backend ."
          }
        )
      }
    }

    stage('Trivy Security Scans') {
        steps {
            script {
              // The '|| true' ensures the pipeline stage succeeds regardless, turning this into a report-only scan.
              // Remove '|| true' to enforce a strict policy where the build fails on critical vulnerabilities.
              sh "${TRIVY_HOME} image --exit-code 1 --severity HIGH,CRITICAL --format json --output trivy-frontend.json ${REGISTRY}/${APP_NAME}-frontend:${BUILD_NUMBER} || true"
              sh "${TRIVY_HOME} image --exit-code 1 --severity HIGH,CRITICAL --format json --output trivy-backend.json ${REGISTRY}/${APP_NAME}-backend:${BUILD_NUMBER} || true"
              archiveArtifacts allowEmptyArchive: true, artifacts: 'trivy-*.json', fingerprint: true
            }
        }
    }

    stage('Push Images') {
      steps {
        withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh "echo $DOCKER_PASS | docker login $REGISTRY -u $DOCKER_USER --password-stdin"
          // Tag with build number and latest
          sh "docker tag ${REGISTRY}/${APP_NAME}-frontend:${BUILD_NUMBER} ${REGISTRY}/${APP_NAME}-frontend:latest"
          sh "docker tag ${REGISTRY}/${APP_NAME}-backend:${BUILD_NUMBER} ${REGISTRY}/${APP_NAME}-backend:latest"
          // Push both tags
          sh "docker push ${REGISTRY}/${APP_NAME}-frontend --all-tags"
          sh "docker push ${REGISTRY}/${APP_NAME}-backend --all-tags"
        }
      }
    }
    
    stage('Quality Gate') {
        steps {
            // This step requires the SonarQube Quality Gate webhook to be configured in SonarQube.
            // It pauses the pipeline until SonarQube reports the gate status.
            waitForQualityGate abortPipeline: true
        }
    }

    stage('Deploy to Kubernetes') {
      steps {
        echo "Deploying to Kubernetes cluster..."
        // Replace image placeholders in the deployment manifest
        sh "sed -i 's|YOUR_REGISTRY_URL|${REGISTRY}|g' deploy/k8s/deployment.yaml"
        sh "sed -i 's|:latest|:${BUILD_NUMBER}|g' deploy/k8s/deployment.yaml"
        
        // Apply the manifests
        sh "kubectl --kubeconfig ${KUBECONFIG} apply -f deploy/k8s/"
      }
    }
  }

  post {
    always {
        cleanWs()
    }
    success {
      echo "✅ Pipeline succeeded with quality & security checks"
    }
    unstable {
      echo "⚠️ Pipeline is unstable (e.g., SonarQube Quality Gate warnings)"
    }
    failure {
      echo "🔥 Pipeline failed — inspect SonarQube, Trivy, OWASP, or build logs"
    }
  }
}
```