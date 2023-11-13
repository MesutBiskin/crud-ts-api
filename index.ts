//  TYPESCRIPT TE API VE MONGO DATABASE CONNECTION KURULUMU.


// 1- import packages
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from 'bcrypt';

// 2-use packages.
const app = express()
app.use(cors())
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI as string);
const db = client.db('dinos-store')
const users = db.collection('users')

client.connect();

//console.log("Connected to Mongo");

// 3-Listen on port
app.listen(process.env.PORT, () => console.log('Server is running on port 8080'));


//  4-create  a get endpoint
app.get('/', async (req, res) => {
    const allUsers = await users.find({}).toArray()
    res.status(201).send(allUsers)
});
// 5- CREATE USERS ENDPOINT
app.post('/', async (req, res) => {
    const userEmail = req.body.email
    const userPassword = req.body.password

    const hashedPassword = await bcrypt.hash(userPassword, 10);
    const userAdded = await users.insertOne({ email: userEmail, password: hashedPassword });
    res.status(201).send(userAdded)

})

// 6- create a delete endpoint by email with params
app.delete('/:_id', async (req, res) => {
    const cleanId = new ObjectId(req.params._id)
    console.log(req.params)
    const userDeleted = await users.findOneAndDelete({ _id: cleanId })
    res.send(userDeleted)
})
// 7- create a patch endpoint by _id with params

app.patch('/:_id', async (req, res) => {
    const cleanId = new ObjectId(req.params._id)
    const userUpdated = await users.findOneAndUpdate({ _id: cleanId }, { $set: req.body })
    res.send(userUpdated)
})

// 8- Log in endpoint
app.post('/login', async (req, res) => {
    const userPasword = req.body.password
    const foundUser = await users.findOne({ email: req.body.email })

    if (foundUser) {
        const passInDb = foundUser?.password
        const result = bcrypt.compare(userPasword, passInDb)
        console.log(result)

        res.send(foundUser)
    } else {
        res.json("user not found!!!!")
    }
})









