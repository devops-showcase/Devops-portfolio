pipeline {
    agent any

    environment {
        IMAGE_NAME = "portfolio"
    }

    triggers {
        githubPush()   // Automatically triggers when GitHub webhook fires
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Set Image Tag') {
            steps {
                script {
                    IMAGE_TAG = "${env.GIT_COMMIT.take(7)}"  // first 7 chars of commit
                    echo "Docker image tag: ${IMAGE_TAG}"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh """
                        echo "Building Docker image..."
                        docker build -t $IMAGE_NAME:${IMAGE_TAG} .
                    """
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
                    sh """
                        echo "Logging in to AWS ECR..."
                        ACCOUNT_ID=\$(aws sts get-caller-identity --query Account --output text)
                        ECR_URL="\${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY##*/}"

                        aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin \${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                        
                        echo "Tagging and pushing image..."
                        docker tag $IMAGE_NAME:${IMAGE_TAG} \${ECR_URL}:${IMAGE_TAG}
                        docker push \${ECR_URL}:${IMAGE_TAG}
                    """
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
                    sh """
                        echo "Deploying to EC2 via SSM..."
                        
                        export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
                        export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
                        export AWS_DEFAULT_REGION=$AWS_REGION
                        
                        ACCOUNT_ID=\$(aws sts get-caller-identity --query Account --output text)
                        ECR_URL="\${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY##*/}"

                        INSTANCE_ID=\$(aws ec2 describe-instances \
                            --filters "Name=tag:Name,Values=$EC2_HOST" "Name=instance-state-name,Values=running" \
                            --query "Reservations[0].Instances[0].InstanceId" --output text)

                        echo "Instance ID found: \$INSTANCE_ID"

                        aws ssm send-command \
                            --instance-ids "\$INSTANCE_ID" \
                            --document-name "AWS-RunShellScript" \
                            --comment "Deploying portfolio app" \
                            --parameters commands="[
                                'docker stop portfolio || true',
                                'docker rm portfolio || true',
                                'aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin \${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com',
                                'docker pull \${ECR_URL}:${IMAGE_TAG}',
                                'docker run -d --name portfolio -p 9091:80 \${ECR_URL}:${IMAGE_TAG}'
                            ]"

                        echo "Deployment complete!"
                    """
                }
            }
        }
        
    }
}
