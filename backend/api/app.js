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