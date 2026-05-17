require('dotenv').config();

const { Camunda8 } = require("@camunda8/sdk");
const axios = require("axios");

const c8 = new Camunda8({
  CAMUNDA_OAUTH_URL: process.env.CAMUNDA_OAUTH_URL,
  ZEEBE_ADDRESS: process.env.ZEEBE_ADDRESS,
  ZEEBE_CLIENT_ID: process.env.ZEEBE_CLIENT_ID,
  ZEEBE_CLIENT_SECRET: process.env.ZEEBE_CLIENT_SECRET,
});

const zeebe = c8.getZeebeGrpcApiClient();

console.log("🚀 Report Portal Worker Started...");

zeebe.createWorker({
  taskType: "report-to-portal",

  taskHandler: async (job) => {

    console.log("📨 Reporting grievance...");
    console.log(job.variables);

    try {

      const response = await axios.post(
        "http://localhost:3000/grievance",
        {
          orderId: job.variables.orderId,
          customerName: job.variables.customerName,
          issue: "Delivery Failed",
          deliveryFee: job.variables.deliveryFee
        }
      );

      console.log("✅ API Response:");
      console.log(response.data);

      await job.complete({
        grievanceReported: true
      });

    } catch (error) {

      console.log("❌ API Failed");
      console.log(error.message);

      await job.fail("API failed");
    }
  }
});