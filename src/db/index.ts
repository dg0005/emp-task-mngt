import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

const connect = async()=>{
  try {
    if(!uri) {
      throw new Error('URI not found');
    }
    await mongoose.connect(uri);
  } catch (error) {
    process.exit(1); // Exit the process with an error code
  }
}

  export default connect;