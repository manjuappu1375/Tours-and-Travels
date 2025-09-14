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