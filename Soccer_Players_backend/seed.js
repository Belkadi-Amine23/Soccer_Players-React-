import "dotenv/config";
import mongoose from "mongoose";
import Player from "./models/Player.js";
import { faker } from "@faker-js/faker";

const nationalities = [
  "Brazil", "Argentina", "France", "Germany", "Spain",
  "Italy", "Portugal", "England", "Netherlands", "Belgium"
];

const generatePlayer = () => ({
  name: faker.person.fullName(),
  age: faker.number.int({ min: 18, max: 40 }),
  nationality: faker.helpers.arrayElement(nationalities),
  goals: faker.number.int({ min: 0, max: 500 })
});

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB for seeding...");

    // Trouver le dernier ID existant
    const lastPlayer = await Player.findOne().sort({ id: -1 }).select("id");
    const startId = lastPlayer ? lastPlayer.id + 1 : 1;
    console.log(`🔢 Starting ID: ${startId}`);

    // Réinitialisation de la collection
    await Player.deleteMany({});
    console.log("🗑️ Collection 'players' vidée.");

    // Réinitialiser le compteur auto-incrémenté
    await mongoose.connection.db.collection("counters").deleteOne({ _id: "id" });
    console.log("🔄 Compteur auto-incrémenté réinitialisé.");

    // Générer 100 joueurs
    const players = Array.from({ length: 100 }, generatePlayer);

    // Insérer chaque joueur avec `create()` pour que `id` soit bien auto-incrémenté
    await Player.create(players);
    console.log("✅ 100 players inserted successfully!");

  } catch (error) {
    console.error("❌ Error during seeding:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB.");
    process.exit();
  }
};

seedDatabase();
