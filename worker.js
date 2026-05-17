require('dotenv').config();

const { Camunda8 } = require('@camunda8/sdk');

const c8 = new Camunda8({
  CAMUNDA_OAUTH_URL: process.env.CAMUNDA_OAUTH_URL,
  ZEEBE_ADDRESS: process.env.ZEEBE_ADDRESS,
  ZEEBE_CLIENT_ID: process.env.ZEEBE_CLIENT_ID,
  ZEEBE_CLIENT_SECRET: process.env.ZEEBE_CLIENT_SECRET,
});

const zeebe = c8.getZeebeGrpcApiClient();

console.log('🚀 Worker started...');

zeebe.createWorker({
  taskType: 'assign-driver',

  taskHandler: async (job) => {

    console.log('📦 Assigning driver...');
    console.log(job.variables);

    await new Promise(resolve =>
      setTimeout(resolve, 3000)
    );

    console.log('✅ Driver assigned');

    await job.complete({
      driverAssigned: true,
      driverName: 'Rahul'
    });
  }
});

zeebe.createWorker({
    taskType: 'notify-customer',
  
    taskHandler: async (job) => {
  
      console.log('📲 Notifying customer...');
  
      await job.complete({
        customerNotified: true
      });
    }
  });