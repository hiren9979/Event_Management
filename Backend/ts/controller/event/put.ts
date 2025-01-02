import { Response } from "express";
import { sendResponse } from "../../common/common";
import { updateEventDB } from "../../db/event";

export default async function eventUpdate(
  request: any,
  response: Response
) {
  return await v0(request, response);
}

async function v0(request: any, response: Response) {
  try {
    console.log('Received update request for event ID:', request.params.id);
    console.log('Update data:', request.body);

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

    // Validate required fields
    if (!request.body.name || !request.body.description || !request.body.date || !request.body.type) {
      console.error('Missing required fields');
      return sendResponse(request, response, 400, { 
        Message: "Missing required fields. Please provide name, description, date, and type." 
      });
    }

    // Validate event type
    const validTypes = ['Conference', 'Workshop', 'Meetup'];
    if (!validTypes.includes(request.body.type)) {
      console.error('Invalid event type:', request.body.type);
      return sendResponse(request, response, 400, { 
        Message: `Invalid event type. Must be one of: ${validTypes.join(', ')}` 
      });
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(request.body.date)) {
      console.error('Invalid date format:', request.body.date);
      return sendResponse(request, response, 400, { 
        Message: "Invalid date format. Use YYYY-MM-DD format." 
      });
    }

    const eventData = {
      id: eventId,
      name: request.body.name.trim(),
      description: request.body.description.trim(),
      date: request.body.date,
      type: request.body.type
    };

    console.log('Updating event:', eventData);
    const info = await updateEventDB(eventData);
    
    if (info.statusCode === 400) {
      console.error('Event not found or could not be updated');
      return sendResponse(request, response, 404, { 
        Message: "Event not found or could not be updated" 
      });
    }
    
    return sendResponse(request, response, info.statusCode, info.clientMessage);
  } catch (e) {
    console.error('Error updating event:', e);
    return sendResponse(request, response, 500, { 
      Message: "An error occurred while updating the event" 
    });
  }
}
