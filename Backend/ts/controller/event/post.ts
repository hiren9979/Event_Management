import { Response } from "express";
import { sendResponse } from "../../common/common";
import { addEventDB } from "../../db/event";

export default async function addEvent(
  request: any,
  response: Response
) {
  return await v0(request, response);
}

async function v0(request: any, response: Response) {
  try {
    console.log('Received event data:', request.body);

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
      name: request.body.name.trim(),
      description: request.body.description.trim(),
      date: request.body.date,
      type: request.body.type
    };

    console.log('Processing event data:', eventData);
    const info = await addEventDB(eventData);
    
    if (info.statusCode === 400) {
      console.error('Bad request response from database');
      return sendResponse(request, response, 400, { 
        Message: "Failed to create event. Please check your input." 
      });
    }
    
    return sendResponse(request, response, info.statusCode, info.clientMessage);
  } catch (e) {
    console.error('Error in event creation:', e);
    // Check if it's a database connection error
    if (e.code === 'ECONNREFUSED') {
      return sendResponse(request, response, 503, { 
        Message: "Database connection failed. Please try again later." 
      });
    }
    // Check for duplicate entry
    if (e.code === 'ER_DUP_ENTRY') {
      return sendResponse(request, response, 400, { 
        Message: "An event with this name already exists." 
      });
    }
    return sendResponse(request, response, 500, { 
      Message: "An error occurred while creating the event." 
    });
  }
}
