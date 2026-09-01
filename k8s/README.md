# ☸️ ReLoop Kubernetes (K8s) Deployment Guide

This directory contains the Kubernetes manifests for deploying the **ReLoop** Peer-to-Peer Circular Economy Marketplace.

---

## 🏗️ Architecture & Resources

| File | Resource Type | Description | Exposed Port(s) |
| :--- | :--- | :--- | :--- |
| [`configmap.yaml`](./configmap.yaml) | `ConfigMap` | Non-sensitive configurations (`PORT`, `NODE_ENV`, `MONGO_URI`) | - |
| [`secret.yaml`](./secret.yaml) | `Secret` | Sensitive auth credentials (`JWT_SECRET`) | - |
| [`mongo.yaml`](./mongo.yaml) | `PVC`, `Deployment`, `Service` | MongoDB database (2Gi PVC storage) | `27017` (ClusterIP) |
| [`backend.yaml`](./backend.yaml) | `PVC`, `Deployment`, `Service` | ReLoop Express API (2 replicas, 2Gi uploads PVC, probes) | `5000` (NodePort: `30500`) |
| [`frontend.yaml`](./frontend.yaml) | `Deployment`, `Service` | ReLoop React UI on Nginx (2 replicas, probes) | `80` (NodePort: `30080`) |
| [`ingress.yaml`](./ingress.yaml) | `Ingress` | Path routing (`/` -> Frontend, `/api` & `/uploads` -> Backend) | `80` / `443` |
| [`kustomization.yaml`](./kustomization.yaml) | `Kustomization` | Unified deployment bundle | - |

---

## 🚀 Quick Deployment Guide

### 1. Build Container Images

Before deploying to Kubernetes, build the Docker images locally:

```bash
# Build Backend Image
docker build -t reloop-backend:latest ./backend

# Build Frontend Image
docker build -t reloop-frontend:latest ./frontend
```

> **Note for Minikube users**: Point your shell to Minikube's Docker daemon before building images so they are immediately available inside Minikube:
> ```bash
> # Linux/macOS
> eval $(minikube docker-env)
>
> # Windows PowerShell
> minikube docker-env | Invoke-Expression
> ```

> **Note for Kind users**: Load images directly into your Kind cluster:
> ```bash
> kind load docker-image reloop-backend:latest
> kind load docker-image reloop-frontend:latest
> ```

---

### 2. Apply Manifests to Kubernetes

Deploy the entire application stack in one command:

```bash
# Using Kustomize
kubectl apply -k ./k8s

# Or directly with directory apply
kubectl apply -f ./k8s
```

---

### 3. Check Deployment Status

Verify that all Pods, Services, and PVCs are running:

```bash
# Check Pods
kubectl get pods

# Check Services
kubectl get svc

# Check Persistent Volume Claims
kubectl get pvc
```

Expected output:
```text
NAME                        READY   STATUS    RESTARTS   AGE
backend-xxxxxxxxxx-xxxxx    1/1     Running   0          30s
backend-xxxxxxxxxx-xxxxx    1/1     Running   0          30s
frontend-xxxxxxxxxx-xxxxx   1/1     Running   0          30s
frontend-xxxxxxxxxx-xxxxx   1/1     Running   0          30s
mongo-xxxxxxxxxx-xxxxx      1/1     Running   0          30s
```

---

### 4. Accessing the Application

Depending on your Kubernetes environment:

#### A. NodePort Access (Docker Desktop / Bare Metal / Cloud VMs)
- **Frontend**: Open `http://localhost:30080` (or `http://<NODE-IP>:30080`)
- **Backend API**: Open `http://localhost:30500` (or `http://<NODE-IP>:30500`)

#### B. Minikube Service Tunnel
```bash
# Tunnel frontend service
minikube service frontend-service

# Tunnel backend service
minikube service backend-service
```

#### C. Ingress Controller (with Ingress enabled)
If you have an Ingress controller (e.g., `minikube addons enable ingress` or ingress-nginx):
- Access `http://localhost` (or configured host / minikube IP) — Nginx automatically routes `/` to Frontend and `/api` + `/uploads` to Backend.

#### D. Port Forwarding (Direct debugging)
```bash
# Forward Frontend to port 3000
kubectl port-forward svc/frontend-service 3000:80

# Forward Backend to port 5000
kubectl port-forward svc/backend-service 5000:5000
```

---

## 🧹 Teardown / Cleanup

To delete all deployed resources:

```bash
# Delete all resources via Kustomize
kubectl delete -k ./k8s

# Or delete individual files
kubectl delete -f ./k8s
```
