const { Router } = require("express");
const router = Router();

const authController = require("../controllers/auth.controller");
const { validarRegistro, validarToken } = require("../middlewares/auth.validator");

router.post("/login", authController.login);
router.post("/register", validarRegistro, authController.register);
router.get("/profile", validarToken, authController.profile);

module.exports = router;
