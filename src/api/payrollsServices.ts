import { HTTP_CLIENT } from "../utils/httpClient";
import { ENDPOINTS } from "./endpoints";

export const generatePayroll = (values: any) => {
  return HTTP_CLIENT.post(ENDPOINTS.GENERATE_PAYROLL, values);
};

export const approvePayroll = (id: string, data: { approvedBy: string }) => {
  return HTTP_CLIENT.put(
    `${ENDPOINTS.APPROVE_PAYROLL.replace(":id", id)}`,
    data
  );
};

export const getAllPayrolls = (
  employeeId?: string,
  employeeName?: string,
  month?: string,
  year?: number
) => {
  const params: any = {};
  if (employeeId) params.employeeId = employeeId;
  if (employeeName) params.employeeName = employeeName;
  if (month) params.month = month;
  if (year) params.year = year;

  return HTTP_CLIENT.get(ENDPOINTS.GET_ALL_PAYROLLS, { params });
};

export const getEmployeePayrolls = (employeeId: string) => {
  return HTTP_CLIENT.get(
    ENDPOINTS.GET_EMPLOYEE_PAYROLLS.replace(":employeeId", employeeId)
  );
};

export const updatePayroll = (id: string, values: any) => {
  return HTTP_CLIENT.put(`${ENDPOINTS.UPDATE_PAYROLL}/${id}`, values);
};
export const generateSalarySlip = (id: string) => {
  return HTTP_CLIENT.post(ENDPOINTS.GENERATE_SALARY_SLIP.replace(":id", id));
};

export const downloadSalarySlip = (id: string) => {
  return HTTP_CLIENT.get(`${ENDPOINTS.DOWNLOAD_SALARY_SLIP}/${id}`, {
    responseType: "blob",
  });
};
