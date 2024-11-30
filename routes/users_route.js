const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users_controller");

router.get("/", usersController.getAllUsers);
router.post("/", usersController.registerNewUser);
router.get("/:user_id", usersController.getUserById);
router.put("/:user_id", usersController.updateUserById);
router.delete("/:user_id", usersController.deleteUserById);

module.exports = router;