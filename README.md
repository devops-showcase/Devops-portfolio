📘 README.md (Recruiter-Friendly Version)
# 🌐 DevOps Portfolio Website

This is my **personal DevOps portfolio website**, showcasing my skills in **CI/CD, cloud deployment, containerization, and DevSecOps**.  
The website demonstrates a real-world end-to-end DevOps pipeline — from **code commit to live deployment** on AWS.

---

## 🚀 Project Highlights

- **Automated CI/CD Pipeline**: Built with **Jenkins**, triggered on GitHub commits.  
- **Containerized Deployment**: Dockerized web app deployed on **AWS EC2**.  
- **Global Delivery**: Optimized for speed using **AWS CloudFront CDN**.  
- **Security Practices**: Integrated **Trivy** for vulnerability and misconfiguration scanning.  
- **Real-Time Deployment**: Updates automatically with each commit to the repository.

---

## ⚙️ Tech Stack & Tools

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML, CSS, JavaScript |
| **Containerization** | Docker |
| **CI/CD** | Jenkins Pipeline |
| **Cloud Hosting** | AWS EC2 |
| **Content Delivery** | AWS CloudFront |
| **Version Control** | Git & GitHub |
| **Security** | Trivy (Vulnerability & Misconfiguration Scanning) |
| **Monitoring & Logging** | Docker logs & Jenkins console |

---

## 🧩 Architecture Overview

```mermaid
graph TD
    A[GitHub Repo] -->|Push Event| B[Jenkins Pipeline]
    B --> C[Docker Build & Trivy Scan]
    C --> D[AWS EC2 Container Deployment]
    D --> E[AWS CloudFront Distribution]
    E --> F[End Users 🌎]
📦 Deployment Workflow

1️⃣ Local Testing
docker build -t portfolio-site .
docker run -d -p 80:80 portfolio-site
Open: http://localhost

2️⃣ CI/CD Pipeline
Jenkins pipeline triggered on GitHub push.
Stages include:
Checkout latest code
Docker Build and Trivy Scan
Push Docker image to AWS ECR
Deploy container on EC2 via SSM

3️⃣ Security Scan
trivy fs --scanners vuln,misconfig,secret --exit-code 0 --format table .
Detects vulnerabilities, misconfigurations, and secrets in codebase or filesystem.

4️⃣ CloudFront Integration
Configured CloudFront distribution pointing to EC2 container.
Optional HTTPS & custom domain support.
Reduces latency and improves performance globally.
🔒 DevSecOps Integration
Trivy Scanning is integrated directly into the Jenkins pipeline.
Prevents insecure deployments by failing builds on high-risk vulnerabilities.
Supports continuous security monitoring for containerized applications.
📞 Contact & Portfolio
Perpetua Ayogu
📧 Perpyayogu@gmail.com
📱 +1 (510) 820-3736
🌍 LinkedIn:http://linkedin.com/in/ayogu-perpetua-b0b210236
