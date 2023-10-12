// Import the AWS SDK
const AWS = require('aws-sdk');

// Import database configuration (including table name and DynamoDB instance)
const { DbName, dynamoDB } = require('../database/db.config.js');

// Create a new book
exports.create = (req, res) => {
    // Check if all required fields are provided in the request body
    if (!req.body.BookID || !req.body.BookName || !req.body.AuthorName || !req.body.BookPrice || !req.body.PublishedDate) {
        res.status(400).send({ message: "All fields are required!" });
        return;
    }

    // Define the data for the new book
    const params = {
        TableName: DbName, // Specify the DynamoDB table name
        Item: {
            BookID: req.body.BookID,
            BookName: req.body.BookName,
            AuthorName: req.body.AuthorName,
            BookPrice: req.body.BookPrice,
            PublishedDate: req.body.PublishedDate,
            IsAvailable: req.body.IsAvailable ? req.body.IsAvailable : true // Set availability if provided, otherwise default to true
        }
    };

    // Insert the new book data into the DynamoDB table
    dynamoDB.put(params, (err, data) => {
        if (err) {
            res.status(500).send({ message: err.message || "Error while creating a book." });
        } else {
            res.send({
                message: "Book created successfully",
                data: params.Item
            });
        }
    });
};

// Get all books
exports.getBook = (req, res) => {
    // Define parameters to scan the DynamoDB table
    const params = {
        TableName: DbName
    };

    // Perform a scan operation to retrieve all books from the table
    dynamoDB.scan(params, (err, data) => {
        if (err) {
            res.status(500).send({ message: err.message || "Error while retrieving books." });
        } else {
            res.send(data.Items); // Send the list of books as a response
        }
    });
};

    // Get a single book by ID
    exports.find = (req, res) => {
        const id = req.params.id; // Extract the book ID from the request parameters

        // Define parameters to retrieve a book by its ID
        const params = {
            TableName: DbName,
            Key: {
                BookID: id
            }
        };

        // Retrieve the book data from the DynamoDB table using its ID
        dynamoDB.get(params, (err, data) => {
            if (err) {
                res.status(500).send({ message: "Error retrieving book with id " + id });
            } else {
                if (data.Item) {
                    res.send({
                        message: "Book retrieved successfully",
                        data: data.Item
                    });
                } else {
                    res.status(404).send({ message: "Book with id " + id + " not found." });
                }
            }
        });
    };

// Update a book by ID
exports.update = (req, res) => {
    // Check if request body is provided
    if (!req.body) {
        res.status(400).send({ message: "All fields are required!" });
        return;
    }

    const id = req.params.id; // Extract the book ID from the request parameters

    // Define parameters to update a book's information
    const params = {
        TableName: DbName,
        Key: {
            BookID: id
        },
        UpdateExpression: "set BookName = :BookName, AuthorName = :AuthorName, BookPrice = :BookPrice, PublishedDate = :PublishedDate",
        ExpressionAttributeValues: {
            ":BookName": req.body.BookName,
            ":AuthorName": req.body.AuthorName,
            ":BookPrice": req.body.BookPrice,
            ":PublishedDate": req.body.PublishedDate
        },
        ReturnValues: "UPDATED_NEW"
    };

    // Update the book's information in the DynamoDB table
    dynamoDB.update(params, (err, data) => {
        if (err) {
            res.status(500).send({ message: "Error updating book with id " + id + ": " + err.message });
        } else {
            res.send(data);
        }
    });
};

// Delete a book by ID
exports.delete = (req, res) => {
    const id = req.params.id; // Extract the book ID from the request parameters

    // Define parameters to delete a book by its ID
    const params = {
        TableName: DbName,
        Key: {
            BookID: id
        }
    };

    // Delete the book from the DynamoDB table
    dynamoDB.delete(params, (err, data) => {
        if (err) {
            res.status(500).send({ message: "Error deleting book with id " + id });
        } else {
            res.send({
                message: "Book deleted successfully!"
            });
        }
    });
};
