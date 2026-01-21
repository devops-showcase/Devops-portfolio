# Kubernetes Deployment for Portfolio

This directory contains Kubernetes manifests for deploying the portfolio application to a production Kubernetes cluster with enterprise-grade reliability, scalability, and security.

## Architecture Overview

```
Internet → CloudFront CDN → Ingress Controller (NGINX) → Service → Pods (3-10 replicas)
```

## Features

### High Availability
- **3 replicas minimum** with pod anti-affinity for multi-node distribution
- **Rolling updates** with zero downtime (maxUnavailable: 0)
- **Health checks**: Liveness and readiness probes ensure traffic only to healthy pods
- **Auto-scaling**: HPA scales from 3-10 replicas based on CPU (70%) and memory (80%)

### Security
- **Non-root containers**: Runs as user 101 (nginx)
- **Security context**: Drop all capabilities, no privilege escalation
- **TLS/HTTPS**: Automated certificate management via cert-manager
- **Security headers**: X-Frame-Options, X-Content-Type-Options, XSS Protection

### Performance
- **CDN integration**: CloudFront caches static assets globally
- **Gzip compression**: Reduces bandwidth by ~70% for text assets
- **Static asset caching**: 7-day browser cache for images, CSS, JS
- **Resource limits**: Prevents resource exhaustion and ensures fair scheduling

## Prerequisites

- Kubernetes cluster (1.19+)
- `kubectl` configured with cluster access
- NGINX Ingress Controller installed
- cert-manager installed (for TLS certificates)
- AWS ECR access for pulling images

## Deployment Instructions

### Option 1: Deploy with kubectl

```bash
# Apply all manifests
kubectl apply -f k8s/

# Verify deployment
kubectl get all -n portfolio
kubectl get ingress -n portfolio
```

### Option 2: Deploy with Kustomize (Recommended)

```bash
# Deploy using kustomize
kubectl apply -k k8s/

# Verify deployment
kubectl get all -n portfolio
```

### Option 3: Deploy with Helm (Advanced)

```bash
# Package as Helm chart
helm package helm/portfolio

# Install
helm install portfolio ./portfolio-1.0.0.tgz -n portfolio --create-namespace
```

## Verify Deployment

```bash
# Check pod status
kubectl get pods -n portfolio

# Check HPA status
kubectl get hpa -n portfolio

# View logs
kubectl logs -n portfolio -l app=portfolio --tail=50

# Test connectivity
kubectl port-forward -n portfolio svc/portfolio 8080:80
curl http://localhost:8080
```

## Scaling

```bash
# Manual scaling
kubectl scale deployment portfolio -n portfolio --replicas=5

# Check auto-scaling behavior
kubectl get hpa portfolio -n portfolio --watch
```

## Rolling Updates

```bash
# Update image
kubectl set image deployment/portfolio -n portfolio portfolio=160806393258.dkr.ecr.us-east-2.amazonaws.com/portfolio:v2.0

# Monitor rollout
kubectl rollout status deployment/portfolio -n portfolio

# Rollback if needed
kubectl rollout undo deployment/portfolio -n portfolio
```

## Troubleshooting

```bash
# Check pod events
kubectl describe pod <pod-name> -n portfolio

# View recent logs
kubectl logs -n portfolio -l app=portfolio --tail=100 --timestamps

# Check ingress
kubectl describe ingress portfolio -n portfolio

# Debug networking
kubectl run -it --rm debug --image=busybox --restart=Never -- wget -O- http://portfolio.portfolio.svc.cluster.local
```

## Monitoring

The deployment includes:
- **Resource requests/limits**: CPU (100m-200m), Memory (64Mi-128Mi)
- **Health checks**: HTTP probes on port 80
- **Auto-scaling metrics**: CPU and memory utilization

Integrate with Prometheus/Grafana for observability:

```bash
# Add ServiceMonitor for Prometheus (if using Prometheus Operator)
kubectl apply -f monitoring/servicemonitor.yaml
```

## CI/CD Integration

### GitHub Actions Pipeline

```yaml
- name: Deploy to Kubernetes
  run: |
    aws eks update-kubeconfig --name portfolio-cluster --region us-east-2
    kubectl set image deployment/portfolio -n portfolio portfolio=${{ env.IMAGE_TAG }}
    kubectl rollout status deployment/portfolio -n portfolio
```

### GitOps with ArgoCD

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: portfolio
spec:
  source:
    repoURL: https://github.com/devops-showcase/Devops-portfolio
    path: k8s
  destination:
    server: https://kubernetes.default.svc
    namespace: portfolio
```

## Resource Specifications

| Resource | Min | Max | Auto-scale Target |
|----------|-----|-----|-------------------|
| Replicas | 3 | 10 | CPU: 70%, Mem: 80% |
| CPU | 100m | 200m | Per pod |
| Memory | 64Mi | 128Mi | Per pod |

## Security Hardening

- ✅ Non-root user (UID 101)
- ✅ Read-only root filesystem
- ✅ Drop all Linux capabilities
- ✅ No privilege escalation
- ✅ TLS encryption (HTTPS only)
- ✅ Network policies (optional)
- ✅ Pod Security Standards (Restricted)

## Cost Optimization

- **Right-sized resources**: Small resource requests/limits for static site
- **Auto-scaling**: Scales down during low traffic (minimum 3 replicas)
- **CDN offloading**: CloudFront reduces origin requests by ~90%
- **Efficient base image**: nginx:alpine (5MB vs 133MB for nginx:latest)

## Production Checklist

- [ ] TLS certificate provisioned and valid
- [ ] DNS pointing to Ingress LoadBalancer
- [ ] CloudFront distribution configured
- [ ] Monitoring/alerting configured
- [ ] Backup strategy defined
- [ ] Disaster recovery plan documented
- [ ] Resource limits tuned based on traffic
- [ ] Security scanning integrated in CI/CD

## Contact

For deployment issues or questions, contact [perpyayogu@gmail.com](mailto:perpyayogu@gmail.com).
