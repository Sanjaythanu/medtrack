const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema(
  {
    assetId: {
      type: String,
      required: [true, 'Asset ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    equipmentName: {
      type: String,
      required: [true, 'Equipment name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    manufacturer: {
      type: String,
      required: [true, 'Manufacturer is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Model designation is required'],
      trim: true,
    },
    serialNumber: {
      type: String,
      required: [true, 'Serial number is required'],
      unique: true,
      trim: true,
    },
    purchaseDate: {
      type: Date,
      required: [true, 'Purchase date is required'],
    },
    installationDate: {
      type: Date,
      default: Date.now,
    },
    warrantyExpiry: {
      type: Date,
      required: [true, 'Warranty expiration date is required'],
    },
    vendorName: {
      type: String,
      default: 'Authorized Medical Supplier',
      trim: true,
    },
    purchaseCost: {
      type: Number,
      required: [true, 'Purchase cost is required'],
      min: 0,
    },
    serviceInterval: {
      type: Number,
      default: 90, // days
      min: 1,
    },
    lastMaintenance: {
      type: Date,
      default: null,
    },
    nextMaintenance: {
      type: Date,
      required: [true, 'Next maintenance date is required'],
    },
    equipmentStatus: {
      type: String,
      enum: ['Healthy', 'Due Soon', 'Warranty Expiring', 'Maintenance Overdue', 'Critical', 'Under Repair', 'Retired'],
      default: 'Healthy',
    },
    location: {
      type: String,
      required: [true, 'Location within facility is required'],
      trim: true,
    },
    assignedTechnician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    equipmentImage: {
      type: String,
      default: '',
    },
    remarks: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Search Index
equipmentSchema.index({ equipmentName: 'text', assetId: 'text', serialNumber: 'text', manufacturer: 'text' });

module.exports = mongoose.model('Equipment', equipmentSchema);
