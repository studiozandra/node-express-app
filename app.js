// Entry point file

const express = require('express'); // bring in the Express module

const app = express(); // initialize the app

//Index route
app.get();

const port = 5000;

// pass in port number and callback arrow function
app.listen(port, () =>{
    // ES6 template literal, includes variables w/o having to concatenate
    console.log(`Let's get it started on port ${port}`)
});
// navigate to localhost:5000/