import { Client } from "pg"

const client = new Client({
  host: 'localhost',
  port: 5433,            
  user: 'gaPunyaNama',   
  password: 'masihGapunyaNama', 
  database: 'dbGapunyanama',  
});

client.connect();

export default client;
