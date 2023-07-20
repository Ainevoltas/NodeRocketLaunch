// app.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const https = require('node:https');

app.use(cors());
app.use(express.static(__dirname));
app.use(express.static('public'));

const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// GET route for the home page with the input form
app.get('/', (req, res) => {
  res.render('index');
});

// POST route to handle the form submission
app.post('/', async (req, res) => {
  const rocketId = req.body.rocketId;

  const instance = axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    })
  });

  try {
    const response = await instance.get(`https://localhost:7079/api/rocketAPI/${rocketId}`);
    console.log(response);
    const rocketData = response.data;

    res.render('launch', { rocketData });
  } catch (error) {
    if (error.response && error.response.status === 404) {
        res.status(404).render('error', { message: "Rocket with specified ID not found." });
      } else {
        res.render('error', { message: "An unexpected error occurred." });
      }
  }
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
