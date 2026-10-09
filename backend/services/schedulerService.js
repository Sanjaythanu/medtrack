const cron = require('node-cron');
const { runAlertEngine } = require('./alertEngineService');

const initScheduler = () => {
  // Schedule automated background job every day at 12:00 AM ('0 0 * * *')
  cron.schedule('0 0 * * *', async () => {
    console.log(`[Cron Scheduler]: Running daily 12:00 AM Equipment Status & Alert Engine scan...`);
    const result = await runAlertEngine();
    console.log(`[Cron Scheduler]: Scan completed. Created ${result.alertsCreated || 0} alerts.`);
  });

  console.log(`[Cron Scheduler]: Automated daily 12:00 AM background job initialized.`);
};

module.exports = { initScheduler };
