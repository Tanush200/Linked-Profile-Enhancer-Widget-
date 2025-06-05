const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const sampleData = {
  "Tanush Saha": {
    companyName: "Tanush Saha",
    matchScore: 86,
    accountStatus: "Target",
  },
  AlphaTech: {
    companyName: "AlphaTech",
    matchScore: 90,
    accountStatus: "Target",
  },
};

app.get("/api/match", (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: "Missing 'name' query parameter" });
  }

  // Simulate searching by company name (case-insensitive)
  const companyKey = Object.keys(sampleData).find(
    (key) => key.toLowerCase() === name.toLowerCase()
  );

  if (companyKey) {
    return res.json(sampleData[companyKey]);
  } else {
    // Return default data if not found
    return res.json({
      companyName: name,
      matchScore: 50,
      accountStatus: "Unknown",
    });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
