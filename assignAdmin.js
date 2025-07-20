const admin = require("firebase-admin");

// Initialize Firebase Admin SDK (reuse your credentials here)
const serviceAccount = require("./server/serviceAccountKey.json"); // your Firebase private key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Your admin's UID (get from Firebase Auth console)
const adminUID = "gyFOwXW0WJXDnYe0pEd0iVOFIYh2";

admin
  .auth()
  .setCustomUserClaims(adminUID, { admin: true })
  .then(() => {
    console.log(`✅ Custom claim 'admin' set for UID: ${adminUID}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error setting custom claim:", error);
    process.exit(1);
  });
