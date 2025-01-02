import { Router } from "express";
import userLogin from "../../controller/user/get";

const router = Router();
router.post("", userLogin);

export default router;
