const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const { response } = require("express");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2du46.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9lpvp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("cars_haat");
    const usersCollectioin = database.collection("users");
    const productsCollectioin = database.collection("products");
    const ordersCollectioin = database.collection("orders");
    const newsCollection = database.collection("news");
    const revirewsColection = database.collection("reviews");
    const customerReviewCollection = database.collection("customerreview");

    // users post api
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollectioin.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollectioin.insertOne(user);
      res.json(result);
    });

    app.get("/users", async (req, res) => {
      const cursor = ordersCollectioin.find({});
      const users = await cursor.toArray();
      res.send(users);
    });

    app.put("/users", async (req, res) => {
      const user = req.body;
      console.log("user", user);
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollectioin.updateOne(filter, updateDoc);
      console.log("admin ", result);
      res.json(result);
    });

    // add order api
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await ordersCollectioin.insertOne(order);
      res.json(result);
    });
    //order get api
    app.get("/orders", async (req, res) => {
      const cursor = ordersCollectioin.find({});
      const order = await cursor.toArray();
      res.send(order);
    });

    // DELETE API
    app.delete("/order/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await ordersCollectioin.deleteOne(query);
      res.json(result);
    });

    app.get("/products", async (req, res) => {
      const cursor = productsCollectioin.find({});
      const product = await cursor.toArray();
      res.send(product);
    });
    // add products api
    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productsCollectioin.insertOne(product);
      res.json(result);
    });

    // app.put("/like/:id",  async (req, res) => {
    //   try {
    //     const post = await product.findByid(req.params._id);

    //     if (
    //       post.likes.filter((like) => like.user.toString() == req.user.id)
    //         .lenght > 0
    //     ) {
    //       return res.json(400).json({ msg: "post Already  lliked " });
    //     }

    //     post.likes.unshift({ user: req.user.id });
    //     await post.save();
    //     res.json(post.likes);
    //   } catch (err) {
    //     console.log(err.message);
    //     res.status(500).send("Server Errro ");
    //   }
    // });

    //

    // Product Delete by admin
    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await productsCollectioin.deleteOne(query);
      res.json(result);
    });

    // post reviews api
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await revirewsColection.insertOne(review);
      res.json(result);
    });

    // get Reviews
    app.get("/reviews", async (req, res) => {
      const cursor = revirewsColection.find({});
      const review = await cursor.toArray();
      res.send(review);
    });

    // post customar reviews
    app.post("/customerreviews", async (req, res) => {
      const cus_review = req.body;
      const customerReviewsResult = await customerReviewCollection.insertOne(
        cus_review
      );
      res.json(customerReviewsResult);
    });

    // get customer reviws

    app.get("/customerreviews", async (req, res) => {
      const cust_review = customerReviewCollection.find({});
      const customarreview = await cust_review.toArray();
      res.send(customarreview);
    });

    // Add News Section

    app.post("/news", async (req, res) => {
      const news = req.body;
      const result = await newsCollection.insertOne(news);
      res.json(result);
    });

    // get news section

    app.get("/news", async (req, res) => {
      const newscur = newsCollection.find({});
      const news = await newscur.toArray();
      res.send(news);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Bd-car is running ");
});

app.listen(port, () => {
  console.log(` listening at${port}`);
});
