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

                    // 停掉並移除舊容器
                    sh "docker stop ${CONTAINER_NAME} || true"
                    sh "docker rm ${CONTAINER_NAME} || true"

                    // 啟動新版本容器
                    sh "docker run -d --name ${CONTAINER_NAME} -p ${CONTAINER_PORT}:80 --restart unless-stopped ${IMAGE_NAME}:${IMAGE_TAG}"

                    // 健康檢查：用容器內部 IP 檢查（避免 Jenkins 容器的 localhost 指向自己）
                    retry(5) {
                        sleep 3
                        sh """
                            CONTAINER_IP=\$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ${CONTAINER_NAME})
                            curl -f http://\${CONTAINER_IP}:80
                        """
                    }
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
                // 檢查容器是否存活
                def running = sh(
                    script: "docker ps -q -f name=^${CONTAINER_NAME}\$",
                    returnStdout: true
                ).trim()

                if (!running && env.OLD_IMAGE) {
                    echo "新版本啟動失敗，正在用 ${env.OLD_IMAGE} 還原..."
                    sh "docker rm ${CONTAINER_NAME} || true"
                    sh "docker run -d --name ${CONTAINER_NAME} -p ${CONTAINER_PORT}:80 --restart unless-stopped ${env.OLD_IMAGE} || true"
                    echo "已還原至舊版本 ${env.OLD_IMAGE}"
                } else if (running) {
                    echo "容器仍在運行（可能是 Build 階段失敗）"
                } else {
                    echo "無舊版本 image 可還原（可能是首次部署）"
                }

                echo "Build #${env.BUILD_NUMBER} failed."
            }
        }
        always {
            // 清理 dangling images
            sh "docker image prune -f || true"

            // 只保留最近 5 個版本，刪除更舊的 image
            sh """
                docker images ${IMAGE_NAME} --format '{{.Tag}}' \
                  | grep -E '^[0-9]+\$' \
                  | sort -rn \
                  | tail -n +6 \
                  | xargs -r -I {} docker rmi ${IMAGE_NAME}:{} || true
            """

            cleanWs()
        }
    }
}
