require('dotenv').config();

//Required modules
const axios = require('axios');
const express = require('express');
const { MongoClient } = require('mongodb');

//Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;
const MONGO_URL = process.env.MONGO_URL;

//Connection to MongoDB
let db;

MongoClient.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if(err) return console.error(err);
    db = client.db('movieList');
    console.log("Connected to MongoDB")
});

//Fetching movies from API and Inserting to Mongo
app.get('/fetch-movies', async(req, res) =>{
    try {
        const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
            params: {
                api_key: API_KEY,
                primary_release_date_gte: '2024-01-01',
                primary_release_date_lte: '2024-12-31'
            }

        });

        const movies = response.data.results;
        const collection = db.collection('movies');
        await collection.insertMany(movies);

        res.send('Movies data fetched and stored successfully!');

    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data from TMDB API');
    }
});

//Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


