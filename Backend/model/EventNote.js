// models/EventNote.js
import mongoose from "mongoose";

const eventNoteSchema = new mongoose.Schema({
  week: { type: Number, required: true },
  type: { 
    type: String, 
    enum: ['field-visit', 'meeting', 'campaign', 'feedback'],
    required: true 
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  outcome: { 
    type: String, 
    enum: ['positive', 'neutral', 'negative'],
    default: 'neutral'
  },
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('EventNote', eventNoteSchema);