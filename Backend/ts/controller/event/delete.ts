import { Response } from "express";
import { sendResponse } from "../../common/common";
import { deleteEventDB } from "../../db/event";

export default async function eventDelete(
  request: any,
  response: Response
) {
  return await v0(request, response);
}

async function v0(request: any, response: Response) {
  try {
    console.log('Received delete request for event ID:', request.params.id);

    if (!request.params.id) {
      console.error('No event ID provided');
      return sendResponse(request, response, 400, { 
        Message: "Event ID is required" 
      });
    }

    const eventId = parseInt(request.params.id);
    if (isNaN(eventId)) {
      console.error('Invalid event ID:', request.params.id);
      return sendResponse(request, response, 400, { 
        Message: "Invalid event ID" 
      });
    }

    const eventData = {
      id: eventId
    };

    console.log('Deleting event:', eventData);
    const info = await deleteEventDB(eventData);
    
    if (info.statusCode === 400) {
      console.error('Event not found or could not be deleted');
      return sendResponse(request, response, 404, { 
        Message: "Event not found or could not be deleted" 
      });
    }
    
    return sendResponse(request, response, info.statusCode, info.clientMessage);
  } catch (e) {
    console.error('Error deleting event:', e);
    return sendResponse(request, response, 500, { 
      Message: "An error occurred while deleting the event" 
    });
  }
}
