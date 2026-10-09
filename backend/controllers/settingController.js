const Setting = require('../models/Setting');
const Department = require('../models/Department');

// @desc    Get all system settings and departments
// @route   GET /api/settings
// @access  Private
const getSettings = async (req, res, next) => {
  try {
    const settingsList = await Setting.find({});
    const departmentsList = await Department.find({});

    const settingsObj = {};
    settingsList.forEach((s) => {
      settingsObj[s.key] = s.value;
    });

    res.status(200).json({
      success: true,
      settings: settingsObj,
      departments: departmentsList,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update system settings
// @route   PUT /api/settings
// @access  Private (Admin)
const updateSettings = async (req, res, next) => {
  try {
    const settingsData = req.body;

    for (const [key, value] of Object.entries(settingsData)) {
      await Setting.findOneAndUpdate(
        { key },
        { key, value },
        { upsert: true, new: true }
      );
    }

    res.status(200).json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
