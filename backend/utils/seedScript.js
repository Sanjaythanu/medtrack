const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Equipment = require('../models/Equipment');
const Maintenance = require('../models/Maintenance');
const Alert = require('../models/Alert');
const ActivityLog = require('../models/ActivityLog');
const Department = require('../models/Department');
const Setting = require('../models/Setting');
const { departmentsData, usersData, equipmentData, settingsData } = require('./seedData');
const { runAlertEngine } = require('../services/alertEngineService');

dotenv.config({ path: __dirname + '/../.env' });

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medtrack';
    await mongoose.connect(mongoUri);
    console.log(`[Seed Script]: Connected to MongoDB at ${mongoUri}`);

    // Clear existing collections
    await Department.deleteMany({});
    await User.deleteMany({});
    await Equipment.deleteMany({});
    await Maintenance.deleteMany({});
    await Alert.deleteMany({});
    await ActivityLog.deleteMany({});
    await Setting.deleteMany({});
    console.log(`[Seed Script]: Cleared existing database collections.`);

    // 1. Insert Departments
    const createdDepts = await Department.insertMany(departmentsData);
    console.log(`[Seed Script]: Seeded ${createdDepts.length} departments.`);

    // 2. Insert Users (User.create invokes pre-save hook to hash password)
    const createdUsers = [];
    for (const userData of usersData) {
      const u = await User.create(userData);
      createdUsers.push(u);
    }
    console.log(`[Seed Script]: Seeded ${createdUsers.length} users (Admin, Technicians, Staff).`);

    const adminUser = createdUsers.find((u) => u.role === 'Admin');
    const johnTech = createdUsers.find((u) => u.email === 'tech.john@medtrack.com');
    const sarahTech = createdUsers.find((u) => u.email === 'tech.sarah@medtrack.com');

    // 3. Insert Equipment
    const createdEquipments = [];
    for (let index = 0; index < equipmentData.length; index++) {
      const eqData = { ...equipmentData[index] };
      eqData.createdBy = adminUser._id;
      eqData.assignedTechnician = index % 2 === 0 ? johnTech._id : sarahTech._id;
      const eq = await Equipment.create(eqData);
      createdEquipments.push(eq);
    }
    console.log(`[Seed Script]: Seeded ${createdEquipments.length} equipment assets.`);

    // 4. Insert Maintenance Records
    const maintenanceRecords = [
      {
        maintenanceId: 'MNT-881901',
        equipmentId: createdEquipments[0]._id, // MRI
        technicianId: johnTech._id,
        maintenanceType: 'Preventive',
        scheduledDate: new Date('2026-05-10'),
        completedDate: new Date('2026-05-10'),
        status: 'Completed',
        priority: 'High',
        estimatedCost: 3500,
        actualCost: 3200,
        notes: 'Routine quarterly cryogen system inspection and gradient coil calibration completed.',
      },
      {
        maintenanceId: 'MNT-881902',
        equipmentId: createdEquipments[1]._id, // CT
        technicianId: johnTech._id,
        maintenanceType: 'Preventive',
        scheduledDate: new Date('2026-08-03'),
        status: 'Scheduled',
        priority: 'Medium',
        estimatedCost: 2400,
        actualCost: 0,
        notes: 'Annual gantry alignment check and high-voltage generator inspection.',
      },
      {
        maintenanceId: 'MNT-881903',
        equipmentId: createdEquipments[2]._id, // Ventilator
        technicianId: sarahTech._id,
        maintenanceType: 'Corrective',
        scheduledDate: new Date('2026-07-01'),
        status: 'Overdue',
        priority: 'High',
        estimatedCost: 850,
        actualCost: 0,
        notes: 'Overdue O2 sensor membrane change and flow transducer validation.',
      },
      {
        maintenanceId: 'MNT-881904',
        equipmentId: createdEquipments[3]._id, // Defibrillator
        technicianId: sarahTech._id,
        maintenanceType: 'Emergency',
        scheduledDate: new Date('2026-05-31'),
        status: 'Overdue',
        priority: 'Critical',
        estimatedCost: 1200,
        actualCost: 0,
        notes: 'CRITICAL: Failed self-test energy discharge. Battery replacement needed immediately.',
      },
    ];

    await Maintenance.insertMany(maintenanceRecords);
    console.log(`[Seed Script]: Seeded ${maintenanceRecords.length} maintenance records.`);

    // 5. Run Alert Engine to populate dynamic Alerts
    const alertResult = await runAlertEngine();
    console.log(`[Seed Script]: Alert Engine initialized. Created ${alertResult.alertsCreated} active alerts.`);

    // 6. Insert Initial Settings
    await Setting.insertMany(settingsData);
    console.log(`[Seed Script]: Seeded system settings.`);

    // 7. Insert Activity Log
    await ActivityLog.create({
      userId: adminUser._id,
      userName: adminUser.fullName,
      userRole: adminUser.role,
      action: 'System Seeded',
      details: 'Populated database with initial hospital data, users, medical devices, and records.',
    });

    console.log(`=======================================================`);
    console.log(` MedTrack Database Seed Completed Successfully!`);
    console.log(` Admin Email: admin@medtrack.com`);
    console.log(` Admin Password: Admin@123`);
    console.log(`=======================================================`);
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Script Error]: ${error.stack || error}`);
    process.exit(1);
  }
};

seedDB();
