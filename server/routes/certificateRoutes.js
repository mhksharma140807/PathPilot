const express = require("express");
const {
  issueOrClaimCertificate,
  getMyCertificates,
  verifyCertificate,
} = require("../controllers/certificateController");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

// Public endpoint for verifying certificates
router.get("/verify/:certificateId", verifyCertificate);

// Protected student endpoints
router.post("/claim", authenticateUser, issueOrClaimCertificate);
router.get("/my-certificates", authenticateUser, getMyCertificates);

module.exports = router;
