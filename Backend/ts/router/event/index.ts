import { Router } from "express";
import userLogin from "../../controller/user/get";
import addEvent from "../../controller/event/post";
import getAllEvents from "../../controller/event/get";
import eventUpdate from "../../controller/event/put";
import eventDelete from "../../controller/event/delete";

const router = Router();
router.post("", addEvent);
router.get("", getAllEvents);
router.put("/:id", eventUpdate);
router.delete("/:id", eventDelete);

export default router;
