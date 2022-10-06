const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

//Midleware
app.use(express.json());
app.use(cors());
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

//Api
require('./routes/router')(app)

app.get("/", (req, res) => res.send("Welcome to api"))

//Port
let PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Express is working on port ${PORT}`));
