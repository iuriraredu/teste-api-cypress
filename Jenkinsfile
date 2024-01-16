pipeline {
    agent any

    stages {
        stage('Clonar o repositorio') {
            steps {
                git branch: 'main', url: 'https://github.com/iuriraredu/testes-api-cy.git'
            }
        }
                stage('Instalar dependendias') {
            steps {
                sh 'npm install'
            }
                stage('Executar testes') {
            steps {
                sh 'NO_COLOR=1 npm run cy:run'
                }
            }
        }
    }
}