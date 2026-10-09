const Equipment = require('../models/Equipment');
const Alert = require('../models/Alert');
const { calculateEquipmentStatus } = require('./statusCalculationService');

const runAlertEngine = async () => {
  try {
    const equipments = await Equipment.find({});
    let alertsCreated = 0;

    for (const eq of equipments) {
      const calculatedStatus = calculateEquipmentStatus(eq);
      
      // Update equipment status in DB if calculated status differs
      if (eq.equipmentStatus !== calculatedStatus && eq.equipmentStatus !== 'Under Repair' && eq.equipmentStatus !== 'Retired') {
        eq.equipmentStatus = calculatedStatus;
        await eq.save();
      }

      // Check Maintenance Due Soon
      if (calculatedStatus === 'Due Soon') {
        const existingAlert = await Alert.findOne({
          equipmentId: eq._id,
          alertType: 'Maintenance Due',
          status: 'Active',
        });
        if (!existingAlert) {
          await Alert.create({
            equipmentId: eq._id,
            alertType: 'Maintenance Due',
            alertMessage: `Equipment '${eq.equipmentName}' (${eq.assetId}) is due for maintenance on ${new Date(eq.nextMaintenance).toLocaleDateString()}.`,
            severity: 'Warning',
            status: 'Active',
          });
          alertsCreated++;
        }
      }

      // Check Overdue Maintenance
      if (calculatedStatus === 'Maintenance Overdue') {
        const existingAlert = await Alert.findOne({
          equipmentId: eq._id,
          alertType: 'Overdue Maintenance',
          status: 'Active',
        });
        if (!existingAlert) {
          await Alert.create({
            equipmentId: eq._id,
            alertType: 'Overdue Maintenance',
            alertMessage: `Maintenance for '${eq.equipmentName}' (${eq.assetId}) is OVERDUE! Scheduled date was ${new Date(eq.nextMaintenance).toLocaleDateString()}.`,
            severity: 'High',
            status: 'Active',
          });
          alertsCreated++;
        }
      }

      // Check Critical Equipment (> 30 days overdue)
      if (calculatedStatus === 'Critical') {
        const existingAlert = await Alert.findOne({
          equipmentId: eq._id,
          alertType: 'Critical Equipment',
          status: 'Active',
        });
        if (!existingAlert) {
          await Alert.create({
            equipmentId: eq._id,
            alertType: 'Critical Equipment',
            alertMessage: `CRITICAL ALERT: '${eq.equipmentName}' (${eq.assetId}) maintenance is over 30 days overdue! Immediate action required.`,
            severity: 'Critical',
            status: 'Active',
          });
          alertsCreated++;
        }
      }

      // Check Warranty Expiring
      if (calculatedStatus === 'Warranty Expiring') {
        const existingAlert = await Alert.findOne({
          equipmentId: eq._id,
          alertType: 'Warranty Expiring',
          status: 'Active',
        });
        if (!existingAlert) {
          await Alert.create({
            equipmentId: eq._id,
            alertType: 'Warranty Expiring',
            alertMessage: `Warranty for '${eq.equipmentName}' (${eq.assetId}) expires on ${new Date(eq.warrantyExpiry).toLocaleDateString()}.`,
            severity: 'Warning',
            status: 'Active',
          });
          alertsCreated++;
        }
      }
    }

    return { success: true, alertsCreated };
  } catch (error) {
    console.error(`[Alert Engine Error]: ${error.message}`);
    return { success: false, error: error.message };
  }
};

module.exports = { runAlertEngine };
