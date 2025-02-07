import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);

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

// Activer l'auto-incrémentation sur `id`
playerSchema.plugin(AutoIncrement, { inc_field: "id" });

export default mongoose.model("Player", playerSchema);
