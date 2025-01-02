import { Response } from "express";

import { userLoginDB } from "../../db/auth";
import { sendResponse } from "../../common/common";
import RESPONSES from "../../common/response";

export default async function userLogin(
  request: any,
  response: Response,
) {
  return await v0(request, response);
}

async function v0(request: any, response: Response) {
  try {
    const userData = {
      name: request.body.name,
      password: request.body.password,
    }
    const result = await userLoginDB(userData);
    return sendResponse(request, response, 200, RESPONSES.success);
  } catch (e) {
    return sendResponse(request, response, 400, { Message: e.message });
  }
}
