import mongoose from "mongoose";

// Connect to MongoDB
// Ensure you have a mongo instance running (e.g. via docker)
const mongoUri = "mongodb://localhost:27017/deno_app";

try {
  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");

  // Define Schema
  const kittySchema = new mongoose.Schema({
    name: String,
    hobbies: [String]
  });

  // Create Model
  // Using 'any' here to avoid complex TS typing for this simple demo, 
  // but in production you should define an interface.
  const Kitten = mongoose.model("Kitten", kittySchema);

  // Create document
  const silence = new Kitten({ name: "Silence", hobbies: ["sleeping", "purring"] });
  await silence.save();
  console.log("Saved kitten:", silence);

  // Find documents
  const kittens = await Kitten.find();
  console.log("All kittens:", kittens);

} catch (e) {
  console.error("Mongo Error:", e);
} finally {
  await mongoose.disconnect();
}
