pipeline {
    agent any

    options {
        timeout(time: 15, unit: 'MINUTES')
        timestamps()
    }

    environment {
        CI = 'true'   // вмикає retries/forbidOnly з playwright.config.ts
    }

    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        // Один запуск на всі проєкти (api + ui): так junit.xml і HTML-звіт
        // містять усі тести. Окремі запуски перезаписували б один одного.
        stage('Tests') {
            steps {
                sh 'npx playwright test'
            }
        }
    }

    post {
        always {
            // junit.xml -> вкладка Tests у Jenkins
            junit allowEmptyResults: true, testResults: 'test-results/junit.xml'
            // HTML-звіт Playwright -> посилання на сторінці збірки
            publishHTML(target: [
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report',
                keepAll: true,
                allowMissing: true,
                alwaysLinkToLastBuild: true
            ])
        }
    }
}
