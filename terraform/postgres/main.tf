provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_sql_database_instance" "postgres_instance" {
  name                = "postgres"
  database_version    = "POSTGRES_15"
  region              = var.region
  deletion_protection = false

  settings {
    tier              = "db-g1-small"
    availability_type = "ZONAL"

    backup_configuration {
      enabled                        = true
      point_in_time_recovery_enabled = true
      binary_log_enabled             = false
    }

    ip_configuration {
      ipv4_enabled = true
    }
  }
}

resource "google_sql_user" "db_user" {
  name     = var.db_user
  instance = google_sql_database_instance.postgres_instance.name
  password = var.db_password
}

resource "google_sql_database" "database" {
  name     = var.db_name
  instance = google_sql_database_instance.postgres_instance.name
}

output "database_instance_connection_name" {
  value = google_sql_database_instance.postgres_instance.connection_name
}

output "database_instance_ip" {
  value = google_sql_database_instance.postgres_instance.first_ip_address
}
