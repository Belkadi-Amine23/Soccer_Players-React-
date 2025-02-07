import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    nationality: { type: String, required: true },
    goals: { type: Number, required: true }
  },
  { timestamps: true }
);

// Avant de sauvegarder un joueur, trouver le plus grand ID existant
playerSchema.pre("save", async function (next) {
  if (!this.id) {
    const lastPlayer = await mongoose.model("Player").findOne({}, {}, { sort: { id: -1 } });
    this.id = lastPlayer ? lastPlayer.id + 1 : 1;
  }
  next();
});

export default mongoose.model("Player", playerSchema);
