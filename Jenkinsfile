pipeline {
    agent any

    options {
        timeout(time: 15, unit: 'MINUTES')
        timestamps()
    }

    parameters {
        choice(
            name: 'SUITE',
            choices: ['all', 'smoke', 'regression', 'ui', 'api'],
            description: 'Which tests to run'
        )
    }

    environment {
        CI = 'true'   // enables retries/forbidOnly from playwright.config.ts
    }

    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Type check') {
            steps {
                sh 'npm run typecheck'
            }
        }

        // A single run for the chosen suite, so junit.xml and the HTML report
        // contain every test. Separate runs would overwrite each other's reports.
        stage('Tests') {
            steps {
                script {
                    def args = [
                        all       : '',
                        smoke     : '--grep @smoke',
                        regression: '--grep @regression',
                        ui        : '--project=ui',
                        api       : '--project=api',
                    ][params.SUITE ?: 'all']
                    sh "npx playwright test ${args}"
                }
            }
        }
    }

    post {
        always {
            // junit.xml -> Test Result tab and trend chart
            junit allowEmptyResults: true, testResults: 'test-results/junit.xml'
            // Playwright HTML report -> link on the build page
            publishHTML(target: [
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report',
                keepAll: true,
                allowMissing: true,
                alwaysLinkToLastBuild: true
            ])
            // Traces, screenshots and videos of failed tests
            archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
        }
    }
}
