import { HTTP_CLIENT } from "../utils/httpClient";
import { ENDPOINTS } from "./endpoints";

export const uploadFile = (file: File, fileType: string = "images") => {
  const formData = new FormData();
  formData.append("file", file);

  return HTTP_CLIENT.post(
    `${ENDPOINTS.UPLOAD_FILE}?fileType=${fileType}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};
