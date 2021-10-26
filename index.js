const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

//SuxFkhyHJhonnyMIIajWYkBeda
//middleware
app.use(cors());
app.use(express.json());

//database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cebya.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//db
async function run() {
  try {
    await client.connect();
    const database = client.db("carMechanic");
    const serviceCollections = database.collection("services");

    //get
    app.get("/services", async (req, res) => {
      const cursor = serviceCollections.find({});
      const result = await cursor.toArray();
      //   console.log(result, cursor);
      res.send(result);
    });

    //get single
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await serviceCollections.findOne(query);
      //   console.log(result);
      res.send(result);
    });

    //post
    app.post("/services", async (req, res) => {
      const doc = req.body;
      const result = await serviceCollections.insertOne(doc);
      res.json(result);
    });

    //delete
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      //   console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await serviceCollections.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

//home page
app.get("/", (req, res) => {
  res.send("car mechanic server is running");
});
//listen
app.listen(port, () => {
  console.log("running port on", port);
});
