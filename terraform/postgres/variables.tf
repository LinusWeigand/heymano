variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "Region for Cloud SQL instance"
  type        = string
}

variable "db_name" {
  description = "Name of the PostgreSQL database"
  type        = string
  default     = "mano"
}

variable "db_user" {
  description = "Database username"
  type        = string
  default     = "linus"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}
