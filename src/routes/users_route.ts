import express from "express";
import { Request, Response } from "express";
const router = express.Router();
import * as usersController from "../controllers/users_controller";

router.get("/", usersController.getAllUsers)
router.post("/", usersController.registerNewUser);
router.post("/login", usersController.login);
router.post("/logout", usersController.logout);

export default router;
