const axios = require('axios');

// Route to render the home page
exports.homeRoutes = (req, res) => {
    // Make a GET request to fetch books from the API
    axios.get('http://localhost:3000/api/books')
        .then(function(response) {
            // Render the 'index' view and pass the fetched books data
            res.render('index', { books: response.data });
        })
        .catch(err => {
            res.send(err);
        });
}

// Route to render the add book page
exports.add_book = (req, res) => {
    // Render the 'add_book' view
    res.render('add_book');
}

// Route to render the update book page
exports.update_book = (req, res) => {
    // Make a GET request to fetch book details based on provided query parameter
    axios.get('http://localhost:3000/api/books', { params: { id: req.query.id } })
        .then(function(response) {
            // Render the 'update_book' view and pass the fetched book data
            res.render("update_book", { book: response.data });
        })
        .catch(err => {
            res.send(err);
        });
}
