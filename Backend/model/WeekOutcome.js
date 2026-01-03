import mongoose from "mongoose";

const weekOutcomeItemSchema = new mongoose.Schema({
  label: { type: String, required: true },
  actual: { type: mongoose.Schema.Types.Mixed, default: null },
  completed: { type: Boolean, default: false },
});

const triggerOutcomeSchema = new mongoose.Schema({
  triggered: { type: Boolean, default: false },
  notes: { type: String, default: '' },
});

const weekOutcomeSchema = new mongoose.Schema({
  week: { type: Number, required: true, unique: true },
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'completed', 'on-track', 'at-risk', 'failed'],
    default: 'pending'
  },
  outcomes: [weekOutcomeItemSchema],
  triggerOutcomes: [triggerOutcomeSchema],
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('WeekOutcome', weekOutcomeSchema);