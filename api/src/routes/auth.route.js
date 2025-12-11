const { Router } = require("express");
const authController = require("../controllers/auth.controller");

const {
  validarRegistro,
  validarToken,
} = require("../middlewares/auth.validator");
const validate = require("../middlewares/validate");

const { registerSchema, loginSchema } = require("../schemas/auth.schema");

const router = Router();

// Login
router.post("/login", validate(loginSchema), authController.login);

// Registro
router.post("/register",validate(registerSchema),validarRegistro,authController.register);

// Perfil del usuario autenticado
router.get("/profile", validarToken, authController.profile);

module.exports = router;
