export const BASE_URL = "http://localhost:5001";

export const ENDPOINTS = {
  //   -----------Accounts-------------
  ACCOUNTS_LOGIN: "api/admin/login",
  ACCOUNTS_LOGOUT: "/api/admin/logout",
  ACCOUNTS_GETALL: "/api/admin/getAll",
  ACCOUNTS_UPDATE: "api/admin/updateAccount",
  ACCOUNTS_DELETE: "/api/admin/deleteAccount",
  ACCOUNTS_ADD: "/api/admin/register",

  //   -----------Doctor-------------
  DOCTOR_GET_ALL: "/api/doctor/getAllDoctor",
  DOCTOR_ADD_DOCTOR: "/api/doctor/addDoctor",
  DOCTOR_UPDATE: "/api/doctor/updateDoctor",
  DOCTOR_DELETE: "/api/doctor/deleteDoctor",

  //   -----------Products-------------
  PRODUCT_ADD_PRODUCT: "/api/product/addProduct",
  PRODUCT_GET_ALL: "/api/product/getAllProducts",
  PRODUCT_UPDATE: "/api/product/updateproduct",
  PRODUCT_DELETE: "/api/product/deleteProduct",

  //   -----------call Reporting-------------
  PRODUCTS_GET_ALL: "/api/callRepoeting/getAllReports",

  //   -----------Manage MR-------------
  MR_ADD_MR: "/api/manageMr/addMR",
  MR_GET_ALL: "/api/manageMr/getAllMR",
  MR_UPDATE: "/api/manageMr/updateMR",
  MR_DELETE: "/api/manageMr/deleteMR",

  //   -----------Requisitions-------------
  REQUISITIONS_ADD_REQUISITIONS: "/api/requisition/addRequisition",
  REQUISITIONS_GET_ALL: "/api/requisition/getAllRequisition",
  REQUISITIONS_UPDATE: "/api/requisition/updateRequisition",
  REQUISITIONS_DELETE: "/api/requisition/deleteRequisition",
  REQUISITIONS_GET_SINGLE: "/api/requisition/getSingleRequisition",
  REQUISITIONS_UPDATEACCEPTED: "/api/requisition/updateAccepted",

  //   -----------UploadFIle-------------
  UPLOAD_FILE: "/api/uploadFile",
};
