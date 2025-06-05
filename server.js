// const express = require("express");
// const cors = require("cors");

// const app = express();
// app.use(cors());
// app.use(express.json());

// const sampleData = {
//   "Tanush Saha": {
//     companyName: "Tanush Saha",
//     matchScore: 86,
//     accountStatus: "Target",
//   },
//   "Biswarup Sou": {
//     companyName: "AlphaTech",
//     matchScore: 90,
//     accountStatus: "Not Target",
//   },
//   "Saswata Chakraborty": {
//     companyName: "BizSolution",
//     matchScore: 100,
//     accountStatus: "Target",
//   },
// };

// app.get("/api/match", (req, res) => {
//   const { name } = req.query;
//   if (!name) {
//     return res.status(400).json({ error: "Missing 'name' query parameter" });
//   }

//   const companyKey = Object.keys(sampleData).find(
//     (key) => key.toLowerCase() === name.toLowerCase()
//   );

//   if (companyKey) {
//     return res.json(sampleData[companyKey]);
//   } else {
//     return res.json({
//       companyName: name,
//       matchScore: 50,
//       accountStatus: "Unknown",
//     });
//   }
// });

// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`API server running on http://localhost:${PORT}`);
// });


const express = require("express");
const cors = require("cors");

const app = express();


app.use(cors());
app.use(express.json());


const profileDatabase = {
  "Tanush Saha": {
    companyName: "Tanush Tech Solutions",
    matchScore: 86,
    accountStatus: "Target",
    lastContacted: "2023-05-15",
    priority: "High",
  },
  "Biswarup Sou": {
    companyName: "AlphaTech Innovations",
    matchScore: 90,
    accountStatus: "Not Target",
    lastContacted: "2023-06-20",
    priority: "Medium",
  },
  "Saswata Chakraborty": {
    companyName: "BizSolution Partners",
    matchScore: 100,
    accountStatus: "Target",
    lastContacted: "2023-04-10",
    priority: "Critical",
  },
};


const findProfile = (name) => {
  const lowerName = name.toLowerCase();
  return Object.keys(profileDatabase).find((key) =>
    key.toLowerCase().includes(lowerName)
  );
};


app.get("/api/match", (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        error: "Name parameter is required",
        example: "/api/match?name=Tanush+Saha",
      });
    }

    const profileKey = findProfile(name);

    if (profileKey) {
      return res.json({
        success: true,
        ...profileDatabase[profileKey],
        fullMatch: profileKey.toLowerCase() === name.toLowerCase(),
      });
    }

   
    res.status(404).json({
      success: false,
      message: "Profile not found",
      suggestedActions: [
        "Check spelling",
        "Try partial name matching",
        "Contact admin to add profile",
      ],
    });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});


app.post("/api/profiles", (req, res) => {
  try {
    const { names } = req.body;

    if (!names || !Array.isArray(names)) {
      return res.status(400).json({
        error: "Array of names required in request body",
      });
    }

    const results = names.map((name) => {
      const profileKey = findProfile(name);
      return {
        searchName: name,
        found: !!profileKey,
        data: profileKey ? profileDatabase[profileKey] : null,
      };
    });

    res.json({ results });
  } catch (error) {
    res.status(500).json({
      error: "Bulk processing failed",
      details: error.message,
    });
  }
});


app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    databaseEntries: Object.keys(profileDatabase).length,
  });
});


app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Unexpected server error",
    requestId: req.id,
  });
});


const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`
  🚀 Server running at http://${HOST}:${PORT}
  📊 Endpoints:
     - GET    /api/match?name={name}
     - POST   /api/profiles
     - GET    /health
  `);
});


process.on("SIGTERM", () => {
  console.log("Shutting down gracefully...");
  server.close(() => {
    console.log("Server terminated");
  });
});