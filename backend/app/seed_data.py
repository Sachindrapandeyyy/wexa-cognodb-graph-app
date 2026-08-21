"""
Seed data definitions and Cypher generation for AegisGraph.
"""
from typing import List, Dict, Any

NODES: List[Dict[str, Any]] = [
    {
        "id": "actor-apt29",
        "labels": [
            "Attacker",
            "ThreatActor"
        ],
        "properties": {
            "id": "actor-apt29",
            "name": "APT-29 (Cozy Bear)",
            "type": "Nation-State Threat Group",
            "origin": "External Internet / Tor Exit Node",
            "sophistication": "Advanced Persistent Threat",
            "motivation": "Espionage & Exfiltration",
            "risk_score": 98,
            "icon": "shield-alert"
        }
    },
    {
        "id": "actor-fin7",
        "labels": [
            "Attacker",
            "ThreatActor"
        ],
        "properties": {
            "id": "actor-fin7",
            "name": "FIN7 Ransomware Syndicate",
            "type": "Organized Cybercrime",
            "origin": "External Internet / Botnet",
            "sophistication": "High",
            "motivation": "Financial Extortion",
            "risk_score": 92,
            "icon": "skull"
        }
    },
    {
        "id": "actor-insider-rogue",
        "labels": [
            "Attacker",
            "ThreatActor"
        ],
        "properties": {
            "id": "actor-insider-rogue",
            "name": "Compromised Contractor Credential",
            "type": "Insider Vector",
            "origin": "Internal VPN / Stolen Token",
            "sophistication": "Medium",
            "motivation": "Unauthorized Data Access",
            "risk_score": 82,
            "icon": "user-x"
        }
    },
    {
        "id": "zone-public-dmz",
        "labels": [
            "NetworkZone"
        ],
        "properties": {
            "id": "zone-public-dmz",
            "name": "Public DMZ VPC (10.0.1.0/24)",
            "cidr": "10.0.1.0/24",
            "is_internet_exposed": True,
            "security_tier": "Low / External Ingress",
            "risk_score": 75,
            "icon": "globe"
        }
    },
    {
        "id": "zone-app-private",
        "labels": [
            "NetworkZone"
        ],
        "properties": {
            "id": "zone-app-private",
            "name": "App Tier Private Subnet (10.0.10.0/24)",
            "cidr": "10.0.10.0/24",
            "is_internet_exposed": False,
            "security_tier": "Medium / Internal Cluster",
            "risk_score": 45,
            "icon": "network"
        }
    },
    {
        "id": "zone-db-isolated",
        "labels": [
            "NetworkZone"
        ],
        "properties": {
            "id": "zone-db-isolated",
            "name": "DB Isolated VPC (10.0.20.0/24)",
            "cidr": "10.0.20.0/24",
            "is_internet_exposed": False,
            "security_tier": "High / Zero-Egress Subnet",
            "risk_score": 20,
            "icon": "database"
        }
    },
    {
        "id": "zone-pci-regulated",
        "labels": [
            "NetworkZone"
        ],
        "properties": {
            "id": "zone-pci-regulated",
            "name": "PCI-DSS Payment Enclave (172.16.0.0/20)",
            "cidr": "172.16.0.0/20",
            "is_internet_exposed": False,
            "security_tier": "Critical / PCI Compliant",
            "risk_score": 15,
            "icon": "lock"
        }
    },
    {
        "id": "cve-2021-44228",
        "labels": [
            "Vulnerability",
            "CVE"
        ],
        "properties": {
            "id": "cve-2021-44228",
            "name": "Log4Shell RCE (CVE-2021-44228)",
            "cve": "CVE-2021-44228",
            "cvss": 10.0,
            "severity": "CRITICAL",
            "exploit_type": "JNDI Remote Code Execution",
            "patch_status": "UNPATCHED",
            "risk_score": 100,
            "icon": "bug"
        }
    },
    {
        "id": "cve-2024-21626",
        "labels": [
            "Vulnerability",
            "CVE"
        ],
        "properties": {
            "id": "cve-2024-21626",
            "name": "Leaky Vessels (CVE-2024-21626)",
            "cve": "CVE-2024-21626",
            "cvss": 8.6,
            "severity": "HIGH",
            "exploit_type": "Container Breakout (runc fd leak)",
            "patch_status": "UNPATCHED",
            "risk_score": 86,
            "icon": "bug"
        }
    },
    {
        "id": "cve-2024-3094",
        "labels": [
            "Vulnerability",
            "CVE"
        ],
        "properties": {
            "id": "cve-2024-3094",
            "name": "XZ Utils Backdoor (CVE-2024-3094)",
            "cve": "CVE-2024-3094",
            "cvss": 10.0,
            "severity": "CRITICAL",
            "exploit_type": "SSH Authentication Bypass & Backdoor",
            "patch_status": "VULNERABLE",
            "risk_score": 100,
            "icon": "bug"
        }
    },
    {
        "id": "cve-2023-38606",
        "labels": [
            "Vulnerability",
            "CVE"
        ],
        "properties": {
            "id": "cve-2023-38606",
            "name": "Linux Kernel LPE (CVE-2023-38606)",
            "cve": "CVE-2023-38606",
            "cvss": 7.8,
            "severity": "HIGH",
            "exploit_type": "Local Privilege Escalation",
            "patch_status": "UNPATCHED",
            "risk_score": 78,
            "icon": "bug"
        }
    },
    {
        "id": "compute-customer-portal",
        "labels": [
            "Compute",
            "Asset"
        ],
        "properties": {
            "id": "compute-customer-portal",
            "name": "customer-portal-ec2 (Web Frontend)",
            "type": "Amazon EC2 Web Server",
            "runtime": "Amazon Linux 2 / Apache Tomcat",
            "is_internet_facing": True,
            "public_ip": "54.214.19.42",
            "environment": "Production",
            "risk_score": 94,
            "icon": "server"
        }
    },
    {
        "id": "compute-api-gateway",
        "labels": [
            "Compute",
            "Asset"
        ],
        "properties": {
            "id": "compute-api-gateway",
            "name": "public-api-gateway (Edge Router)",
            "type": "AWS API Gateway",
            "runtime": "Serverless HTTP V2",
            "is_internet_facing": True,
            "public_ip": "3.120.45.101",
            "environment": "Production",
            "risk_score": 72,
            "icon": "router"
        }
    },
    {
        "id": "compute-payment-pod",
        "labels": [
            "Compute",
            "Asset"
        ],
        "properties": {
            "id": "compute-payment-pod",
            "name": "payment-processor-pod (EKS Microservice)",
            "type": "Kubernetes Pod (EKS)",
            "runtime": "Node.js 20 Container",
            "is_internet_facing": False,
            "namespace": "payments-prod",
            "environment": "Production",
            "risk_score": 88,
            "icon": "box"
        }
    },
    {
        "id": "compute-auth-lambda",
        "labels": [
            "Compute",
            "Asset"
        ],
        "properties": {
            "id": "compute-auth-lambda",
            "name": "auth-token-verifier-lambda (JWT Server)",
            "type": "AWS Lambda Function",
            "runtime": "Python 3.11",
            "is_internet_facing": False,
            "environment": "Production",
            "risk_score": 62,
            "icon": "zap"
        }
    },
    {
        "id": "compute-data-sync-worker",
        "labels": [
            "Compute",
            "Asset"
        ],
        "properties": {
            "id": "compute-data-sync-worker",
            "name": "nightly-data-sync-worker (Batch Job)",
            "type": "EC2 Batch Worker",
            "runtime": "Ubuntu 22.04 LTS",
            "is_internet_facing": False,
            "environment": "Production",
            "risk_score": 68,
            "icon": "cpu"
        }
    },
    {
        "id": "compute-bastion-ssh",
        "labels": [
            "Compute",
            "Asset"
        ],
        "properties": {
            "id": "compute-bastion-ssh",
            "name": "mgmt-bastion-host (Jump Box)",
            "type": "EC2 Bastion Host",
            "runtime": "Debian 12 / OpenSSH",
            "is_internet_facing": True,
            "public_ip": "18.196.200.12",
            "environment": "Management",
            "risk_score": 90,
            "icon": "terminal"
        }
    },
    {
        "id": "compute-ci-runner",
        "labels": [
            "Compute",
            "Asset"
        ],
        "properties": {
            "id": "compute-ci-runner",
            "name": "jenkins-ci-runner-01 (Build Agent)",
            "type": "Self-Hosted CI/CD Docker Host",
            "runtime": "Ubuntu 22.04 / Docker Socket",
            "is_internet_facing": False,
            "environment": "DevOps Engineering",
            "risk_score": 76,
            "icon": "git-branch"
        }
    },
    {
        "id": "iam-role-web-profile",
        "labels": [
            "Identity",
            "IAMRole"
        ],
        "properties": {
            "id": "iam-role-web-profile",
            "name": "AppServerInstanceProfileRole",
            "arn": "arn:aws:iam::123456789012:role/AppServerProfile",
            "type": "EC2 Instance Profile Role",
            "mfa_enforced": False,
            "is_admin": False,
            "risk_score": 70,
            "icon": "key"
        }
    },
    {
        "id": "iam-role-eks-irsa",
        "labels": [
            "Identity",
            "IAMRole"
        ],
        "properties": {
            "id": "iam-role-eks-irsa",
            "name": "EKS-PaymentService-IRSA-Role",
            "arn": "arn:aws:iam::123456789012:role/EKSPaymentServiceRole",
            "type": "EKS IRSA Service Role",
            "mfa_enforced": False,
            "is_admin": False,
            "risk_score": 80,
            "icon": "key"
        }
    },
    {
        "id": "iam-role-cross-account-db",
        "labels": [
            "Identity",
            "IAMRole",
            "Chokepoint"
        ],
        "properties": {
            "id": "iam-role-cross-account-db",
            "name": "CrossAccountDatabaseAccessRole (Critical Chokepoint)",
            "arn": "arn:aws:iam::999888777666:role/CrossAccountDBReader",
            "type": "Cross-Account STS AssumeRole",
            "mfa_enforced": False,
            "is_admin": False,
            "is_chokepoint": True,
            "risk_score": 96,
            "icon": "alert-triangle"
        }
    },
    {
        "id": "iam-role-cloud-admin",
        "labels": [
            "Identity",
            "IAMRole",
            "Privileged"
        ],
        "properties": {
            "id": "iam-role-cloud-admin",
            "name": "DevOpsSuperAdminRole (Full Admin)",
            "arn": "arn:aws:iam::999888777666:role/DevOpsSuperAdmin",
            "type": "Privileged Administrator Role",
            "mfa_enforced": False,
            "is_admin": True,
            "risk_score": 100,
            "icon": "crown"
        }
    },
    {
        "id": "iam-role-backup-automation",
        "labels": [
            "Identity",
            "IAMRole"
        ],
        "properties": {
            "id": "iam-role-backup-automation",
            "name": "AutomatedBackupPipelineRole",
            "arn": "arn:aws:iam::999888777666:role/BackupPipeline",
            "type": "Automated Service Role",
            "mfa_enforced": False,
            "is_admin": False,
            "risk_score": 84,
            "icon": "repeat"
        }
    },
    {
        "id": "iam-user-alice-contractor",
        "labels": [
            "Identity",
            "IAMUser"
        ],
        "properties": {
            "id": "iam-user-alice-contractor",
            "name": "contractor.alice@partner.io (Stale Keys)",
            "arn": "arn:aws:iam::123456789012:user/contractor.alice",
            "type": "Contractor IAM User",
            "mfa_enforced": False,
            "access_key_age_days": 412,
            "is_admin": False,
            "risk_score": 85,
            "icon": "user-minus"
        }
    },
    {
        "id": "iam-user-bob-devops",
        "labels": [
            "Identity",
            "IAMUser"
        ],
        "properties": {
            "id": "iam-user-bob-devops",
            "name": "bob.devops@company.internal (Hardware MFA)",
            "arn": "arn:aws:iam::999888777666:user/bob.devops",
            "type": "DevOps Lead IAM User",
            "mfa_enforced": True,
            "access_key_age_days": 45,
            "is_admin": True,
            "risk_score": 35,
            "icon": "user-check"
        }
    },
    {
        "id": "secret-kms-customer-key",
        "labels": [
            "Secret",
            "KMSKey",
            "Chokepoint"
        ],
        "properties": {
            "id": "secret-kms-customer-key",
            "name": "kms/prod-customer-data-cmk (KMS Key)",
            "arn": "arn:aws:kms:us-east-1:999888777666:key/c56f-442a-99b1-e781",
            "type": "Customer Managed KMS Master Key",
            "rotation_enabled": False,
            "is_chokepoint": True,
            "risk_score": 98,
            "icon": "key-round"
        }
    },
    {
        "id": "secret-db-master-creds",
        "labels": [
            "Secret",
            "SecretsManager"
        ],
        "properties": {
            "id": "secret-db-master-creds",
            "name": "prod/rds/postgres/master-credentials (DB Password)",
            "arn": "arn:aws:secretsmanager:us-east-1:999888777666:secret:rds-master",
            "type": "AWS Secrets Manager Secret Vault",
            "auto_rotate": False,
            "risk_score": 95,
            "icon": "file-key"
        }
    },
    {
        "id": "secret-ssh-contractor-key",
        "labels": [
            "Secret",
            "SSHKey"
        ],
        "properties": {
            "id": "secret-ssh-contractor-key",
            "name": "id_rsa_contractor_alice (Exposed Private Key)",
            "type": "Unencrypted OpenSSH Private Key",
            "stored_location": "Local Workstation File / Stale Jenkins Workspace",
            "risk_score": 88,
            "icon": "file-code"
        }
    },
    {
        "id": "data-s3-customer-pii",
        "labels": [
            "DataAsset",
            "CrownJewel",
            "S3Bucket"
        ],
        "properties": {
            "id": "data-s3-customer-pii",
            "name": "s3://enterprise-customer-pii-vault (Crown Jewel)",
            "type": "Amazon S3 Data Vault",
            "classification": "CRITICAL_PII",
            "record_count": 2500000,
            "is_crown_jewel": True,
            "is_encrypted": True,
            "data_types": "Social Security Numbers, Passports, PII Records",
            "risk_score": 100,
            "icon": "shield"
        }
    },
    {
        "id": "data-rds-postgres-primary",
        "labels": [
            "DataAsset",
            "CrownJewel",
            "Database"
        ],
        "properties": {
            "id": "data-rds-postgres-primary",
            "name": "aurora-pg-prod-primary.rds (Cardholder DB)",
            "type": "Amazon Aurora PostgreSQL Cluster",
            "classification": "PCI_CARDHOLDER_DATA",
            "record_count": 14200000,
            "is_crown_jewel": True,
            "is_encrypted": True,
            "data_types": "Credit Card Numbers, CVV, Billing Records",
            "risk_score": 100,
            "icon": "database"
        }
    },
    {
        "id": "data-dynamodb-sessions",
        "labels": [
            "DataAsset",
            "Database"
        ],
        "properties": {
            "id": "data-dynamodb-sessions",
            "name": "dynamodb://user-active-jwt-sessions-table",
            "type": "Amazon DynamoDB NoSQL Table",
            "classification": "CONFIDENTIAL",
            "record_count": 890000,
            "is_crown_jewel": False,
            "is_encrypted": True,
            "data_types": "Active Session Tokens, OAuth Signatures",
            "risk_score": 75,
            "icon": "table"
        }
    },
    {
        "id": "data-s3-internal-audit-logs",
        "labels": [
            "DataAsset",
            "S3Bucket"
        ],
        "properties": {
            "id": "data-s3-internal-audit-logs",
            "name": "s3://corp-cloudtrail-flow-logs-archive",
            "type": "Amazon S3 Bucket",
            "classification": "INTERNAL_LOGS",
            "record_count": 45000000,
            "is_crown_jewel": False,
            "is_encrypted": True,
            "data_types": "CloudTrail Audit Events, VPC Flow Logs",
            "risk_score": 50,
            "icon": "archive"
        }
    }
]

