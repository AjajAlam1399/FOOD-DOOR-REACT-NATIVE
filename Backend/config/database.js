import mongoose from "mongoose";

export const connectDataBase = async () => {
  const { connection } = await mongoose.connect(`${process.env.MONGODB_URI}`);
  console.log(`Database has been connected Sucessfully`);
};
