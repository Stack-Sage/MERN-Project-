import dotenv from 'dotenv'
dotenv.config({path : './.env'})
import app from './app.js'

import connectDB from './db/db_index.js'


connectDB()
.then(()=>{
   app.listen(process.env.PORT || 6000 , ()=>{
      console.log(`Server is running at Port : ${process.env.PORT}`);
      
   })
})
.catch((error)=>{
   console.log("Mongo DB connnection failed : ",error);
})

