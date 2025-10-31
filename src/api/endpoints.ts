export const BASE_URL = "https://medi-rep-back-end.vercel.app";

export const ENDPOINTS = {
  //   -----------Accounts-------------
  ACCOUNTS_LOGIN: "/admin/login",
  ACCOUNTS_LOGOUT: "/admin/logout",
  ACCOUNTS_GETALL: "/admin/getAll",
  ACCOUNTS_UPDATE: "/admin/updateAccount",
  ACCOUNTS_DELETE: "/admin/deleteAccount",
  ACCOUNTS_ADD: "/admin/register",

  //   -----------Doctor-------------
  DOCTOR_GET_ALL: "/doctor/getAllDoctor",
  DOCTOR_ADD_DOCTOR: "/doctor/addDoctor",
  DOCTOR_UPDATE: "/doctor/updateDoctor",
  DOCTOR_DELETE: "/doctor/deleteDoctor",
  DOCTOR_uploadCSVDOCTOR: "/doctor/uploadDoctorsCSV",

  //   -----------Products-------------
  PRODUCT_ADD_PRODUCT: "/product/addProduct",
  PRODUCT_GET_ALL: "/product/getAllProducts",
  PRODUCT_UPDATE: "/product/updateproduct",
  PRODUCT_DELETE: "/product/deleteProduct",
  PRODUCT_uploadCSVTarget: "/product/uploadCSVUpdateTarget",

  //   -----------call Reporting-------------
  PRODUCTS_GET_ALL: "/callRepoeting/getAllReports",

  //   -----------Manage MR-------------
  MR_ADD_MR: "/manageMr/addMR",
  MR_GET_ALL: "/manageMr/getAllMR",
  MR_UPDATE: "/manageMr/updateMR",
  MR_DELETE: "/manageMr/deleteMR",

  //   -----------Requisitions-------------
  REQUISITIONS_ADD_REQUISITIONS: "/requisition/addRequisition",
  REQUISITIONS_GET_ALL: "/requisition/getAllRequisition",
  REQUISITIONS_UPDATE: "/requisition/updateRequisition",
  REQUISITIONS_DELETE: "/requisition/deleteRequisition",
  REQUISITIONS_GET_SINGLE: "/requisition/getSingleRequisition",
  REQUISITIONS_UPDATEACCEPTED: "/requisition/updateAccepted",

  //   -----------UploadFIle-------------
  UPLOAD_FILE: "/upload/uploadFile",
};
