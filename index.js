require('dotenv').config();

// Required modules
const axios = require('axios');
const express = require('express');
const mongoose = require('mongoose');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;
const MONGO_URL = process.env.MONGO_URL;

// Connection to MongoDB using Mongoose
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

// Define a schema and model for movies
const movieSchema = new mongoose.Schema({
    title: { type: String, unique: true },
    release_date: String,
    actors: [String], // Array of actor names
    characters: [String], // Array of character names
    directors: [String], // Array of director names
    // Add other fields as needed
});

const Movie = mongoose.model('Movie', movieSchema);

// Fetching movies from API and Inserting to Mongo
app.get('/add-movies', async (req, res) => {
    try {
        let page = 1;
        let totalPages = 1;
        const maxPages = 50;

        while (page <= totalPages && page <= maxPages) {
            const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
                params: {
                    api_key: API_KEY,
                    primary_release_year: 2024,
                    primary_release_date_gte: '2024-09-01',
                    primary_release_date_lte: '2024-10-05',
                    page: page
                }
            });

            totalPages = response.data.total_pages;

            const movies = await Promise.all(response.data.results.map(async (movie) => {
                const movieDetails = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}`, {
                    params: {
                        api_key: API_KEY,
                        append_to_response: 'credits'
                    }
                });

                const details = movieDetails.data;
                const existingMovie = await Movie.findOne({ title: details.title });

                if (!existingMovie) {
                    return {
                        title: details.title,
                        release_date: details.release_date,
                        actors: details.credits.cast.map(cast => cast.name),
                        characters: details.credits.cast.map(cast => cast.character),
                        directors: details.credits.crew.filter(crew => crew.job === 'Director').map(director => director.name)
                    };
                }
                return null;
            }));

            const filteredMovies = movies.filter(movie => movie !== null);
            await Movie.insertMany(filteredMovies, { ordered: false });

            page++;
        }

        res.send('Movies data fetched and stored successfully!');
    } catch (error) {
        if (error.response && error.response.status === 400) {
            console.error('Bad Request:', error.response.data);
        } else if (error.code === 11000) {
            console.warn('Duplicate key error:', error.message);
        } else {
            console.error('Error fetching data from TMDB API:', error);
        }
        res.status(500).send('Error fetching data from TMDB API');
    }
});

// Search movies endpoint
app.get('/search-movies', async (req, res) => {
    const { startDate } = req.query;
    const endDate = '2024-12-31';
    const query = {};

    if (startDate) {
        query.release_date = {
            $gte: startDate,
            $lte: endDate
        };
    }

    console.log('Query:', query); // Log the query

    try {
        const movies = await Movie.find(query).exec();
        console.log('Movies found:', movies.length); // Log the number of movies found

        // Collect unique titles, actors, characters, and directors
        const titles = new Set();
        const actors = new Set();
        const characters = new Set();
        const directors = new Set();

        movies.forEach(movie => {
            titles.add(movie.title);
            movie.actors.forEach(actor => actors.add(actor));
            movie.characters.forEach(character => characters.add(character));
            movie.directors.forEach(director => directors.add(director));
        });

        // Print unique titles, actors, characters, and directors
        console.log('Titles:', Array.from(titles).join(', '));
        console.log('Actors:', Array.from(actors).join(', '));
        console.log('Characters:', Array.from(characters).join(', '));
        console.log('Directors:', Array.from(directors).join(', '));

        // Send the unique values as the response
        res.json({
            titles: Array.from(titles),
            actors: Array.from(actors),
            characters: Array.from(characters),
            directors: Array.from(directors)
        });
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).send('Error fetching movies');
    }
});


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
