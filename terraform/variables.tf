variable "project_id" {
  description = "The ID of the Google Cloud project."
  type        = string
}

variable "region" {
  description = "The GCP region for deployments."
  type        = string
  default     = "europe-west1"
}

variable "database_url" {
  description = "Database connection string for the backend."
  type        = string
}

variable "url" {
  description = "url"
  type        = string
}

variable "domain" {
  description = "domain"
  type        = string
}

variable "smtp_email" {
  description = "smtp_email"
  type        = string
}

variable "smtp_password" {
  description = "smtp_password"
  sensitive   = true
  type        = string
}

variable "credentials_file" {
  description = "Path to the service account JSON key"
  type        = string
  default     = "~/.config/gcloud/application_default_credentials.json"
}

variable "database_instance_connection_name" {
  description = "The connection name of the Cloud SQL instance (e.g., project:region:instance)."
  type        = string
}

variable "db_user" {
  description = "Database username for the application."
  type        = string
}

variable "db_password" {
  description = "Database password for the application."
  type        = string
  sensitive   = true
}

variable "db_name" {
  description = "Database name for the application."
  type        = string
}
