import mongoose from "mongoose";

const performanceMetricSchema = new mongoose.Schema({
  label: { type: String, required: true },
  target: { type: Number, required: true },
  icon: { type: String, required: true },
  unit: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
});

export default mongoose.model('PerformanceMetric', performanceMetricSchema);