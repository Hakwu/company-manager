import {Collection, Db, Document, MongoClient} from "mongodb";
import {ATLAS_URI} from "../config";

const connectionString = ATLAS_URI || "";

const client = new MongoClient(connectionString);
let db: Db;

async function connectToDatabase() {
    try {
        const conn = await client.connect();
        db = await conn.db("Company");
    } catch (e) {
        console.error(e);
    }
}

export { connectToDatabase, db}
