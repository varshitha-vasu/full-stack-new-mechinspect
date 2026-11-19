import mongoose from 'mongoose';
const inspectionSchema = new mongoose.Schema({
  component: { type: String, required: true, trim: true },
  partNo: { type: String, required: true, trim: true },
  inspector: { type: String, required: true, trim: true },
  line: { type: String, default: 'Line A' },
  date: { type: String, required: true },
  result: { type: String, enum: ['Pass', 'Fail'], required: true },
  defect: { type: String, default: '—' },
  remarks: { type: String, default: '' }
}, { timestamps: true });
export default mongoose.model('Inspection', inspectionSchema);