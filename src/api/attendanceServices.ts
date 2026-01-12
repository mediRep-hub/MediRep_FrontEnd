import { HTTP_CLIENT } from "../utils/httpClient";
import { ENDPOINTS } from "./endPoints";

export const getAllAttendance = (params?: {
  search?: string;
  month?: number;
  year?: number;
}) => {
  return HTTP_CLIENT.get(ENDPOINTS.ATTENDANCE_GETALL, {
    params,
  });
};

export const updateAttendance = (id: string, values: any) => {
  return HTTP_CLIENT.put(`${ENDPOINTS.LEAVES_APPROVE}/${id}`, values);
};
export const updateAttendanceAdmin = (id: string, values: any) => {
  return HTTP_CLIENT.put(
    `${ENDPOINTS.ATTENDANCE_UpdateAttendanceAdmin}/${id}`,
    values
  );
};

export const getAttendanceSummary = () => {
  return HTTP_CLIENT.get(ENDPOINTS.ATTENDANCE_SUMMARY);
};

export const createDailyAttendance = () => {
  return HTTP_CLIENT.post(ENDPOINTS.ATTENDANCE_DAILYATTENDENCE);
};

export const getAttendanceGraph = () => {
  return HTTP_CLIENT.get(ENDPOINTS.ATTENDANCE_GETATTENDANCEGRAPH);
};

export const setCompanyTimingAPI = (values: {
  startTime: string;
  endTime: string;
  lateAfterMinutes: number;
}) => {
  return HTTP_CLIENT.post(
    `${ENDPOINTS.ATTENDANCE_UPDATECOMPANYTIMING}`,
    values
  );
};
export const GetCompanyTimingAPI = () => {
  return HTTP_CLIENT.get(ENDPOINTS.ATTENDANCE_COMPANYTIMING);
};
