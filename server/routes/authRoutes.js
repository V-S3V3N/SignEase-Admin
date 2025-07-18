const express = require('express');
const router = express.Router();
const verifyTokenAndGetRole = require('../middleware/authMiddleware');

// Example protected route
router.post('/check-role', verifyTokenAndGetRole, (req, res) => {
  res.status(200).json({ success: true, role: req.user.role });
});


module.exports = router;