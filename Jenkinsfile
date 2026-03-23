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
                script {
                    // 記錄舊的 image tag（部署失敗時用來還原）
                    env.OLD_IMAGE = sh(
                        script: "docker inspect ${CONTAINER_NAME} --format='{{.Config.Image}}' 2>/dev/null || echo ''",
                        returnStdout: true
                    ).trim()
                    echo "舊版本 image: ${env.OLD_IMAGE}"

                    // 清理可能殘留的舊 _new 容器
                    sh "docker stop ${CONTAINER_NAME}_new || true"
                    sh "docker rm ${CONTAINER_NAME}_new || true"

                    // 啟動臨時容器（不綁 port，僅用於健康檢查）
                    sh "docker run -d --name ${CONTAINER_NAME}_new ${IMAGE_NAME}:${IMAGE_TAG}"

                    // 健康檢查：透過 docker exec 從容器內部檢查，不需要暴露 port
                    retry(5) {
                        sleep 3
                        sh "docker exec ${CONTAINER_NAME}_new wget -q --spider http://localhost:80"
                    }

                    // 健康檢查通過 → 停掉臨時容器 → 停掉舊容器 → 用正式 port 啟動新版本
                    sh """
                        docker stop ${CONTAINER_NAME}_new && docker rm ${CONTAINER_NAME}_new
                        docker stop ${CONTAINER_NAME} || true
                        docker rm ${CONTAINER_NAME} || true
                        docker run -d --name ${CONTAINER_NAME} -p ${CONTAINER_PORT}:80 --restart unless-stopped ${IMAGE_NAME}:${IMAGE_TAG}
                    """
                }
            }
        }
    }

    post {
        success {
            echo "Build #${env.BUILD_NUMBER} succeeded — deployed at http://localhost:${CONTAINER_PORT}"
        }
        failure {
            script {
                // 清理失敗的臨時容器
                sh "docker stop ${CONTAINER_NAME}_new || true"
                sh "docker rm ${CONTAINER_NAME}_new || true"

                // 如果舊容器已被移除（部署中途失敗），嘗試用舊 image 還原
                def running = sh(
                    script: "docker ps -q -f name=^${CONTAINER_NAME}\$",
                    returnStdout: true
                ).trim()

                if (!running && env.OLD_IMAGE) {
                    echo "舊容器已不存在，正在用 ${env.OLD_IMAGE} 還原..."
                    sh "docker run -d --name ${CONTAINER_NAME} -p ${CONTAINER_PORT}:80 --restart unless-stopped ${env.OLD_IMAGE} || true"
                    echo "已還原至舊版本 ${env.OLD_IMAGE}"
                } else if (running) {
                    echo "舊容器仍在運行，無需還原"
                } else {
                    echo "無舊版本 image 可還原（可能是首次部署）"
                }

                echo "Build #${env.BUILD_NUMBER} failed."
            }
        }
        always {
            // 清理未使用的 Docker images，避免磁碟空間耗盡
            sh "docker image prune -f || true"
            cleanWs()
        }
    }
}
