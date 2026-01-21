# DevOps Portfolio - Production-Grade Kubernetes Deployment

[![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=for-the-badge&logo=kubernetes&logoColor=white)](https://kubernetes.io/)
[![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)](https://nginx.org/)

> **Professional DevOps Engineer Portfolio** showcasing 5+ years of cloud infrastructure automation, Kubernetes orchestration, and CI/CD expertise.

**Live Site:** [https://d8oamidwzp0fn.cloudfront.net](https://d8oamidwzp0fn.cloudfront.net)

## 🏗️ Architecture

This portfolio is deployed on **production-grade Kubernetes infrastructure** with enterprise reliability and security:

```
┌─────────────┐
│  CloudFront │  ← Global CDN (cache static assets)
│     CDN     │
└──────┬──────┘
       │
┌──────▼──────────────────────────────────────────┐
│          NGINX Ingress Controller               │
│         (TLS termination + routing)             │
└──────┬──────────────────────────────────────────┘
       │
┌──────▼──────────────────────────────────────────┐
│          Kubernetes Service                     │
│            (ClusterIP)                          │
└──────┬──────────────────────────────────────────┘
       │
┌──────▼──────────────────────────────────────────┐
│     Deployment (3-10 replicas with HPA)         │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐         │
│  │ Pod  │  │ Pod  │  │ Pod  │  │ Pod  │  ...    │
│  │nginx │  │nginx │  │nginx │  │nginx │         │
│  └──────┘  └──────┘  └──────┘  └──────┘         │
└─────────────────────────────────────────────────┘
```

## ✨ Features

### High Availability & Scalability
- ⚡ **Auto-scaling**: 3-10 replicas based on CPU (70%) and memory (80%) utilization
- 🔄 **Rolling updates**: Zero-downtime deployments with `maxUnavailable: 0`
- 💚 **Health checks**: Liveness and readiness probes ensure 99.9% uptime
- 🌍 **Multi-replica**: Pod anti-affinity for distribution across nodes

### Security Hardening
- 🔒 **Non-root containers**: Runs as UID 101 (nginx user)
- 🛡️ **Security context**: Dropped all Linux capabilities, no privilege escalation
- 🔐 **TLS/HTTPS**: Automated cert-manager integration for SSL certificates
- 📋 **Security headers**: X-Frame-Options, XSS Protection, Content-Type-Options

### Performance Optimization
- 🚀 **CDN integration**: CloudFront reduces origin load by 90%
- 📦 **Gzip compression**: 70% bandwidth reduction for text assets
- ⚡ **Asset caching**: 7-day browser cache for static resources
- 📉 **Resource limits**: Right-sized CPU (100m-200m) and memory (64Mi-128Mi)

### DevOps Best Practices
- 📊 **Observability**: Health probes, resource metrics, HPA monitoring
- 🔧 **Infrastructure as Code**: All Kubernetes manifests version-controlled
- 🎯 **Kustomize support**: Environment-specific overlays and patches
- 🔄 **GitOps ready**: Compatible with ArgoCD and Flux

## 🚀 Quick Start

### Deploy to Kubernetes

```bash
# Clone repository
git clone https://github.com/devops-showcase/Devops-portfolio.git
cd Devops-portfolio

# Deploy using kubectl
kubectl apply -f k8s/

# Or deploy with Kustomize (recommended)
kubectl apply -k k8s/

# Verify deployment
kubectl get all -n portfolio
kubectl get ingress -n portfolio
```

### Local Development

```bash
# Build Docker image
docker build -t portfolio:local .

# Run locally
docker run -p 8080:80 portfolio:local

# Access at http://localhost:8080
```

## 📁 Project Structure

```
.
├── k8s/                          # Kubernetes manifests
│   ├── namespace.yaml            # Dedicated namespace
│   ├── deployment.yaml           # Pod deployment with 3 replicas
│   ├── service.yaml              # ClusterIP service
│   ├── ingress.yaml              # NGINX ingress with TLS
│   ├── hpa.yaml                  # Horizontal Pod Autoscaler
│   ├── configmap.yaml            # Nginx configuration
│   ├── kustomization.yaml        # Kustomize manifest
│   └── README.md                 # Detailed K8s documentation
├── index.html                    # Portfolio content
├── style.css                     # Modern, responsive styles
├── script.js                     # Interactive features
├── Dockerfile                    # Multi-stage optimized build
└── README.md                     # This file
```

## 🛠️ Technology Stack

### Infrastructure & Orchestration
- **Kubernetes** - Container orchestration
- **AWS EKS** - Managed Kubernetes service
- **Docker** - Containerization
- **NGINX** - High-performance web server

### Networking & Security
- **NGINX Ingress Controller** - Layer 7 routing and TLS termination
- **cert-manager** - Automated TLS certificate management
- **CloudFront** - Global CDN for static asset delivery
- **AWS Route53** - DNS management

### DevOps Tools
- **Kustomize** - Kubernetes manifest customization
- **kubectl** - Kubernetes CLI
- **AWS CLI** - AWS resource management
- **GitHub Actions** - CI/CD automation

## 📊 Kubernetes Resource Specifications

| Resource | Minimum | Maximum | Auto-scale Target |
|----------|---------|---------|-------------------|
| **Replicas** | 3 | 10 | CPU: 70%, Mem: 80% |
| **CPU** | 100m | 200m | Per pod |
| **Memory** | 64Mi | 128Mi | Per pod |

## 🔧 Management Commands

```bash
# Scale manually
kubectl scale deployment portfolio -n portfolio --replicas=5

# View auto-scaling status
kubectl get hpa portfolio -n portfolio --watch

# Rolling update
kubectl set image deployment/portfolio -n portfolio \
  portfolio=160806393258.dkr.ecr.us-east-2.amazonaws.com/portfolio:v2.0

# Monitor rollout
kubectl rollout status deployment/portfolio -n portfolio

# Rollback deployment
kubectl rollout undo deployment/portfolio -n portfolio

# View logs
kubectl logs -n portfolio -l app=portfolio --tail=100 -f

# Port forward for local testing
kubectl port-forward -n portfolio svc/portfolio 8080:80
```

## 🔍 Monitoring & Observability

### Health Checks
- **Liveness Probe**: HTTP GET on port 80, every 10s
- **Readiness Probe**: HTTP GET on port 80, every 5s
- **Startup Grace**: 30s initial delay for pod warmup

### Resource Monitoring
```bash
# View resource usage
kubectl top pods -n portfolio

# HPA status
kubectl get hpa -n portfolio

# Events
kubectl get events -n portfolio --sort-by='.lastTimestamp'
```

## 🔐 Security Features

- ✅ **Non-root user** (UID 101)
- ✅ **Read-only root filesystem**
- ✅ **Drop all Linux capabilities**
- ✅ **No privilege escalation**
- ✅ **TLS encryption** (HTTPS enforced)
- ✅ **Security headers** (XSS, Clickjacking protection)
- ✅ **Pod Security Standards** (Restricted profile)

## 💰 Cost Optimization

- **Efficient base image**: `nginx:alpine` (5MB vs 133MB)
- **Right-sized resources**: Minimal CPU/memory for static site
- **Auto-scaling**: Scales down during low traffic (minimum 3)
- **CDN offloading**: CloudFront handles 90% of requests
- **Spot instances**: Run Kubernetes nodes on EC2 spot for 70% savings

**Estimated monthly cost**: ~$50 (3x t3.small nodes + EKS control plane)

## 📈 Performance Metrics

- ⚡ **Time to First Byte**: < 100ms (via CloudFront)
- 🚀 **Page Load Time**: < 1 second
- 📊 **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- 🔄 **Deployment Time**: < 2 minutes (rolling update)
- 💚 **Uptime SLA**: 99.9% (health checks + auto-healing)

## 📧 Contact

**Perpetua Ayogu**
DevOps Engineer | Cloud Infrastructure Specialist

- 📧 Email: [perpyayogu@gmail.com](mailto:perpyayogu@gmail.com)
- 📱 Phone: +1 510-820-3736
- 💼 LinkedIn: [linkedin.com/in/ayogu-perpetua-b0b210236](https://linkedin.com/in/ayogu-perpetua-b0b210236)
- 🐙 GitHub: [github.com/devops-showcase](https://github.com/devops-showcase)

---

**Built with** ❤️ **using Kubernetes, Docker, AWS, and modern DevOps practices**
