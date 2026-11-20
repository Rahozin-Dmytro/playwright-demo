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

        stage('API tests') {
            steps {
                sh 'npx playwright test --project=api'
            }
        }

        stage('UI tests') {
            steps {
                sh 'npx playwright test --project=ui'
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
