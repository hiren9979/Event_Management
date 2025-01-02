import { execute } from "../common/common";
import RESPONSES from "../common/response";

export async function userLoginDB(
  userData: any
): Promise<boolean | []> {
  try {
    if (userData.name === 'admin' && userData.password === 'admin@123') {
      return true;
    }
    return false;
  } catch (e) {
    return [];
  }
}

export async function addActualDB(data: any) {
  try {
    let query = `INSERT INTO actual (id, workspaceId, wellnessId, value, date, createdBy) VALUES (?, ?, ?, ?, ?, ?);`;
    let result = await execute(query, [
      data.id,
      data.workspaceId,
      data.wellnessId,
      data.value,
      data.date,
      data.createdBy,
    ]);
    if (result.affectedRows === 0) {
      return RESPONSES.badRequest;
    }
    return RESPONSES.success;
  } catch (e) {
    return RESPONSES.tryAgain;
  }
}

export async function updateActualDB(data: any) {
  try {
    let query = `UPDATE actual SET wellnessId = ?, value = ?, date = ?, lastUpdatedBy = ?, updatedAt = ? WHERE id = ? AND workspaceId = ? AND isDeleted = false;`;
    let result = await execute(query, [
      data.wellnessId,
      data.value,
      data.lastUpdatedBy,
      data.updatedAt,
      data.id,
      data.workspaceId,
    ]);
    if (result.changedRows === 0 && result.affectedRows === 0) {
      return RESPONSES.badRequest;
    }
    return RESPONSES.success;
  } catch (e) {
    return RESPONSES.tryAgain;
  }
}

export async function deleteActualDB(data: any) {
  try {
    let query = `UPDATE actual SET isDeleted = ?, deletedBy = ?, deletedAt = ? WHERE id = ? AND workspaceId = ? AND isDeleted = false;`;
    let result = await execute(query, [
      data.isDeleted,
      data.deletedBy,
      data.deletedAt,
      data.id,
      data.workspaceId,
    ]);
    if (result.changedRows === 0 && result.affectedRows === 0) {
      return RESPONSES.badRequest;
    }
    return RESPONSES.success;
  } catch (e) {
    return RESPONSES.tryAgain;
  }
}
