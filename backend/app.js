require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const host = process.env.HOST || 'http://localhost';
const port = process.env.PORT || 3000;

// Enable CORS for all requests
app.use(cors());

// Serve static files with CORS headers
app.use('/images', express.static(path.join(__dirname, 'images'), {
    setHeaders: (res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
}));

app.get('/', (req, res) => {
    res.json({ message: "Hello, World!" });
});

app.get('/products', (req, res) => {
    res.json([
        {
            "id": 1,
            "thumbnail": `${host}:${port}/images/headPhone.jpg`,
            "title": "Wireless Headphones",
            "price": 59.99,
            "category": "Electronics & computers",
            "condition": "New"
        },
        {
            "id": 2,
            "thumbnail": `${host}:${port}/images/nikeShoe.jpg`,
            "title": "Running Shoes",
            "price": 79.99,
            "category": "Men's clothing & shoes",
            "condition": "New"
        },
        {
            "id": 3,
            "thumbnail": `${host}:${port}/images/backPack.jpg`,
            "title": "Backpack",
            "price": 39.99,
            "category": "Bags & luggage",
            "condition": "New"
        },
        {
            "id": 4,
            "thumbnail": `${host}:${port}/images/smartWatch.jpg`,
            "title": "Smartwatch",
            "price": 129.99,
            "category": "Jewellery and accessories",
            "condition": "New"
        }
    ]);
});

app.listen(port, () => {
    console.log(`Server is running at ${host}:${port}`);
});
