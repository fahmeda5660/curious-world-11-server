const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const jwt = require('jsonwebtoken');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
// middleware
// app.use(cors());
const corsConfig = {
  origin: "*",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsConfig))
app.options("", cors(corsConfig))

app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.urfvppf.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  //   edited
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
});


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // edited


    const toyCollection = client.db('curiousWorld').collection('toys');

    //  Creating index on two fields
    // const indexKeys = { toyName: 1 }; // Replace field1 and field2 with your actual field names
    // // const indexOptions = { name: "byToyName" }; // Replace index_name with the desired index name
    // const result = await toyCollection.createIndex(indexKeys, {
    //   collation: { locale: "en", strength: 2 },
    //   partialFilterExpression: { toyName: { $exists: true } },
    //   unique: true
    // });
    // console.log(result);

    app.get("/getSearchByToyName/:text", async (req, res) => {
      const searchText = req.params.text;
      const result = await toyCollection
        .find({
          toyName: { $regex: searchText, $options: "i" },
        })
        .toArray();
      res.send(result);
    });
    app.get("/myToy/:email", async (req, res) => {
      console.log(req.params.id);
      const toys = await toyCollection
        .find({
          sellerEmail: req.params.email,
        })
        .toArray();
      res.send(toys);
    });
    app.post('/addToy', async (req, res) => {
      const addToy = req.body;
      console.log(addToy);
      const result = await toyCollection.insertOne(addToy);
      res.send(result);
    })
    //   app.get('/allToys',async(req,res)=>{
    //     const cursor = toyCollection.find();
    //     const result = await cursor.limit(2).toArray();

    //     console.log(result);
    //     res.send(result);
    // })
    app.get("/allToys", async (req, res) => {
      const cursor = toyCollection.find()
      const result = await cursor.limit(20).toArray();
      res.send(result);
    });
    app.get('/AllToys/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const result = await toyCollection.findOne(filter)
      res.send(result)
    })
    app.get('/categoryArchitect/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const result = await toyCollection.findOne(filter)
      res.send(result)
    })
    app.get('/categoryRelaxing/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const result = await toyCollection.findOne(filter)
      res.send(result)
    })
    app.get('/categoryScience/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const result = await toyCollection.findOne(filter)
      res.send(result)
    })
    app.put("/MyToys/:id", async (req, res) => {
      const id = req.params.id;
      const body = req.body;
      // console.log("hit kore",id);
      // const option = {
      //   upsert: true,
      // };
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          price: body.price,
          quantity: body.quantity,
          msg: body.msg,
        },
      };
      const result = await toyCollection.updateOne(filter, updateDoc);
      res.send(result);
    });
    app.get("/MyToys/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const result = await toyCollection.findOne(filter)
      res.send(result)
    });

    app.get("/categoryArchitect", async (req, res) => {
      const query = { category: { $eq: "Architect Lego" } };
      const cursor = toyCollection.find(query);

      const result = await cursor.toArray(query)

      res.send(result);
    });
    app.get("/categoryRelaxing", async (req, res) => {
      const query = { category: { $eq: "Relaxing lego" } };
      const cursor = toyCollection.find(query);

      const result = await cursor.toArray(query)

      res.send(result);
    });
    app.get("/categoryScience", async (req, res) => {
      const query = { category: { $eq: "Science Lego" } };
      const cursor = toyCollection.find(query);

      const result = await cursor.toArray(query)

      res.send(result);
    });
    app.get("/descending", async (req, res) => {
      const sortedToys = await toyCollection.find().sort({ price: -1 }).toArray();
      res.send(sortedToys)
  });
    app.get("/ascending", async (req, res) => {
      const sortedToys = await toyCollection.find().sort({ price: 1 }).toArray();
      res.send(sortedToys)
  });
    app.delete("/remove/:id", async (req, res) => {
      const result = await toyCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });
      console.log(result);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // commented ,edited
    // await client.close();
  }
}
run().catch(console.dir);

// create a GET route
app.get('/', (req, res) => {
  res.send({ express: 'YOUR Curious world IS CONNECTED TO REACT' });
});
// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`));