# Define the required provider for AWS and its version
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.14.0"
    }
  }
}

# Declare your input variables
variable "aws_access_key" {
  description = "AWS Access Key"
}

variable "aws_secret_key" {
  description = "AWS Secret Key"
}

# Configure the AWS provider with region and access credentials
provider "aws" {
  region = "ap-south-1"
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}


# Create an AWS key pair for SSH access to EC2 instances
resource "aws_key_pair" "key_pair" {
  key_name   = "bookappkey.pem"  # change as per your key pair name
  public_key = tls_private_key.rsa_4096.public_key_openssh
}

# Generate an RSA private key
resource "tls_private_key" "rsa_4096" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

# Save the private key as a PEM file locally
resource "local_file" "private_key" {
  content  = tls_private_key.rsa_4096.private_key_pem
  filename = "bookappkey.pem"  # Fixed key pair name
}

# Create a security group for EC2 instance
resource "aws_security_group" "sg_ec2" {
  name        = "sg_ec2"
  description = "Allow incoming HTTP, HTTPS, and TCP traffic"

  # inbond rules

  // Allow HTTP traffic
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  // Allow HTTPS traffic
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  // Allow TCP traffic
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  // Allow custom tcp traffic
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Outbound rules
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]  # Allow all outbound traffic
  }

  # Allow HTTP traffic outbound
  egress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow HTTPS traffic outbound
  egress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Create an EC2 instance
resource "aws_instance" "bookapp_instance" {
  ami           = "ami-0f5ee92e2d63afc18"
  instance_type = "t2.micro"
  key_name      = aws_key_pair.key_pair.key_name
  security_groups = [aws_security_group.sg_ec2.name]
  
  subnet_id     = "your_subnet_id_here"  # Replace with the ID of your desired subnet
  
  tags = {
    Name = "bookapp_instance"
  }

  root_block_device {
    volume_size = 30
    volume_type = "gp2"
  }

  volume_tags = {
    Name = "bookapp_instance"
  }

  # Specify the user_data script to run during instance startup
  user_data = <<-EOF
#!/bin/bash
sudo apt-get update
sudo apt-get install -y nodejs
sudo apt-get install -y npm
sudo apt-get install -y git
sudo npm install -g pm2
sudo git clone "https://github.com/Ramyaasrii/Book_App-using-DynamoDB.git"
cd "bookapp"
sudo tee .env > /dev/null << EOL
PORT=3000
AWS_ACCESS_KEY_ID=${var.aws_access_key}
AWS_SECRET_ACCESS_KEY=${var.aws_secret_key}
EOL
sudo npm install
sudo pm2 start server.js
EOF
}
