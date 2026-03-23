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

        stage('Install & Test') {
            steps {
                sh 'npm ci'
                sh 'npm run lint  || true'
                sh 'npm run test || true'
                sh 'npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest ."
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // 記錄舊的 image tag（用來還原）
                    def oldTag = sh(
                        script: "docker inspect ${CONTAINER_NAME} --format='{{.Config.Image}}' || echo ''",
                        returnStdout: true
                    ).trim()

                    // 啟動新容器（先用不同名稱，port 統一使用 CONTAINER_PORT）
                    sh "docker run -d --name ${CONTAINER_NAME}_new -p ${CONTAINER_PORT}:80 --restart unless-stopped ${IMAGE_NAME}:${IMAGE_TAG}"

                    // 健康檢查：retry 5 次，每次間隔 3 秒
                    retry(5) {
                        sleep 3
                        sh "curl -f http://localhost:${CONTAINER_PORT}"
                    }

                    // 健康檢查通過，停舊容器、換新容器
                    sh """
                        docker stop ${CONTAINER_NAME} || true
                        docker rm ${CONTAINER_NAME} || true
                        docker rename ${CONTAINER_NAME}_new ${CONTAINER_NAME}
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Build #${env.BUILD_NUMBER} succeeded — deployed at http://localhost:${CONTAINER_PORT}"
        }
        failure {
            sh "docker stop ${CONTAINER_NAME}_new || true"
            sh "docker rm ${CONTAINER_NAME}_new || true"
            echo "❌ 部署失敗，舊版本仍在運行"
            echo "❌ Build #${env.BUILD_NUMBER} failed."
        }
        always {
            // 清理未使用的 Docker images，避免磁碟空間耗盡
            sh "docker image prune -f || true"
            cleanWs()
        }
    }
}
