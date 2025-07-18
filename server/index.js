// index.js or app.js (your backend entry point)
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes"); // <-- make sure the path is correct

const app = express();

app.use(cors());
app.use(express.json());

// Mount all your auth routes under /api
app.use("/api", authRoutes); // <--- This makes /api/check-role available

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
