const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    reportName: {
      type: String,
      required: true,
      trim: true,
    },
    reportType: {
      type: String,
      enum: ['Equipment', 'Maintenance', 'Department', 'Technician', 'Warranty', 'CriticalEquipment', 'Cost'],
      required: true,
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    generatedDate: {
      type: Date,
      default: Date.now,
    },
    filters: {
      type: Object,
      default: {},
    },
    summary: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Report', reportSchema);
