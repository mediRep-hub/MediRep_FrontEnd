import { HTTP_CLIENT } from "../utils/httpClient";
import { ENDPOINTS } from "./endpoints";

export const addDoctors = (values: any) => {
  return HTTP_CLIENT.post(ENDPOINTS.DOCTOR_ADD_DOCTOR, values);
};

export const getAllDoctors = () => {
  return HTTP_CLIENT.get(ENDPOINTS.DOCTOR_GET_ALL);
};

// export const getDoctorById = (id: string) => {
//   return HTTP_CLIENT.get(`${ENDPOINTS.DOCTOR_GET_SINGLE}/${id}`);
// };

export const updateDoctor = (id: string, values: any) => {
  return HTTP_CLIENT.put(`${ENDPOINTS.DOCTOR_UPDATE}/${id}`, values);
};

export const deleteDoctor = (id: string) => {
  return HTTP_CLIENT.delete(`${ENDPOINTS.DOCTOR_DELETE}/${id}`);
};
