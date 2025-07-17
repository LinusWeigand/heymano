provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_cloud_run_service" "app" {
  name     = "fullstack-app"
  location = var.region

  template {
    metadata {
      annotations = {
        "autoscaling.knative.dev/minScale"      = "2"
        "autoscaling.knative.dev/maxScale"      = "10"
        "run.googleapis.com/cloudsql-instances" = var.database_instance_connection_name
      }
    }

    spec {
      containers {
        image = "europe-west3-docker.pkg.dev/${var.project_id}/my-repo/fullstack-app:v5"

        env {
          name  = "DATABASE_URL"
          value = "postgresql://${var.db_user}:${var.db_password}@127.0.0.1:5432/${var.db_name}?schema=public"
        }
        env {
          name  = "DB_CONNECTION_NAME"
          value = var.database_instance_connection_name
        }

        env {
          name  = "URL"
          value = var.url
        }

        env {
          name  = "DOMAIN"
          value = var.domain
        }

        env {
          name  = "SMTP_EMAIL"
          value = var.smtp_email
        }

        env {
          name  = "SMTP_PASSWORD"
          value = var.smtp_password
        }

        ports {
          container_port = 8080
        }
        startup_probe {
          tcp_socket {
            port = 8080
          }
          initial_delay_seconds = 5
          timeout_seconds       = 5
          period_seconds        = 10
          failure_threshold     = 60
        }

        resources {
          limits = {
            memory = "1024Mi"
            cpu    = "2"
          }
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}
# Allow public access to Cloud Run (Unauthenticated Users)
resource "google_cloud_run_service_iam_policy" "public_access" {
  location    = google_cloud_run_service.app.location
  service     = google_cloud_run_service.app.name
  policy_data = <<EOT
{
  "bindings": [
    {
      "role": "roles/run.invoker",
      "members": ["allUsers"]
    }
  ]
}
EOT
}


output "cloud_run_url" {
  value = google_cloud_run_service.app.status[0].url
}
