# DynamoDB Table: Counters
resource "aws_dynamodb_table" "counters" {
  name           = "${local.name_prefix}-counters"
  billing_mode   = "PROVISIONED"
  read_capacity  = var.dynamodb_read_capacity
  write_capacity = var.dynamodb_write_capacity
  hash_key       = "counterId"

  attribute {
    name = "counterId"
    type = "S"
  }

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "name"
    type = "S"
  }

  global_secondary_index {
    name            = "userId-index"
    hash_key        = "userId"
    read_capacity   = var.dynamodb_read_capacity
    write_capacity  = var.dynamodb_write_capacity
  }

  global_secondary_index {
    name            = "name-index"
    hash_key        = "name"
    read_capacity   = var.dynamodb_read_capacity
    write_capacity  = var.dynamodb_write_capacity
  }

  tags = {
    Name = "${local.name_prefix}-counters"
  }
}
