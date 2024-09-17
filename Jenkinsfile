pipeline {
    agent any
    stages {
        stage('Init') {
            steps {
                echo 'Initializing..'
                echo "Running ${env.BUILD_ID} on ${env.JENKINS_URL}"
            }
        }
        stage('Pull') {
            steps {
                sh 'git -C /opt/adm_panel_cicd/admin-panel/ pull'
            }
        }
        stage('Build') {
            steps {
                sh 'docker buildx build -f /opt/adm_panel_cicd/admin-panel/Dockerfile -t 178.57.106.190:5000/admin-panel:develop --platform linux/arm64 --push /opt/adm_panel_cicd/admin-panel'
            }
        }
        stage('Publish') {
            steps {
                sh """
                    ssh touchon@10.35.16.1 << EOF
                    cd /opt/touchon/adm
                    docker-compose pull adm
                    docker-compose up --force-recreate --build -d adm
                    docker system prune -af
                    EOF
                """
            }
        }
        stage('Cleanup') {
            steps {
                echo 'Cleaning..'
                echo 'Running docker rmi..'
            }
        }
    }
}
