// Entry point file
const express = require('express'); // bring in the Express module
const expbh = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express(); // initialize the app


// Connect to mongoose. It will respond with a promise, we catch it with .then
// could be a remote db from mlab, or a local db
mongoose.connect('mongodb://localhost/vidjot-dev', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=> console.log('MongoDB connected...')) // if connection goes ok, this will log out
.catch(err => console.log(err)); // if it can't connect, it will log the error

// Load Idea Model into a variable. ./models - dot slash means 'look in the current dir for the file'
require('./models/Idea');
const Idea = mongoose.model('ideas');

//Handlebars Middleware:
app.engine('handlebars', expbh({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body-parser middleware - allows us to access the form submissions in the page body
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Index route, request and response
app.get('/', (req, res) => {
    res.render('index');
});

// About page route. insted of res.send('some text'), res.render('about') fills the 'main' layout {{{body}}} with the 'about' content
app.get('/about', (req, res) => {
    res.render('about');
});

// Add Idea form, GET request
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

// Process the form submission (POST req object (request))
app.post('/ideas', (req, res) => {
    console.log(req.body);
    res.send('ok dude');
})

const port = 5000;

// listen method, pass in port number and callback arrow function
app.listen(port, () => {
    // ES6 template literal, includes variables w/o having to concatenate the 'port' variable
    console.log(`Let's get it started on localhost: ${port}`)
});
// navigate to localhost:5000/