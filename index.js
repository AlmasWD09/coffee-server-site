const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000

// middleWare
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ugs5uur.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const coffeeCollection = client.db("coffeeDB").collection('coffee')
    // Get operation
    app.get('/coffees',async(req,res)=>{
      const dataBase = coffeeCollection.find();
      const result = await dataBase.toArray();
      res.send(result) 
    })

    // update for get operation
    app.get('/coffees/:id',async(req,res)=>{
      const idt = req.params.id
      const query = {_id: new ObjectId(idt)}
      const result = await coffeeCollection.findOne(query)
      res.send(result)
    })
    // update operation
    app.put('/coffees/:id', async(req,res)=>{
      const id = req.params.id
      const updateCoffee = req.body
      const query = {_id: new ObjectId(id)}
      const options = {upset:true}
      const coffee = {
        $set: {
          name:updateCoffee.name,
          quantity:updateCoffee.quantity,
          support:updateCoffee.support,
          teast:updateCoffee.teast,
          category:updateCoffee.category,
          details:updateCoffee.details,
          photo:updateCoffee.photo,
        },
      };
      const result = await coffeeCollection.updateOne(query,coffee,options)
      res.send(result)
    })

    // Post operation
    app.post('/coffees',async(req,res)=>{
      const newCoffee = req.body
      const result = await coffeeCollection.insertOne(newCoffee)
      res.send(result)
    })
    // Delete operatino
    app.delete('/coffees/:id', async(req,res)=>{
      const idt = req.params.id
      const query = {_id: new ObjectId(idt)}
      const result = await coffeeCollection.deleteOne(query)
      res.send(result)
    })
    

    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);








app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})