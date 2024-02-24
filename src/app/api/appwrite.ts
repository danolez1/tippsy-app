import { Account, Client, Databases } from "appwrite";

const client = new Client();
client
  .setEndpoint(process.env.APPWRITE_ENDPOINT!)
  .setProject(process.env.APPWRITE_PROJECT_ID!);

export const account = new Account(client);
export const databases = new Databases(client);
export const appDb = process.env.APPWRITE_PROJECT_DB!;

export interface Slug {
  params: { [k: string]: string };
}
