import mongoose from "mongoose";

const metricOutcomeSchema = new mongoose.Schema({
  label: { type: String, required: true },
  actual: { type: Number, default: 0 },
  metricId: { type: mongoose.Schema.Types.ObjectId, ref: 'PerformanceMetric' },
  month: { type: Number, required: true }, // 1-12
  year: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('MetricOutcome', metricOutcomeSchema);