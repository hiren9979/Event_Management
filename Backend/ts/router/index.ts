import { Router } from "express";
import auth from "./auth";
import event from "./event";

export const router = Router();

router.use("/login", auth);
router.use("/event", event);