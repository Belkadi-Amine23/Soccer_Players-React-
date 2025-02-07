import mongoose from "mongoose";
import Player from "./models/Player.js";
import "dotenv/config";

const addNewPlayer = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const newPlayer = await Player.create({
    name: "Cristiano Ronaldo",
    age: 39,
    nationality: "Portugal",
    goals: 850
  });

  console.log("✅ Nouveau joueur ajouté :", newPlayer);
  await mongoose.disconnect();
};

addNewPlayer();
