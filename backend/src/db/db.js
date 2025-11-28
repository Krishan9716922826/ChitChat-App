const mongoose = require('mongoose')


const connectToDb = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database is connected successfully");
        
    } catch (error) {
        console.log(`Database is not connected`,error);
        process.exit(1);       
    }

}

module.exports = connectToDb;