import { apiClient } from "../../lib/apiClient";

import type {
  PatrolScheduleAssignment,
  CreateScheduleAssignmentPayload,
  BulkAssignUserPayload,
  BulkAssignUserResponse,
  DeleteScheduleAssignmentResponse,
} from "../../types/schedule/schedule-assignment";

// Menambahkan satu petugas ke schedule
export const createScheduleAssignment = async (
  scheduleId: string,
  payload: CreateScheduleAssignmentPayload,
): Promise<PatrolScheduleAssignment> => {
  const response = await apiClient.post<PatrolScheduleAssignment>(
    `/patrol-schedules/${scheduleId}/assignments/assign`,
    payload,
  );

  return response.data;
};

// Menambahkan beberapa assignment sekaligus untuk satu petugas
export const bulkAssignUser = async (
  scheduleId: string,
  payload: BulkAssignUserPayload,
): Promise<BulkAssignUserResponse> => {
  const response = await apiClient.post<BulkAssignUserResponse>(
    `/patrol-schedules/${scheduleId}/assignments/assignments/bulk`,
    payload,
  );

  return response.data;
};

// Mengambil seluruh assignment dalam schedule
export const getScheduleAssignments = async (
  scheduleId: string,
): Promise<PatrolScheduleAssignment[]> => {
  const response = await apiClient.get<PatrolScheduleAssignment[]>(
    `/patrol-schedules/${scheduleId}/assignments`,
  );

  return response.data;
};

// Menghapus assignment dari schedule
export const deleteScheduleAssignment = async (
  scheduleId: string,
  assignmentId: string,
): Promise<DeleteScheduleAssignmentResponse> => {
  const response = await apiClient.delete<DeleteScheduleAssignmentResponse>(
    `/patrol-schedules/${scheduleId}/assignments/${assignmentId}`,
  );

  return response.data;
};
