import { response } from "express";
import { execute, sendResponse } from "../common/common";
import RESPONSES from "../common/response";

export async function getEventsDB(): Promise<any> {
  try {
    const query = `SELECT * FROM event;`
    const result = await execute(query, []);
    return result;
  } catch (e) {
    console.error('Error getting events:', e);
    throw e; // Propagate error up
  }
}

export async function addEventDB(data: any) {
  try {
    console.log('Adding event to database:', data);
    
    // Validate data types
    if (typeof data.name !== 'string' || typeof data.description !== 'string' || 
        !data.date || !['Conference', 'Workshop', 'Meetup'].includes(data.type)) {
      console.error('Invalid data types:', data);
      return RESPONSES.badRequest;
    }

    let query = `INSERT INTO event (name, description, date, type) VALUES (?, ?, ?, ?);`;
    let params = [
      data.name,
      data.description,
      data.date,
      data.type,
    ];
    
    console.log('Executing query:', query, 'with params:', params);
    let result = await execute(query, params);
    console.log('Database result:', result);
    
    if (!result || result.affectedRows === 0) {
      console.error('No rows affected');
      return RESPONSES.badRequest;
    }
    return RESPONSES.success;
  } catch (e) {
    console.error('Database error in addEventDB:', e);
    throw e; // Propagate error up
  }
}

export async function updateEventDB(data: any) {
  try {
    console.log('Updating event in database:', data);
    
    // Validate data types
    if (typeof data.name !== 'string' || typeof data.description !== 'string' || 
        !data.date || !['Conference', 'Workshop', 'Meetup'].includes(data.type) || 
        typeof data.id !== 'number') {
      console.error('Invalid data types:', data);
      return RESPONSES.badRequest;
    }

    let query = `UPDATE event SET name = ?, description = ?, date = ?, type = ? WHERE id = ?;`;
    let params = [
      data.name,
      data.description,
      data.date,
      data.type,
      data.id,
    ];
    
    console.log('Executing query:', query, 'with params:', params);
    let result = await execute(query, params);
    console.log('Database result:', result);
    
    if (!result || result.changedRows === 0 && result.affectedRows === 0) {
      console.error('No rows affected');
      return RESPONSES.badRequest;
    }
    return RESPONSES.success;
  } catch (e) {
    console.error('Database error in updateEventDB:', e);
    throw e; // Propagate error up
  }
}

export async function deleteEventDB(data: any) {
  try {
    console.log('Deleting event from database:', data);
    
    // Validate data types
    if (typeof data.id !== 'number') {
      console.error('Invalid data types:', data);
      return RESPONSES.badRequest;
    }

    let query = `DELETE FROM event WHERE id = ?;`;
    let params = [
      data.id,
    ];
    
    console.log('Executing query:', query, 'with params:', params);
    let result = await execute(query, params);
    console.log('Database result:', result);
    
    if (!result || result.affectedRows === 0) {
      console.error('No rows affected');
      return RESPONSES.badRequest;
    }
    return RESPONSES.success;
  } catch (e) {
    console.error('Database error in deleteEventDB:', e);
    throw e; // Propagate error up
  }
}
