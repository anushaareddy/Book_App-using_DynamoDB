const AWS = require('aws-sdk');

// Configure AWS SDK with your credentials
AWS.config.update({
    region: 'ap-south-1',   // AWS region
    accessKeyId: process.env.AWS_ACCESS_KEY,          // Your AWS access key
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY // Your AWS secret access key
});

// Create a DynamoDB DocumentClient
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Name of the DynamoDB table
const DbName = 'BookDb';

// Export the configured DynamoDB DocumentClient and table name
module.exports = { dynamoDB, DbName };
