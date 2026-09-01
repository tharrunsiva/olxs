pipeline {
    agent any

    environment {
        BACKEND_IMAGE  = 'reloop-backend'
        FRONTEND_IMAGE = 'reloop-frontend'
        IMAGE_TAG      = "${BUILD_NUMBER}"
        K8S_DIR        = 'k8s'
        PATH           = "${WORKSPACE}/bin:${env.PATH}"
        KUBECONFIG     = '/var/jenkins_home/.kube/config'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '========================================'
                echo '       CHECKING OUT CODE FROM SCM       '
                echo '========================================'
                checkout scm
            }
        }

        stage('Verify & Setup CLI Tools') {
            steps {
                echo '========================================'
                echo '       VERIFYING CLI TOOLS & SETUP      '
                echo '========================================'
                sh '''
                    mkdir -p "${WORKSPACE}/bin"

                    # If kubectl is missing in Jenkins container, automatically install it
                    if ! command -v kubectl >/dev/null 2>&1; then
                        echo "kubectl binary not found in PATH. Downloading standalone kubectl..."
                        curl -sSL -o "${WORKSPACE}/bin/kubectl" "https://dl.k8s.io/release/v1.30.0/bin/linux/amd64/kubectl" || \
                        wget -qO "${WORKSPACE}/bin/kubectl" "https://dl.k8s.io/release/v1.30.0/bin/linux/amd64/kubectl"
                        chmod +x "${WORKSPACE}/bin/kubectl"
                    fi

                    echo "Docker Version:  $(docker --version 2>/dev/null || echo 'Docker CLI not found')"
                    echo "Kubectl Version: $(kubectl version --client 2>/dev/null || echo 'Kubectl CLI not found')"
                    echo "Working Dir:     $(pwd)"
                '''
            }
        }

        stage('Build Backend Image') {
            steps {
                echo '========================================'
                echo '       BUILDING BACKEND DOCKER IMAGE    '
                echo '========================================'
                sh """
                    docker build -t ${BACKEND_IMAGE}:latest -t ${BACKEND_IMAGE}:${IMAGE_TAG} ./backend
                """
            }
        }

        stage('Build Frontend Image') {
            steps {
                echo '========================================'
                echo '       BUILDING FRONTEND DOCKER IMAGE   '
                echo '========================================'
                sh """
                    docker build -t ${FRONTEND_IMAGE}:latest -t ${FRONTEND_IMAGE}:${IMAGE_TAG} ./frontend
                """
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo '========================================'
                echo '       APPLYING K8S MANIFESTS           '
                echo '========================================'
                sh """
                    echo "Applying Kubernetes manifests via Kustomize..."
                    kubectl apply -k ./${K8S_DIR}
                """
            }
        }

        stage('Verify Rollout & Health') {
            steps {
                echo '========================================'
                echo '       WAITING FOR PODS ROLLOUT         '
                echo '========================================'
                sh '''
                    echo "Checking Mongo deployment rollout..."
                    kubectl rollout status deployment/mongo --timeout=120s || true

                    echo "Checking Backend deployment rollout..."
                    kubectl rollout status deployment/backend --timeout=120s || true

                    echo "Checking Frontend deployment rollout..."
                    kubectl rollout status deployment/frontend --timeout=120s || true

                    echo ""
                    echo "========================================"
                    echo "           CLUSTER STATUS               "
                    echo "========================================"
                    kubectl get pods -o wide || true
                    echo ""
                    kubectl get svc -o wide || true
                    echo ""
                    kubectl get pvc || true
                '''
            }
        }
    }

    post {
        success {
            echo '========================================================'
            echo '             FULL-STACK DEPLOYMENT SUCCESSFUL           '
            echo '========================================================'
            echo 'Frontend is available at:    http://localhost:30080'
            echo 'Backend API is available at: http://localhost:30500'
            echo 'MongoDB is running internally at port 27017'
            echo '========================================================'
        }

        failure {
            echo '========================================================'
            echo '                DEPLOYMENT FAILED                       '
            echo '========================================================'
            echo 'Gathering diagnostic logs from Kubernetes...'
            sh '''
                echo "Recent Pod Events & Descriptions:"
                kubectl describe pods || true
                echo ""
                echo "Recent Backend Logs:"
                kubectl logs -l app=backend --tail=50 --all-containers=true || true
                echo ""
                echo "Recent Frontend Logs:"
                kubectl logs -l app=frontend --tail=50 --all-containers=true || true
            '''
        }

        always {
            echo 'Pipeline execution complete.'
        }
    }
}
