import { HTTP_CLIENT } from "../utils/httpClient";
import { ENDPOINTS } from "./endPoints";

export const updateEvents = (id: string, values: any) => {
  return HTTP_CLIENT.put(`${ENDPOINTS.EVENTS_UPDATE}/${id}`, values);
};
export const createEvent = (values: any) => {
  return HTTP_CLIENT.post(ENDPOINTS.EVENTS_CREATE, values);
};
export const getAllEvents = () => {
  return HTTP_CLIENT.get(ENDPOINTS.EVENTS_GET_ALL);
};
export const deleteEvent = (id: string) => {
  return HTTP_CLIENT.delete(`${ENDPOINTS.EVENTS_DELETE}/${id}`);
};
