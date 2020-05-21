const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const config = require('./config.js');
const todoModel = require('./models/todoSchema');

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, 'client', 'build')))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', "index.html"))
  })
}

mongoose.Promise = global.Promise;

mongoose.connect(config.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("Database connection successful")
  })
  .catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
  })

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// API CALLS

//Get Todos from database
app.get('/todo', (req, res) => {
  todoModel.find()
    .then(response => {
      console.log(response)
      res.status(200).json({message: "Todo retrieved successfully!", data: response})
    }).catch(err => {
      console.log(err);
      res.status(400).json({ error: true, message: "Unable to get Todo(s)" });
    })
})

// Add new todo to database
app.post('/newtodo', (req, res) => {
  const { text } = req.body
  console.log(req.body)
  let data = {
    text: text,
    completed: false,
    key: Date.now()
  }
  const newTodo = new todoModel(data)

  newTodo.save()
    .then(response => {
      console.log("New Todo added successfully")
      res.status(200).json({ success: true, message: "Todo added sucessfully!" })
    })
    .catch(err => {
      console.log(err)
      res.status(400).json({ error: true, message: "An error occurred", error: err })
    })
})


app.listen(config.port, () => {
  console.log('Backend running on port ', config.port);
})