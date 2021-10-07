//jshint esversion:6
const path = require('path');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const connectDB = require('./database/connection');

const app = express();
const dotenv = require('dotenv');
dotenv.config({ path: 'config.env' })
app.set('view engine', 'ejs');
app.set('views', 'views'); //if default name fof view folder change then need to mention here

app.use(morgan('tiny')); // this module helps us to log incoming url
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.json());
// app.use(express.urlencoded({
//     extended: true
// }));
app.use(express.static(path.join(__dirname, 'public')));

connectDB();

if (!process.env.JWT_PRIVATE_KEY) {
    console.error("FATAL ERROR: JWT Key is not given!!!");
    process.exit(1);
}


app.use(express.json()); ///needs for parsing the request body of the post request
//--------------------API--------------------
// app.use("/", require('./routes/admin'));
app.use("/api/user", require('./routes/user'));
app.use("/api/area", require('./routes/area'));
app.use("/api/search", require('./routes/search'));
app.use("/api/ambulance", require('./routes/ambulance'));
app.use("/api/cylinder", require('./routes/cylinder'));
app.use("/api/auth", require('./routes/auth'));



app.use(function(req, res) {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
    //res.status(404).render('404', { pageTitle: 'Page Not Found' })
});

const port = process.env.PORT || 3000;


app.listen(port, function() {
    console.log(`Server started on port ${port}`);
});