/**
 * Calculates equipment status strictly based on maintenance & warranty rules
 * 
 * If Next Maintenance > 7 Days => Healthy
 * If Maintenance Due within 7 Days => Due Soon
 * If Warranty expires within 30 Days => Warranty Expiring
 * If Maintenance Date Passed => Maintenance Overdue
 * If Maintenance Overdue > 30 Days => Critical
 */
const calculateEquipmentStatus = (equipment) => {
  const now = new Date();
  const nextMaint = new Date(equipment.nextMaintenance);
  const warranty = new Date(equipment.warrantyExpiry);

  const diffMsMaint = nextMaint.getTime() - now.getTime();
  const diffDaysMaint = diffMsMaint / (1000 * 60 * 60 * 24);

  const diffMsWarranty = warranty.getTime() - now.getTime();
  const diffDaysWarranty = diffMsWarranty / (1000 * 60 * 60 * 24);

  // If maintenance date has passed
  if (diffDaysMaint < 0) {
    const overdueDays = Math.abs(diffDaysMaint);
    if (overdueDays > 30) {
      return 'Critical';
    }
    return 'Maintenance Overdue';
  }

  // Maintenance due within 7 days
  if (diffDaysMaint >= 0 && diffDaysMaint <= 7) {
    return 'Due Soon';
  }

  // Warranty expires within 30 days
  if (diffDaysWarranty >= 0 && diffDaysWarranty <= 30) {
    return 'Warranty Expiring';
  }

  return 'Healthy';
};

module.exports = { calculateEquipmentStatus };
