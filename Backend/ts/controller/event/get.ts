import { Response } from "express";

import { userLoginDB } from "../../db/auth";
import { generateV4uuid, sanitizeString } from "../../common/util";
import { sendResponse } from "../../common/common";
import { getEventsDB } from "../../db/event";

export default async function getAllEvents(
  request: any,
  response: Response,
) {
  return await v0(request, response);
}

async function v0(request: any, response: Response) {
  try {
    const result = await getEventsDB();
    return sendResponse(request, response, 200, result);
  } catch (e) {
    return sendResponse(request, response, 400, { Message: e.message });
  }
}
