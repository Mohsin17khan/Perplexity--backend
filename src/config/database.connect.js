import mongoose from 'mongoose'
import  dns from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

export function connectToDb(){
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("Database Connect Successfully...")
});
}