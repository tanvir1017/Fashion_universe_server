const express = require("express");
const ObjectId = require("mongodb").ObjectId;
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const port = process.env.PROT || 5000;

// middlewareWrapper
app.use(cors());
app.use(express.json());

// mongodb connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.14uaf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("data");
    const dataCollection = database.collection("product");
    const ordersCollection = database.collection("orders");

    // get all product and limit product
    app.get("/product", async (req, res) => {
      const size = parseInt(req.query.size);
      const cursor = dataCollection.find({});
      let result;
      if (size) {
        result = await cursor.limit(size).toArray();
      } else {
        result = await cursor.toArray();
      }
      res.json(result);
    });
    // get specific product
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const cursor = await dataCollection.findOne(query);
      res.json(cursor);
    });
    // order post
    app.post("/orders", async (req, res) => {
      const cursor = req.body;
      const result = await ordersCollection.insertOne(cursor);
      res.json(result);
    });
    // order post
    app.get("/manageOrders", async (req, res) => {
      const cursor = ordersCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });
    // order post
    app.get("/orders", async (req, res) => {
      const user = req.query.email;
      const query = { email: user };
      const cursor = ordersCollection.find(query);
      const result = await cursor.toArray();
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from Crud operation");
});
app.listen(port, () => {
  console.log("Liseting from port", port);
});
