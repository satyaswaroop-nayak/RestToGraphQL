import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone'
import fetch from "node-fetch"
import { initializeApp } from "firebase/app";
import {getFirestore, collection, getDocs, addDoc, doc, getDoc} from 'firebase/firestore'
import {typeDefs} from "./schema.js"

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
let db = {}

async function getData(mData) {
    let dbT = {}
    let count = 0
    for(const key in mData) {
        if(key !== 'metadata') {
            const response = await fetch(mData[key], {
                method: 'GET'
            });
            dbT[key] = await response.json()
        }
    }
    return await dbT
}

function createResolvers(mData) {
    let queryBod = {}
    let resolversT = {}
    for(const key in mData) {
        if(key !== 'metadata')
        queryBod[key] = eval(`()=>{return db.${key}}`)
    }

    resolversT["Query"] = queryBod
    
    return resolversT
}

try {
    console.error("received doc Id: ", process.argv[3])
    const querySnapshot = await getDoc(doc(dbF, "metadatas", process.argv[3]));

    let mData = querySnapshot.data();
    console.error(mData);

    db = await getData(mData)
    // console.error(db)
    const resolvers = createResolvers(mData)

    // console.error(db)

    
    // Server setup
    const server = new ApolloServer({
        typeDefs,   
        resolvers 
    })

    // Start server
    const {url} = await startStandaloneServer(server, {
        listen: {port: process.argv[2]}
    })
    
} catch(err) {
    console.error(err)
}








