const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    equipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment',
      required: true,
    },
    alertType: {
      type: String,
      enum: ['Maintenance Due', 'Warranty Expiring', 'Critical Equipment', 'Overdue Maintenance', 'Inactive Equipment'],
      required: true,
    },
    alertMessage: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ['Info', 'Warning', 'High', 'Critical'],
      default: 'Warning',
    },
    status: {
      type: String,
      enum: ['Active', 'Resolved', 'Dismissed'],
      default: 'Active',
    },
    generatedDate: {
      type: Date,
      default: Date.now,
    },
    readStatus: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Alert', alertSchema);
