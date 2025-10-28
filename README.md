# 🌐 DevOps Portfolio Website

This is my **personal DevOps portfolio website**, showcasing my expertise in **CI/CD, cloud deployment, containerization, and DevSecOps**.  
The project demonstrates a complete **end-to-end DevOps pipeline** — from **code commit to live deployment** on AWS.

---

## 🚀 Project Overview

This portfolio website is a live demonstration of DevOps practices, including:

- **Automated CI/CD Pipeline**: Using **Jenkins**, the pipeline triggers on GitHub commits to build, test, and deploy the application.  
- **Containerized Deployment**: The web app is Dockerized and deployed on **AWS EC2**, ensuring portability and consistent runtime environments.  
- **Global Delivery**: **AWS CloudFront** is configured for content delivery, ensuring faster load times and better user experience.  
- **Security Integration**: **Trivy** is used for container vulnerability scanning, configuration checks, and secret detection.  
- **Real-Time Updates**: Every commit automatically updates the live site without manual intervention.

---

## ⚙️ Tech Stack

| Layer                  | Technology                                      |
|------------------------|------------------------------------------------|
| **Frontend**           | HTML, CSS, JavaScript                           |
| **Containerization**   | Docker                                          |
| **CI/CD**              | Jenkins Pipeline                                |
| **Cloud Hosting**      | AWS EC2                                        |
| **Content Delivery**   | AWS CloudFront                                  |
| **Version Control**    | Git & GitHub                                   |
| **Security & Compliance** | Trivy (Vulnerability & Misconfiguration Scan) |
| **Monitoring & Logs**  | Docker logs & Jenkins console                   |

---

## 🛠 Pipeline & Deployment

1. **Code Commit**: Push changes to GitHub repository.  
2. **Jenkins Trigger**: Jenkins detects the commit via webhook.  
3. **Build Docker Image**: Pipeline builds a Docker image tagged with the Git commit hash.  
4. **Push to AWS ECR**: Docker image is pushed to AWS Elastic Container Registry.  
5. **Deploy via SSM**: Jenkins uses **AWS Systems Manager (SSM)** to deploy the Docker container on EC2.  
6. **Live Update**: The container runs on the server and is accessible through **CloudFront**.  

---

## 🔒 DevSecOps Integration

- **Trivy Scanning**:  
  - Scans filesystem, dependencies, and container images.  
  - Detects vulnerabilities, misconfigurations, and secrets.  
- **Pipeline Enforcement**: Build fails if critical vulnerabilities are detected (optional configurable).  
- **Continuous Security**: Security scanning runs on every commit before deployment.  

---

## 🌐 Access

- **Portfolio Website**: [Your live URL here]  
- **Source Code**: [GitHub Repository link]  

---

## 📫 Contact

- **Email**: Perpyayogu@gmail.com  
- **Phone**: +1 510-820-3736  

---

> This project demonstrates real-world DevOps practices, combining **automation, cloud deployment, security, and monitoring** into a single workflow.
