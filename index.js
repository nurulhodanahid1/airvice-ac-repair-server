const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectID = require('mongodb').ObjectID;

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6dt9c.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

///////
client.connect(err => {
  const serviceCollection = client.db(process.env.DB_NAME).collection("services");
  const orderCollection = client.db(process.env.DB_NAME).collection("orders");
  const reviewCollection = client.db(process.env.DB_NAME).collection("reviews");
  const engineerCollection = client.db(process.env.DB_NAME).collection("engineers");

  app.post("/addServices", (req, res) => {
    const newService = req.body;
    console.log("New Event", newService);
    serviceCollection.insertOne(newService)
      .then(result => {
        console.log("inserted count", result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })


  app.get('/services', (req, res) => {
    serviceCollection.find()
      .toArray((err, items) => {
        res.send(items);
      })
  })

  app.delete('/deleteService/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    console.log('delete event', id);
    serviceCollection.findOneAndDelete({ _id: id })
      .then(documents => res.send(!!documents.value))
  })

  // Add Orders
  app.post('/addOrders', (req, res) => {
    const newOrder = req.body;
    orderCollection.insertOne(newOrder)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/orders', (req, res) => {
    //console.log(req.query.email)
    orderCollection.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  //add review
  app.post("/addReviews", (req, res) => {
    const newReview = req.body;
    console.log("New Review", newReview);
    reviewCollection.insertOne(newReview)
      .then(result => {
        console.log("inserted count", result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })


  app.get('/reviews', (req, res) => {
    reviewCollection.find()
      .toArray((err, items) => {
        res.send(items);
      })
  })

  /////////////add engineer

  app.post("/addEngineers", (req, res) => {
    const newEngineer = req.body;
    console.log("New Engineer", newEngineer);
    engineerCollection.insertOne(newEngineer)
      .then(result => {
        console.log("inserted count", result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/engineers', (req, res) => {
    engineerCollection.find()
      .toArray((err, items) => {
        res.send(items);
      })
  })
  ///admin
  app.post('/isEngineer', (req, res) => {
    const signInEmail = req.body.email;
    console.log("isEngineer", signInEmail)
    engineerCollection.find({ email: signInEmail})
      .toArray((err, engineers) => {
        res.send(engineers.length > 0);
      })
  })

});
/////////

app.get('/', (req, res) => {
  res.send('Hello from Airvice AC Repairing!')
})

app.listen(process.env.PORT || port)