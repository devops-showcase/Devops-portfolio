pipeline {
    agent any

    environment {
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
                        echo "Building Docker image..."
                        docker build -t $IMAGE_NAME:$IMAGE_TAG .
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
                        echo "Logging in to AWS ECR..."
                        ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
                        ECR_URL="${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY##*/}"

                        aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin ${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                        
                        echo "Tagging and pushing image..."
                        docker tag $IMAGE_NAME:$IMAGE_TAG ${ECR_URL}:$IMAGE_TAG
                        docker push ${ECR_URL}:$IMAGE_TAG
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
                        echo "Deploying to EC2 via SSM..."
                        
                        export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
                        export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
                        export AWS_DEFAULT_REGION=$AWS_REGION
                        
                        ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
                        ECR_REGISTRY="${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
                        ECR_URL="${ECR_REGISTRY}/${ECR_REPOSITORY##*/}"
                        FULL_IMAGE="${ECR_URL}:${IMAGE_TAG}"

                        echo "Looking for EC2 instance with tag Name=$EC2_HOST"
                        
                        INSTANCE_ID=$(aws ec2 describe-instances --filters "Name=tag:Name,Values=$EC2_HOST" "Name=instance-state-name,Values=running" --query "Reservations[0].Instances[0].InstanceId" --output text)

                        if [ "$INSTANCE_ID" = "None" ] || [ -z "$INSTANCE_ID" ]; then
                            echo "ERROR: No running EC2 instance found with tag Name=$EC2_HOST"
                            exit 1
                        fi

                        echo "Instance ID found: $INSTANCE_ID"
                        echo "Deploying image: $FULL_IMAGE"

                        # Send deployment command - all on one line
                        aws ssm send-command --instance-ids "$INSTANCE_ID" --document-name "AWS-RunShellScript" --comment "Deploy Portfolio" --parameters "commands=['echo Starting deployment...','export PATH=/usr/local/bin:/usr/bin:/bin','/usr/bin/aws ecr get-login-password --region ${AWS_REGION} | /usr/bin/docker login --username AWS --password-stdin ${ECR_REGISTRY}','/usr/bin/docker stop portfolio || true','/usr/bin/docker rm portfolio || true','/usr/bin/docker pull ${FULL_IMAGE}','/usr/bin/docker run -d --name portfolio -p 9091:80 ${FULL_IMAGE}','/usr/bin/docker ps | grep portfolio']"
                        
                        echo "Deployment complete!"
                    '''
                }
            }
        }
        
    }
}
