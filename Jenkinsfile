def func_telegram_sendMessage(message, token, chatid) {
    try {
        sh """
            curl -s -X POST https://api.telegram.org/bot${token}/sendMessage \
            -d chat_id=${chatid} -d parse_mode=markdown \
            -d text='${message}'
        """
    } catch(Exception e) {
        currentBuild.result = 'SUCCESS'
    }
}
    

pipeline {
    agent any
    environment {
        GIT_COMMIT = sh (script: "git log -n 1 --pretty=format:'%h'", returnStdout: true)
        GIT_COMMIT_COMMENT = sh (script: "git show --pretty=format:'%B' --no-patch -n 1 $GIT_COMMIT", returnStdout: true)
        GIT_COMMITER = sh (script: "git show -s --pretty=%an", returnStdout: true)
        SERVICE = 'Admin-panel'
        CHAT = credentials('telegram_chat_id')
        TOKEN = credentials('telegram_bot_token')
        MESSAGE_BASE = "\\[CI/CD] *${env.SERVICE}*: "
        INIT_MESSAGE = "${env.MESSAGE_BASE}STARTED"
        SUCCESS_MESSAGE = "${env.MESSAGE_BASE}SUCSESS%0ACommit ${env.GIT_COMMIT} by ${env.GIT_COMMITER}${env.GIT_COMMIT_COMMENT}"
        FAIL_MESSAGE = "${env.MESSAGE_BASE}FAILURE"
        ABORT_MESSAGE = "${env.MESSAGE_BASE}ABORTED"
    }
    stages {
        stage('Notification') {
            steps {
                func_telegram_sendMessage("${env.INIT_MESSAGE}", "${env.TOKEN}", "${env.CHAT}")
            }
        }
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
    }
    
    post {
        success {
            script {
                func_telegram_sendMessage("${env.SUCCESS_MESSAGE}", "${env.TOKEN}", "${env.CHAT}")
            }
        }

        aborted {
            script {
                func_telegram_sendMessage("${env.ABORT_MESSAGE}", "${env.TOKEN}", "${env.CHAT}")
            }
        }
     
        failure {
            script {
                func_telegram_sendMessage("${env.FAIL_MESSAGE}", "${env.TOKEN}", "${env.CHAT}")
            }
        }
    }
}
