pipeline {
    agent any

    environment {
        // Static environment variables only
        IMAGE_NAME = "portfolio"
    }

    triggers {
        githubPush()
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Set Branch-Specific Variables') {
            steps {
                script {
                    // Set variables based on branch
                    if (env.BRANCH_NAME == 'main') {
                        env.IMAGE_NAME = 'perpetua-portfolio'
                        env.CONTAINER_PORT = '9091'
                        env.CONTAINER_NAME = 'perpetua-portfolio'
                    } else {
                        env.IMAGE_NAME = 'kizito-portfolio'
                        env.CONTAINER_PORT = '9092'
                        env.CONTAINER_NAME = 'kizito-portfolio'
                    }
                    
                    echo "🌿 Branch: ${env.BRANCH_NAME}"
                    echo "🐳 Image Name: ${env.IMAGE_NAME}"
                    echo "🔌 Port: ${env.CONTAINER_PORT}"
                    echo "📦 Container: ${env.CONTAINER_NAME}"
                }
            }
        }

        stage('Trivy - File System & Dependency Scan') {
            steps {
                script {
                    echo "🔍 Running Trivy File System & Dependency Vulnerability Scan..."
                    sh '''
                        trivy fs --scanners vuln,config,secret --exit-code 0 --format table . || echo "Trivy scan completed with warnings"
                    '''
                }
            }
        }

        stage('Set Image Tag') {
            steps {
                script {
                    env.IMAGE_TAG = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    echo "Docker image tag: ${env.IMAGE_TAG}"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh '''
                        echo "🐳 Building Docker image for ${IMAGE_NAME}..."
                        docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                    '''
                }
            }
        }

        stage('Trivy - Docker Image Scan') {
            steps {
                script {
                    echo "🛡️ Scanning Docker image for vulnerabilities..."
                    sh '''
                        trivy image --severity HIGH,CRITICAL --exit-code 0 --format table ${IMAGE_NAME}:${IMAGE_TAG} || echo "Image scan completed with warnings"
                    '''
                }
            }
        }

        stage('Push to AWS ECR') {
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'aws-creds', usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY'),
                    string(credentialsId: 'aws-region', variable: 'AWS_REGION'),
                    string(credentialsId: 'ecr-repo', variable: 'ECR_REPOSITORY')
                ]) {
                    sh '''
                        echo "🔐 Logging in to AWS ECR..."
                        ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
                        ECR_URL="${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY##*/}"

                        aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                        
                        echo "🚀 Tagging and pushing image with unique tag: ${IMAGE_NAME}-${IMAGE_TAG}..."
                        docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${ECR_URL}:${IMAGE_NAME}-${IMAGE_TAG}
                        docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${ECR_URL}:${IMAGE_NAME}-latest
                        docker push ${ECR_URL}:${IMAGE_NAME}-${IMAGE_TAG}
                        docker push ${ECR_URL}:${IMAGE_NAME}-latest
                        
                        echo "✅ Pushed to ${ECR_URL}:${IMAGE_NAME}-${IMAGE_TAG}"
                    '''
                }
            }
        }

        stage('Deploy to EC2 via SSM') {
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'aws-creds', usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY'),
                    string(credentialsId: 'aws-region', variable: 'AWS_REGION'),
                    string(credentialsId: 'ecr-repo', variable: 'ECR_REPOSITORY'),
                    string(credentialsId: 'ec2-host', variable: 'EC2_HOST')
                ]) {
                    sh '''
                        echo "🚢 Deploying ${IMAGE_NAME} to EC2 via SSM..."
                        export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
                        export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
                        export AWS_DEFAULT_REGION=${AWS_REGION}

                        ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
                        ECR_REGISTRY="${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
                        ECR_URL="${ECR_REGISTRY}/${ECR_REPOSITORY##*/}"
                        FULL_IMAGE="${ECR_URL}:${IMAGE_NAME}-${IMAGE_TAG}"

                        INSTANCE_ID=$(aws ec2 describe-instances \
                            --filters "Name=tag:Name,Values=${EC2_HOST}" "Name=instance-state-name,Values=running" \
                            --query "Reservations[0].Instances[0].InstanceId" \
                            --output text)

                        if [ "$INSTANCE_ID" = "None" ] || [ -z "$INSTANCE_ID" ]; then
                            echo "❌ ERROR: No running EC2 instance found with tag Name=${EC2_HOST}"
                            exit 1
                        fi

                        echo "✅ Instance ID found: $INSTANCE_ID"
                        echo "📦 Deploying container: ${CONTAINER_NAME}"
                        echo "🐳 Image: ${FULL_IMAGE}"
                        echo "🔌 Port: ${CONTAINER_PORT}"

                        cat > /tmp/ssm-commands.json <<EOFSSM
{
  "InstanceIds": ["${INSTANCE_ID}"],
  "DocumentName": "AWS-RunShellScript",
  "Comment": "Deploy ${IMAGE_NAME} Portfolio via Jenkins",
  "Parameters": {
    "commands": [
      "echo 'Starting deployment of ${IMAGE_NAME}'",
      "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}",
      "docker stop ${CONTAINER_NAME} || true",
      "docker rm ${CONTAINER_NAME} || true",
      "docker pull ${FULL_IMAGE}",
      "docker run -d --name ${CONTAINER_NAME} -p ${CONTAINER_PORT}:80 ${FULL_IMAGE}",
      "echo 'Deployment of ${IMAGE_NAME} completed on port ${CONTAINER_PORT}'"
    ]
  }
}
EOFSSM

                        echo "📤 Sending deployment command via SSM..."
                        COMMAND_ID=$(aws ssm send-command --cli-input-json file:///tmp/ssm-commands.json --query 'Command.CommandId' --output text)
                        
                        echo "⏳ Waiting for command to complete..."
                        sleep 10
                        
                        aws ssm get-command-invocation \
                            --command-id "$COMMAND_ID" \
                            --instance-id "$INSTANCE_ID" \
                            --query 'StandardOutputContent' \
                            --output text || echo "Command sent successfully"
                        
                        echo "✅ Deployment command completed!"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completed successfully for ${env.IMAGE_NAME}!"
            echo "🌿 Branch: ${env.BRANCH_NAME}"
        }
        failure {
            echo "❌ Pipeline failed"
        }
        always {
            echo "🧹 Pipeline execution finished"
        }
    }
}
