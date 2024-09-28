const express = require('express');
const { DateTime } = require('luxon');
const axios = require('axios');
const app = express();
const port = 3000;

// Middleware
app.set('view engine', 'ejs'); // Set EJS as the templating engine
app.use(express.static('public'));

// API fetch function using Axios
function fetchContestData(username, apiKey, callback) {
    const url = 'https://clist.by/api/v4/contest/';
    const startGte = DateTime.utc().toISO();

    const params = {
        start__gte: startGte,
        order_by: 'start',
        username,
        api_key: apiKey,
    };

    axios.get(url, { params })
        .then(response => {
            callback(null, response.data.objects);
        })
        .catch(error => {
            callback(error, null);
        });
}

// Routes
app.get('/', (req, res) => {
    const username = 'adidimble';
    const apiKey = '3beb1bfdf3a521abbfede8f7dbec8ef2715bf989';

    fetchContestData(username, apiKey, (error, contestData) => {
        if (error) {
            console.error('Error fetching contest data:', error);
            res.render('error', { error });
        } else {
            // console.log('Fetched contest data:', JSON.stringify(contestData, null, 2)); // Print the contest data structure
            res.render('index', { contests: contestData });
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
