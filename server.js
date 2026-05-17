const express = require("express");

const app = express();
app.use(express.json());

app.post("/grievance", (req, res) => {
  console.log("Received grievance:", req.body);

  res.json({
    success: true,
    message: "Grievance received"
  });
});

app.listen(3000, () => {
  console.log("API running on port 3000");
});