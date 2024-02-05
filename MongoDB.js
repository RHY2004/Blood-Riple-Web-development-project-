const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
app.use(bodyParser.json());

// MongoDB connection URI
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

// Connect to MongoDB
async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}
connectToMongoDB();

// Route to handle signup
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Get the database and collection
        const db = client.db('mydatabase');
        const usersCollection = db.collection('users');

        // Insert the new user into the users collection
        await usersCollection.insertOne({ username, password });
        console.log('User inserted into MongoDB');
        res.status(200).json({ message: 'Signup successful' });
    } catch (error) {
        console.error('Error inserting user into MongoDB:', error);
        res.status(500).json({ message: 'Signup failed' });
    }
});

// Route to handle login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Get the database and collection
        const db = client.db('mydatabase');
        const usersCollection = db.collection('users');

        // Find the user in the users collection
        const user = await usersCollection.findOne({ username, password });

        if (user) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error finding user in MongoDB:', error);
        res.status(500).json({ message: 'Login failed' });
    }
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
