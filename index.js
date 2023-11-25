import express, { query } from 'express'
import {spawn} from 'child_process'
import bodyParser from 'body-parser'
import fetch from "node-fetch"
import { initializeApp } from "firebase/app";
import {getFirestore, collection, getDocs, addDoc} from 'firebase/firestore'
import fs from 'fs'

const app = express();
const portF = 3555;

const firebaseConfig = {
  apiKey: "AIzaSyBz5YzxwQnr01OGwf-w3dBSKgeCPGHgLu4",
  authDomain: "restapitographql.firebaseapp.com",
  projectId: "restapitographql",
  storageBucket: "restapitographql.appspot.com",
  messagingSenderId: "185082034051",
  appId: "1:185082034051:web:3483e19043fb58ab2628b6"
};
initializeApp(firebaseConfig)
const dbF = getFirestore();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);



app.get('/create', async (req, res) => {
    let body = req.body
    // metadata.db = await getData(req.body)

    // metadata.schema = req.body.metadata.schema

    

    // console.log(db)


    //Upload to firebase
    let docRef = undefined
    try {
        docRef = await addDoc(collection(dbF, "metadatas"), req.body);
        console.error("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }

    var access = fs.createWriteStream("./schema.js");
    process.stdout.write = access.write.bind(access);

    console.log(body.metadata.schema)
    
    
    // Generate a unique port for the new server
    const newServerPort = 4000 + Math.floor(Math.random() * 1000);

    // Create a new child process for the dynamically generated server
    const newServer = spawn('node', ['./dynamic_server.js', newServerPort.toString(), docRef.id]);

    // Handle the new server's stdout and stderr
    // newServer.stdout.on('data', (data) => {
    //     console.log(`New Server stdout: ${data}`);
    // });

    newServer.stderr.on('data', (data) => {
        console.error(`New Server stderr: ${data}`);
    });

    // Send a response to the client
    res.send(`New apollo server created on port ${newServerPort}`);
});

app.listen(portF, () => {
    console.error(`Main server is running at http://localhost:${portF}`);
});
