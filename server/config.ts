import dotenv from "dotenv";

dotenv.config();

const { PORT, ATLAS_URI, JWT_SECRET, GOOGLE_CLIENT_SECRET, GOOGLE_CLIENT_ID } = process.env;

export { PORT, ATLAS_URI, JWT_SECRET, GOOGLE_CLIENT_SECRET, GOOGLE_CLIENT_ID };
