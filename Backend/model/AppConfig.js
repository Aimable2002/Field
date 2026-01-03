// models/AppConfig.js
import mongoose from "mongoose";

const appConfigSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  description: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('AppConfig', appConfigSchema);