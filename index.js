const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const res = require("express/lib/response");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 5000;

//electronics_shop
//hwTzof8K74GZE3gq
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gyrha.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("electronics_shop");
    const serviceCollection = database.collection("service");
    const orderCollection = database.collection("order");
    const usersCollection = database.collection("users");
    const reviewCollection = database.collection("review");

    //GET PRODUCT THE API
    app.get("/service", async (req, res) => {
      const result = await serviceCollection.find({}).toArray();
      res.send(result);
    });

    //CREATE A DYNMICE PRODUCT API
    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      //   console.log("getting specific service", id);
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.json(service);
    });

    //Create A Order Api
    app.post("/order", async (req, res) => {
      const data = req.body;
      const result = await orderCollection.insertOne(data);
      res.send(result);
    });

    //Create A User Api
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    //My Order Get Api With Email
    app.get("/myOrder/:email", async (req, res) => {
      const result = await orderCollection
        .find({
          email: req.params.email,
        })
        .toArray();
      res.send(result);
    });

    //Delete The Order Api
    app.delete("/deleteOrder/:id", async (req, res) => {
      // console.log(req.params.id);
      const result = await orderCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    });

    //Get A user api
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.send({ admin: isAdmin });
    });

    //POST REVIEW API
    app.post("/review", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    //GET REVIEW API
    app.get("/review", async (req, res) => {
      const result = await reviewCollection.find({}).toArray();
      res.send(result);
      // console.log(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//middleware b
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("node server running");
});
app.listen(port, () => {
  console.log("server is running port", port);
});
