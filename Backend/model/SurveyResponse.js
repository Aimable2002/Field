import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  questionText: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['text', 'select', 'rating'], 
    required: true 
  },
  answer: { type: String, required: true },
});

const surveyResponseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employeeName: { type: String, required: true },
  teamName: { type: String, required: true },
  date: { 
    type: String, 
    required: true,
    default: () => new Date().toISOString().split('T')[0] // Default to today's date
  },
  time: { 
    type: String, 
    required: true,
    default: () => new Date().toLocaleTimeString('en-US', { hour12: true }) // Default to current time
  },
  businessName: { type: String, required: true },
  businessLocation: { type: String },
  contactName: { type: String, required: true },
  contactTitle: { type: String },
  contactEmail: { type: String },
  answers: [answerSchema],
  interestRating: { type: Number, min: 1, max: 5, required: true },
  overallRating: { type: Number, min: 1, max: 5 },
  canFollowUp: { type: Boolean, default: false },
  preferredContact: { type: String, enum: ['call', 'whatsapp', 'email', null] },
  contactNumber: { type: String },
  employeeRemarks: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('SurveyResponse', surveyResponseSchema);