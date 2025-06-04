// src/appwriteConfig.js

import { Client, Account, Databases, ID } from "appwrite";

// 1️⃣ Pull these four values directly from your .env (no quotes in .env):
export const API_ENDPOINT            = import.meta.env.VITE_API_ENDPOINT;
export const PROJECT_ID              = import.meta.env.VITE_PROJECT_ID;
export const DATABASE_ID             = import.meta.env.VITE_DATABASE_ID;
export const COLLECTION_ID_MESSAGES  = import.meta.env.VITE_COLLECTION_ID_MESSAGES;

// 2️⃣ Sanity check: if these fail, Appwrite calls will break.
if (!API_ENDPOINT || !PROJECT_ID) {
  console.error(
    "❌ Appwrite environment variables are missing or invalid! " +
      "Ensure .env contains VITE_API_ENDPOINT and VITE_PROJECT_ID."
  );
}

// 3️⃣ Instantiate the Appwrite client once, using the env vars above:
const client = new Client()
  .setEndpoint(API_ENDPOINT)  // e.g. "https://fra.cloud.appwrite.io/v1"
  .setProject(PROJECT_ID);    // your 36‑character project ID

// 4️⃣ Export the Account and Databases services, plus the ID helper:
export const account   = new Account(client);
export const databases = new Databases(client);
export const IDtool    = ID;  // use IDtool.unique() for valid user IDs

// 5️⃣ If your chat logic needs the database/collection IDs elsewhere, re‑export them:
export { DATABASE_ID, COLLECTION_ID_MESSAGES };

// 6️⃣ Export the raw client if ever needed:
export default client;
