const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Session middleware for customer routes
app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Sample user authentication function (you'll want to replace this with actual logic)
function authenticatedUser(username, password) {
    // Replace with your actual user authentication logic, e.g., checking against a database
    return username === 'user' && password === 'password';
}

// Authentication middleware for login route
app.use("/customer/auth/*", (req, res, next) => {
    const { username, password } = req.body;

    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign(
            { username: username }, // Save relevant user data (here just the username)
            'access', // Secret key for signing
            { expiresIn: '60' } // Token expiration time
        );

        // Store access token and username in session
        req.session.authorization = {
            accessToken,
            username
        };

        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Routes for customer and general purposes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
