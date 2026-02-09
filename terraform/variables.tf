variable "aws_region" {
  description = "AWSリージョン"
  type        = string
  default     = "ap-northeast-1"
}

variable "environment" {
  description = "環境名（dev, staging, prod）"
  type        = string
}

variable "app_name" {
  description = "アプリケーション名"
  type        = string
  default     = "nandemo-counter"
}

variable "cognito_user_pool_name" {
  description = "Cognito User Pool名"
  type        = string
}

variable "cognito_domain_prefix" {
  description = "Cognito Hosted UIドメインのプレフィックス"
  type        = string
}

variable "lambda_runtime" {
  description = "Lambda関数のランタイム"
  type        = string
  default     = "nodejs20.x"
}

variable "lambda_timeout" {
  description = "Lambda関数のタイムアウト（秒）"
  type        = number
  default     = 30
}

variable "lambda_memory_size" {
  description = "Lambda関数のメモリサイズ（MB）"
  type        = number
  default     = 256
}

variable "api_gateway_stage_name" {
  description = "API Gatewayのステージ名"
  type        = string
  default     = "prod"
}

variable "enable_xray" {
  description = "AWS X-Rayの有効化"
  type        = bool
  default     = false
}

variable "dynamodb_read_capacity" {
  description = "DynamoDBの読み取りキャパシティ"
  type        = number
  default     = 2
}

variable "dynamodb_write_capacity" {
  description = "DynamoDBの書き込みキャパシティ"
  type        = number
  default     = 2
}

variable "sns_sender_id" {
  description = "SNS送信者ID"
  type        = string
  default     = "NANDEMOCOUNTER"
}
