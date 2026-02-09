# API Gateway
output "api_gateway_deployment_url" {
  description = "API GatewayのデプロイメントURL"
  value       = try(aws_api_gateway_deployment.main.invoke_url, "")
}

# Cognito
output "cognito_user_pool_id" {
  description = "Cognito User Pool ID"
  value       = try(aws_cognito_user_pool.main.id, "")
}

output "cognito_client_id" {
  description = "Cognito App Client ID"
  value       = try(aws_cognito_user_pool_client.main.id, "")
  sensitive   = false
}

output "cognito_domain" {
  description = "Cognito Hosted UIドメイン"
  value       = try(aws_cognito_user_pool_domain.main.domain, "")
}

output "cognito_identity_pool_id" {
  description = "Cognito Identity Pool ID"
  value       = try(aws_cognito_identity_pool.main.id, "")
}

# S3
output "s3_bucket_name" {
  description = "S3バケット名"
  value       = try(aws_s3_bucket.main.bucket, "")
}
