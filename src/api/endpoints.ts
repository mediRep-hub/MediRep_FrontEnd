// export const BASE_URL = "https://medi-rep-back-end.vercel.app";
export const BASE_URL = "http://localhost:5001";

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
  DOCTOR_GET_ALL_LIST: "/doctor/getAllDoctorslist",
  DOCTOR_ADD_DOCTOR: "/doctor/addDoctor",
  DOCTOR_UPDATE: "/doctor/updateDoctor",
  DOCTOR_DELETE: "/doctor/deleteDoctor",
  DOCTOR_uploadCSVDOCTOR: "/doctor/uploadDoctorsCSV",
  //   -----------Pharmacy-------------
  Pharmacy_GET_ALL: "/pharmacy/getAllPharmacies",
  Pharmacy_GET_ALL_LIST: "/pharmacy/getAllPharmaciesList",
  Pharmacy_ADD_Pharmacy: "/pharmacy/addPharmacy",
  Pharmacy_UPDATE: "/pharmacy/updatePharmacy",
  Pharmacy_DELETE: "/pharmacy/deletePharmacy",
  Pharmacy_uploadCSVDOCTOR: "/pharmacy/uploadPharmaciesCSV",

  //   -----------Products-------------
  PRODUCT_ADD_PRODUCT: "/product/addProduct",
  PRODUCT_GET_ALL: "/product/getAllProducts",
  PRODUCT_GET_ALL_MR: "/product/getAllProductsMR",
  PRODUCT_TRAGET_ACHIVEMENTS: "/product/getMonthlyAchievement",
  PRODUCT_UPDATE: "/product/updateproduct",
  PRODUCT_DELETE: "/product/deleteProduct",
  PRODUCT_uploadCSVTarget: "/product/uploadCSVUpdateTarget",

  //   -----------Bricks-------------
  REPORTING_GET_ALL: "/brick/getAllBricks",
  REPORTING_ADD_REPORT: "/brick/addBrick",
  REPORTING_UPDATE_REPORT: "/brick/updateBrick",
  REPORTING_DELETE_REPORT: "/brick/deleteBrick",
  REPORTING_REORDER_REPORT: "/brick/reorderDoctorList",

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
  REQUISITIONS_UPDATEACCEPTED: "/requisition/updateStatus",
  // ----------------- Orders -----------------
  ORDER_ADD: "/orders/addOrder",
  ORDER_GET_ALL: "/orders/getAllOrders",
  ORDER_GET_SINGLE: "/orders/getOrder",
  ORDER_UPDATE: "/orders/updateOrder",
  ORDER_ACCEPT: "/orders/acceptOrder",
  ORDER_DELETE: "/orders/deleteOrder",
  //   -----------Primary Sales-------------
  PRIMARY_SALE_ADD: "/primarySale/createPrimarySale",
  PRIMARY_SALE_GET_ALL: "/primarySale/getAllPrimarySales",
  PRIMARY_SALE_UPDATE: "/primarySale/updatePrimarySale",
  PRIMARY_SALE_DELETE: "/primarySale/deletePrimarySale",
  PRIMARY_SALE_BULK_UPLOAD: "/primarySale/uploadBulkPrimarySales",
  //   -----------UploadFIle-------------
  UPLOAD_FILE: "/upload/uploadFile",
};
