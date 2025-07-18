const { admin, db } = require("../config/firebase");

const checkAdmin = async (req, res, next) => {
  console.log("🔐 Middleware hit");
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No or invalid Authorization header");
    return res.status(401).json({ error: "Unauthorized" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    console.log("Decoded UID:", uid);

    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) {
      console.log("User doc not found in Firestore");
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }

    const role = userDoc.data().role;
    console.log("User role:", role);

    if (role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }

    req.user = { uid, role };
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = checkAdmin;