RELATIONSHIPS: List[Dict[str, Any]] = [
    {
        "id": "rel-1",
        "source": "actor-apt29",
        "target": "cve-2021-44228",
        "type": "EXPLOITS",
        "properties": {
            "exploit_difficulty": 1.2,
            "method": "Zero-Day JNDI Remote Injection Payload",
            "timestamp": "2026-08-20T04:12:00Z"
        }
    },
    {
        "id": "rel-2",
        "source": "actor-fin7",
        "target": "cve-2024-21626",
        "type": "EXPLOITS",
        "properties": {
            "exploit_difficulty": 2.1,
            "method": "Leaky Vessels runc Container Escape to Kubernetes Node",
            "timestamp": "2026-08-19T18:30:00Z"
        }
    },
    {
        "id": "rel-3",
        "source": "actor-insider-rogue",
        "target": "secret-ssh-contractor-key",
        "type": "POSSESSES",
        "properties": {
            "exploit_difficulty": 1.0,
            "method": "Stolen Stale Credential File from Jenkins Runner",
            "timestamp": "2026-08-18T10:00:00Z"
        }
    },
    {
        "id": "rel-4",
        "source": "cve-2021-44228",
        "target": "compute-customer-portal",
        "type": "AFFECTS",
        "properties": {
            "port": 443,
            "service": "Apache Tomcat / Spring Boot Web Application",
            "remote_access": True
        }
    },
    {
        "id": "rel-5",
        "source": "cve-2024-21626",
        "target": "compute-payment-pod",
        "type": "AFFECTS",
        "properties": {
            "port": 8080,
            "service": "runc Container Engine in Kubernetes Node",
            "remote_access": True
        }
    },
    {
        "id": "rel-6",
        "source": "cve-2024-3094",
        "target": "compute-bastion-ssh",
        "type": "AFFECTS",
        "properties": {
            "port": 22,
            "service": "OpenSSH Daemon Backdoor",
            "remote_access": True
        }
    },
    {
        "id": "rel-7",
        "source": "compute-customer-portal",
        "target": "zone-public-dmz",
        "type": "LOCATED_IN",
        "properties": {
            "subnet_id": "subnet-001a"
        }
    },
    {
        "id": "rel-8",
        "source": "compute-api-gateway",
        "target": "zone-public-dmz",
        "type": "LOCATED_IN",
        "properties": {
            "subnet_id": "subnet-001a"
        }
    },
    {
        "id": "rel-9",
        "source": "compute-payment-pod",
        "target": "zone-app-private",
        "type": "LOCATED_IN",
        "properties": {
            "subnet_id": "subnet-002b"
        }
    },
    {
        "id": "rel-10",
        "source": "compute-auth-lambda",
        "target": "zone-app-private",
        "type": "LOCATED_IN",
        "properties": {
            "subnet_id": "subnet-002b"
        }
    },
    {
        "id": "rel-11",
        "source": "compute-data-sync-worker",
        "target": "zone-app-private",
        "type": "LOCATED_IN",
        "properties": {
            "subnet_id": "subnet-002b"
        }
    },
    {
        "id": "rel-12",
        "source": "compute-bastion-ssh",
        "target": "zone-public-dmz",
        "type": "LOCATED_IN",
        "properties": {
            "subnet_id": "subnet-001a"
        }
    },
    {
        "id": "rel-13",
        "source": "compute-ci-runner",
        "target": "zone-app-private",
        "type": "LOCATED_IN",
        "properties": {
            "subnet_id": "subnet-002c"
        }
    },
    {
        "id": "rel-14",
        "source": "zone-public-dmz",
        "target": "zone-app-private",
        "type": "ROUTES_TRAFFIC_TO",
        "properties": {
            "protocol": "HTTPS/TCP 443",
            "firewall_rule": "ALLOW_PORT_443"
        }
    },
    {
        "id": "rel-15",
        "source": "zone-app-private",
        "target": "zone-db-isolated",
        "type": "ROUTES_TRAFFIC_TO",
        "properties": {
            "protocol": "PostgreSQL/TCP 5432",
            "firewall_rule": "ALLOW_DB_SECURITY_GROUP"
        }
    },
    {
        "id": "rel-16",
        "source": "zone-app-private",
        "target": "zone-pci-regulated",
        "type": "ROUTES_TRAFFIC_TO",
        "properties": {
            "protocol": "mTLS / VPC Peering",
            "firewall_rule": "RESTRICTED_PCI_PEERING"
        }
    },
    {
        "id": "rel-17",
        "source": "compute-customer-portal",
        "target": "iam-role-web-profile",
        "type": "ASSUMES",
        "properties": {
            "mechanism": "EC2 Metadata IMDSv1 (Exposed Token SSRF)",
            "privilege_level": "High",
            "cross_account": False
        }
    },
    {
        "id": "rel-18",
        "source": "compute-payment-pod",
        "target": "iam-role-eks-irsa",
        "type": "ASSUMES",
        "properties": {
            "mechanism": "OIDC Service Account Token Projection",
            "privilege_level": "Elevated",
            "cross_account": False
        }
    },
    {
        "id": "rel-19",
        "source": "compute-auth-lambda",
        "target": "iam-role-web-profile",
        "type": "ASSUMES",
        "properties": {
            "mechanism": "Lambda Execution Role",
            "privilege_level": "Standard",
            "cross_account": False
        }
    },
    {
        "id": "rel-20",
        "source": "secret-ssh-contractor-key",
        "target": "iam-user-alice-contractor",
        "type": "AUTHENTICATES_AS",
        "properties": {
            "mechanism": "Hardcoded Long-Lived AWS Access Key ID + Secret",
            "privilege_level": "User"
        }
    },
    {
        "id": "rel-21",
        "source": "compute-ci-runner",
        "target": "iam-role-backup-automation",
        "type": "ASSUMES",
        "properties": {
            "mechanism": "Instance Profile Attachment",
            "privilege_level": "Automation"
        }
    },
    {
        "id": "rel-22",
        "source": "iam-role-web-profile",
        "target": "iam-role-cross-account-db",
        "type": "ASSUMES",
        "properties": {
            "mechanism": "sts:AssumeRole (Missing ExternalId Check in Trust Policy)",
            "cross_account": True,
            "risk_weight": 9.5
        }
    },
    {
        "id": "rel-23",
        "source": "iam-role-eks-irsa",
        "target": "iam-role-cross-account-db",
        "type": "ASSUMES",
        "properties": {
            "mechanism": "sts:AssumeRole (Unrestricted Principal Trust)",
            "cross_account": True,
            "risk_weight": 9.0
        }
    },
    {
        "id": "rel-24",
        "source": "iam-user-alice-contractor",
        "target": "iam-role-backup-automation",
        "type": "ASSUMES",
        "properties": {
            "mechanism": "sts:AssumeRole (Contractor Legacy Group Trust)",
            "cross_account": False,
            "risk_weight": 7.5
        }
    },
    {
        "id": "rel-25",
        "source": "iam-role-backup-automation",
        "target": "iam-role-cloud-admin",
        "type": "ASSUMES",
        "properties": {
            "mechanism": "sts:AssumeRole (DevOps Misconfiguration)",
            "cross_account": False,
            "is_circular": True,
            "risk_weight": 10.0
        }
    },
    {
        "id": "rel-26",
        "source": "iam-role-cloud-admin",
        "target": "iam-role-backup-automation",
        "type": "ASSUMES",
        "properties": {
            "mechanism": "sts:AssumeRole (Reciprocal Backup Trust)",
            "cross_account": False,
            "is_circular": True,
            "risk_weight": 6.0
        }
    },
    {
        "id": "rel-27",
        "source": "iam-role-cross-account-db",
        "target": "secret-kms-customer-key",
        "type": "HAS_PERMISSION",
        "properties": {
            "action": "kms:Decrypt",
            "effect": "ALLOW",
            "last_used_days": 1,
            "is_admin_action": False
        }
    },
    {
        "id": "rel-28",
        "source": "iam-role-eks-irsa",
        "target": "secret-db-master-creds",
        "type": "HAS_PERMISSION",
        "properties": {
            "action": "secretsmanager:GetSecretValue",
            "effect": "ALLOW",
            "last_used_days": 2,
            "is_admin_action": False
        }
    },
    {
        "id": "rel-29",
        "source": "iam-role-cloud-admin",
        "target": "secret-kms-customer-key",
        "type": "HAS_PERMISSION",
        "properties": {
            "action": "kms:* (Full Cryptographic Bypass)",
            "effect": "ALLOW",
            "last_used_days": 12,
            "is_admin_action": True
        }
    },
    {
        "id": "rel-30",
        "source": "iam-role-cloud-admin",
        "target": "secret-db-master-creds",
        "type": "HAS_PERMISSION",
        "properties": {
            "action": "secretsmanager:* (Full Secret Retrieval)",
            "effect": "ALLOW",
            "last_used_days": 12,
            "is_admin_action": True
        }
    },
    {
        "id": "rel-31",
        "source": "secret-kms-customer-key",
        "target": "data-s3-customer-pii",
        "type": "ENCRYPTS",
        "properties": {
            "algorithm": "AES-256-GCM Envelope Encryption",
            "key_spec": "SYMMETRIC_DEFAULT"
        }
    },
    {
        "id": "rel-32",
        "source": "secret-db-master-creds",
        "target": "data-rds-postgres-primary",
        "type": "AUTHENTICATES_TO",
        "properties": {
            "db_user": "postgres_admin_superuser",
            "port": 5432
        }
    },
    {
        "id": "rel-33",
        "source": "iam-role-cross-account-db",
        "target": "data-s3-customer-pii",
        "type": "HAS_PERMISSION",
        "properties": {
            "action": "s3:GetObject, s3:ListBucket",
            "effect": "ALLOW",
            "last_used_days": 2,
            "is_admin_action": False
        }
    },
    {
        "id": "rel-34",
        "source": "iam-role-cross-account-db",
        "target": "data-rds-postgres-primary",
        "type": "HAS_PERMISSION",
        "properties": {
            "action": "rds-db:connect, postgres:SelectAll",
            "effect": "ALLOW",
            "last_used_days": 3,
            "is_admin_action": False
        }
    },
    {
        "id": "rel-35",
        "source": "iam-role-web-profile",
        "target": "data-dynamodb-sessions",
        "type": "HAS_PERMISSION",
        "properties": {
            "action": "dynamodb:GetItem, dynamodb:PutItem",
            "effect": "ALLOW",
            "last_used_days": 0,
            "is_admin_action": False
        }
    },
    {
        "id": "rel-36",
        "source": "iam-role-backup-automation",
        "target": "data-s3-internal-audit-logs",
        "type": "HAS_PERMISSION",
        "properties": {
            "action": "s3:PutObject, s3:AbortMultipartUpload",
            "effect": "ALLOW",
            "last_used_days": 1,
            "is_admin_action": False
        }
    },
    {
        "id": "rel-37",
        "source": "iam-role-cloud-admin",
        "target": "data-s3-customer-pii",
        "type": "HAS_PERMISSION",
        "properties": {
            "action": "s3:* (Full Data Control)",
            "effect": "ALLOW",
            "last_used_days": 140,
            "is_admin_action": True
        }
    },
    {
        "id": "rel-38",
        "source": "iam-role-cloud-admin",
        "target": "data-rds-postgres-primary",
        "type": "HAS_PERMISSION",
        "properties": {
            "action": "rds:* (Full Database Takeover)",
            "effect": "ALLOW",
            "last_used_days": 115,
            "is_admin_action": True
        }
    }
]

def generate_cypher_seed_queries() -> List[Dict[str, Any]]:
    queries = []
    queries.append({
        "query": "MATCH (n) DETACH DELETE n",
        "params": {}
    })
    for node in NODES:
        labels_str = ":".join(node["labels"])
        queries.append({
            "query": f"CREATE (n:{labels_str} $props)",
            "params": {"props": node["properties"]}
        })
    for rel in RELATIONSHIPS:
        rel_type = rel["type"]
        queries.append({
            "query": f"MATCH (s {{id: $source_id}}), (t {{id: $target_id}}) CREATE (s)-[r:{rel_type} $props]->(t)",
            "params": {
                "source_id": rel["source"],
                "target_id": rel["target"],
                "props": rel["properties"]
            }
        })
    return queries
