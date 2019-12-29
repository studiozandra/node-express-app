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

// About page route
app.get('/about', (req, res) => {
    res.send('ABOUT');
});

const port = 5000;

// listen method, pass in port number and callback arrow function
app.listen(port, () => {
    // ES6 template literal, includes variables w/o having to concatenate the 'port' variable
    console.log(`Let's get it started on port ${port}`)
});
// navigate to localhost:5000/