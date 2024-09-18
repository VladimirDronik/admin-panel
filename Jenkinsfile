pipeline {
    agent any
    environment {
        GIT_COMMIT = sh (script: "git log -n 1 --pretty=format:'%h'", returnStdout: true)
        GIT_COMMITER = sh (script: "git show -s --pretty=%an", returnStdout: true)
        SERVICE = 'Admin-panel'
    }
    stages {
        stage('Pull') {
            steps {
                sh 'git -C /opt/adm_panel_cicd/admin-panel/ pull'
            }
        }
        stage('Build') {
            steps {
                sh """
                    docker buildx build \
                    -f /opt/adm_panel_cicd/admin-panel/Dockerfile \
                    -t 178.57.106.190:5000/admin-panel:develop \
                    --platform linux/arm64 \
                    --push \
                    /opt/adm_panel_cicd/admin-panel
                """
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
                    << EOF
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
    
    post {
        success {
            withCredentials(
                [
                    string(credentialsId: 'telegram_chat_id', variable: 'CHAT'),
                    string(credentialsId: 'telegram_bot_token', variable: 'TOKEN')
                ]
            ) {
                sh  ("""
                    curl -s -X POST https://api.telegram.org/bot${TOKEN}/sendMessage \
                    -d chat_id=${CHAT} -d parse_mode=markdown \
                    -d text='\\[CI/CD] *${env.SERVICE}*: SUCSESS%0ACommit: ${env.GIT_COMMIT} by ${env.GIT_COMMITER}'
        """)
            }
        }

        aborted {
            withCredentials(
                [
                    string(credentialsId: 'telegram_chat_id', variable: 'CHAT'),
                    string(credentialsId: 'telegram_bot_token', variable: 'TOKEN')
                ]
            ) {
                sh """
                    curl -s -X POST https://api.telegram.org/bot${TOKEN}/sendMessage \
                    -d chat_id=${CHAT} -d parse_mode=markdown \
                    -d text='\\[CI/CD] *${env.SERVICE}*: ABORTED'
                """
            }
        }
     
        failure {
            withCredentials(
                [
                    string(credentialsId: 'telegram_chat_id', variable: 'CHAT'),
                    string(credentialsId: 'telegram_bot_token', variable: 'TOKEN')
                ]
            ) {
                sh  """
                    curl -s -X POST https://api.telegram.org/bot${TOKEN}/sendMessage \
                    -d chat_id=${CHAT} -d parse_mode=markdown \
                    -d text='\\[CI/CD] *${env.SERVICE}*: FAILURE'
                """
            }
        }
    }
}
