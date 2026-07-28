const express = require("express");
const router = express.Router();

const {
    authenticateUser,
    authorizeRoles
} = require("../middleware/authMiddleware");

const { 
  registerUser,
  loginUser,
  getCurrentUser,
 } = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authenticateUser, getCurrentUser);


router.get(
    "/admin",
    authenticateUser,
    authorizeRoles("admin"),
    (req, res) => {

        res.json({
            success: true,
            message: "Welcome Admin"
        });

    }
);


module.exports = router;