pipeline {
    agent any

    environment {
        IMAGE_NAME      = 'prototype-spa'
        IMAGE_TAG       = "${env.BUILD_NUMBER}"
        CONTAINER_NAME  = 'prototype-spa'
        CONTAINER_PORT  = '8080'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Build') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest ."
            }
        }

        stage('Deploy') {
            steps {
                sh """
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true
                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        -p ${CONTAINER_PORT}:80 \
                        --restart unless-stopped \
                        ${IMAGE_NAME}:${IMAGE_TAG}
                """
            }
        }
    }

    post {
        success {
            echo "✅ Build #${env.BUILD_NUMBER} succeeded — deployed at http://localhost:${CONTAINER_PORT}"
        }
        failure {
            echo "❌ Build #${env.BUILD_NUMBER} failed."
        }
        always {
            cleanWs()
        }
    }
}
