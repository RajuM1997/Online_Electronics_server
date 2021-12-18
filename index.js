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
