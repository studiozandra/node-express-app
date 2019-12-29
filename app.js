// Entry point file
const express = require('express'); // bring in the Express module
const expbh = require('express-handlebars')

const app = express(); // initialize the app

//Handlebars Middleware:
app.engine('handlebars', expbh({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Index route, request and response
app.get('/', (req, res) => {
    res.render('index');
});

// About page route. insted of res.send('some text'), res.render('about') fills the 'main' layout {{{body}}} with the 'about' content
app.get('/about', (req, res) => {
    res.render('about');
});

const port = 5000;

// listen method, pass in port number and callback arrow function
app.listen(port, () => {
    // ES6 template literal, includes variables w/o having to concatenate the 'port' variable
    console.log(`Let's get it started on port ${port}`)
});
// navigate to localhost:5000/