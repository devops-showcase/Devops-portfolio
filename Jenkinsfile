pipeline {
    agent any

    environment {
        // Jenkins credentials IDs
        AWS_ACCESS_KEY_ID     = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
        AWS_REGION            = credentials('AWS_REGION')
        ECR_REPOSITORY        = credentials('ECR_REPOSITORY')
        EC2_HOST              = credentials('EC2_HOST')
        EC2_USER              = credentials('EC2_USER')
        EC2_SSH_KEY           = credentials('EC2_SSH_KEY') // Private key stored in Jenkins
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'git@github.com:devops-showcase/Devops-portfolio.git'
            }
        }

        stage('Set Image Tag') {
            steps {
                script {
                    IMAGE_TAG = "${env.GIT_COMMIT.take(7)}"
                    echo "Docker image tag: ${IMAGE_TAG}"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                docker build -t portfolio:${IMAGE_TAG} .
                """
            }
        }

        stage('Login to AWS ECR') {
            steps {
                sh """
                ACCOUNT_ID=\$(aws sts get-caller-identity --query Account --output text)
                ECR_URL="\${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY##*/}"
                aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin \${ECR_URL}
                """
            }
        }

        stage('Tag and Push Docker Image') {
            steps {
                sh """
                ACCOUNT_ID=\$(aws sts get-caller-identity --query Account --output text)
                ECR_URL="\${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY##*/}"
                docker tag portfolio:${IMAGE_TAG} \${ECR_URL}:${IMAGE_TAG}
                docker push \${ECR_URL}:${IMAGE_TAG}
                """
            }
        }

        stage('Deploy to EC2') {
            steps {
                sh """
                # Create temporary SSH key file
                echo "${EC2_SSH_KEY}" > ec2_key.pem
                chmod 600 ec2_key.pem

                # Stop & remove old container
                ssh -o StrictHostKeyChecking=no -i ec2_key.pem ${EC2_USER}@${EC2_HOST} "
                    docker stop portfolio || true
                    docker rm portfolio || true
                    docker pull ${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY##*/}:${IMAGE_TAG}
                    docker run -d -p 9090:80 --name portfolio ${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY##*/}:${IMAGE_TAG}
                    docker ps | grep portfolio
                "

                # Clean up SSH key
                rm -f ec2_key.pem
                """
            }
        }
    }

    post {
        success {
            echo "Deployment completed successfully! Portfolio is live on EC2."
        }
        failure {
            echo "Deployment failed. Check logs for errors."
        }
    }
}
