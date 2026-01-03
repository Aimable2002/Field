import mongoose from "mongoose";

const weekTargetSchema = new mongoose.Schema({
  label: { type: String, required: true },
  target: { type: mongoose.Schema.Types.Mixed, required: true }, // Can be number or string
});

const decisionTriggerSchema = new mongoose.Schema({
  condition: { type: String, required: true },
  action: { type: String, required: true },
});

const weekConfigSchema = new mongoose.Schema({
  week: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  focus: { type: String, required: true },
  targets: [weekTargetSchema],
  actions: [String],
  decisionTriggers: [decisionTriggerSchema],
  isActive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('WeekConfig', weekConfigSchema);