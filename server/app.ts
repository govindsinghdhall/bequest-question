// import express from "express";
// import cors from "cors";

// const PORT = 8080;
// const app = express();
// const database = { data: "Hello World" };

// app.use(cors());
// app.use(express.json());

// // Routes

// app.get("/", (req, res) => {
//   res.json(database);
// });

// app.post("/", (req, res) => {
//   database.data = req.body.data;
//   res.sendStatus(200);
// });

// app.listen(PORT, () => {
//   console.log("Server running on port " + PORT);
// });
import crypto from "crypto";
import fs from "fs";
import express from "express";
import cors from "cors";

const PORT = 8080;
const app = express();

// Define database interface
interface Database {
  data: string;
  hash: string;
}

let database: Database = { data: "Hello World", hash: "" };

// File path for backup
const BACKUP_FILE = "./backup.json";

// Function to calculate hash
const calculateHash = (data: string): string => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

// Save a backup of the current data
const saveBackup = (): void => {
  fs.writeFileSync(BACKUP_FILE, JSON.stringify(database), "utf8");
};

// Restore from backup
const restoreBackup = (): void => {
  if (fs.existsSync(BACKUP_FILE)) {
    const backupData = JSON.parse(fs.readFileSync(BACKUP_FILE, "utf8")) as Database;
    database = backupData;
    console.log("Backup restored successfully.");
  } else {
    console.log("No backup file found.");
  }
};

// Update database and hash
const updateDatabase = (newData: string): void => {
  database.data = newData;
  database.hash = calculateHash(newData); // Update the hash
  saveBackup(); // Save to backup
};

// Initialize hash for initial data
updateDatabase(database.data);

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
}));

app.use(express.json());

// Route to retrieve data
app.get("/data", (req, res) => {
  const recalculatedHash = calculateHash(database.data);

  // Verify integrity
  if (recalculatedHash !== database.hash) {
    return res.status(400).json({ error: "Data integrity compromised!" });
  }

  res.json(database);
});

// Route to update data
app.post("/data", (req, res) => {
  const newData: string = req.body.data;

  // Update database and hash
  updateDatabase(newData);

  res.json({ message: "Data updated successfully", hash: database.hash });
});

// Recovery endpoint
app.get("/recover", (req, res) => {
  try {
    restoreBackup();
    res.json({ message: "Data recovered successfully", data: database });
  } catch (error) {
    res.status(500).json({ error: "Failed to recover data." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
