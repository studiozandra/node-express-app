// Entry point file
const express = require('express'); // bring in the Express module
const methodOverride = require('method-override')
const exphb = require('express-handlebars');
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
app.engine('handlebars', exphb({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body-parser middleware - allows us to access the form submissions in the page body
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Method override middleware for form POST (adjust this in edit.handlebars form action:
//     <form action="/ideas/{{idea.id}}?_method=PUT" method="post">
//     <input type="hidden" name="_method" value="PUT"> )
app.use(methodOverride('_method'))

//Index route, request and response
app.get('/', (req, res) => {
    res.render('index');
});

// About page route. insted of res.send('some text'), res.render('about') fills the 'main' layout {{{body}}} with the 'about' content
app.get('/about', (req, res) => {
    res.render('about');
});

// Idea page route
app.get('/ideas', (req, res) => {
    Idea.find({}) // we want to fetch our ideas saved in the db and render them in the HTML view
    .sort({date:'desc'}) // descending order. we will loop through ideas
    .then(ideas => {
        res.render('ideas/index',{
            ideas:ideas
        });
    }) 
     // create index.handlebars inside the views/ideas folder
});

// Add Idea form, GET request
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

// Edit Idea form, GET request. findOne idea, not an array. MongoDB query
app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        res.render('ideas/edit', {idea:idea});
        // passing in the single idea as a parameter
    });
    
});

// Process the form submission (POST req object (request))
app.post('/ideas', (req, res) => {
    // console.log(req.body);
    // res.send('ok dude');
    let errors = []; // set to empty array

    if (!req.body.title){ // check if object containing all of our form fields contains a title
        console.log("no title")
        errors.push( {text:'Please add a title'} );
    }

    if (!req.body.details){
        errors.push( {text:'Please add some details'} );
    }

    // re-render the add idea form if there are errors
    if(errors.length > 0){
        res.render('ideas/add', {
            errors: errors, // pass in the error msg
            title: req.body.title, // preserves the user's title during re-render
            details: req.body.details // preserves the details they entered
        });

    } else {
        // res.send('passed'); // display a 'passed' blank page to test
        const newUser = {
            title: req.body.title,
            details: req.body.details
            // user: req.user.id -- we can add later, scalable

        }
        new Idea(newUser) // pass in the data we want to save, in this case, an object
        .save()
        .then(idea => {
            res.redirect('/ideas');
        }) //returns a promise

        
    }

});

// Edit Form PUT request process. Since we can't just change HTML form method to PUT, we need either AJAX req or module: methodOverride
app.put('/ideas/:id', (req, res) => {
    // update current video idea we are looking at
    Idea.findOne({
        _id: req.params.id 
    })
    .then(idea => {
        //new values
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save() // returns a promise
        .then(idea => {
            res.redirect('/ideas');
        })
    });
});

// Delete Idea - Catch Delete request. As long as the method is diff, URLs can be the same
app.delete('/ideas/:id', (req, res) => {
    // res.send('DELETE');  Test out our route, like a console.log
    Idea.remove({_id: req.params.id})
    .then(() => {
        res.redirect('/ideas');
    })
});


const port = 5000;

// listen method, pass in port number and callback arrow function
app.listen(port, () => {
    // ES6 template literal, includes variables w/o having to concatenate the 'port' variable
    console.log(`Let's get it started on localhost: ${port}`)
});
// command line - node app.js, navigate to localhost:5000/