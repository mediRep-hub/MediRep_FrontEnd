import * as Yup from "yup";
import {
  FaUserMd,
  FaClipboardList,
  FaBoxOpen,
  FaBullseye,
  FaPhoneAlt,
  FaChartBar,
  FaShoppingCart,
  FaTachometerAlt,
  FaMoneyBill,
} from "react-icons/fa";
import type { IconType } from "react-icons/lib";
import { FaUserLarge } from "react-icons/fa6";

export const LoginSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const DoctorSchema = Yup.object().shape({
  name: Yup.string().required("Doctor name is required"),
  specialty: Yup.string().required("Specialty is required"),
  email: Yup.string().email().required("Email is required"),
  phone: Yup.string().required("Phone is required"),
  startTime: Yup.string().required("Start time is required"),
  endTime: Yup.string().required("End time is required"),
  region: Yup.string().required("Region is required"),
  area: Yup.string().required("Area is required"),
  affiliation: Yup.string().required("Affiliation is required"),
  image: Yup.string().nullable(),
  location: Yup.object().shape({
    address: Yup.string().required("Address is required"),
    lat: Yup.number().required("Latitude is required"),
    lng: Yup.number().required("Longitude is required"),
  }),
});

export const MRSchema = Yup.object().shape({
  mrName: Yup.string().required("MR Name is required"),
  phoneNo: Yup.string()
    .required("Phone Number is required")
    .matches(/^[0-9]+$/, "Phone Number must be digits only")
    .min(10, "Phone Number must be at least 10 digits"),
  region: Yup.string().required("Region is required"),
  area: Yup.string().required("Area is required"),
  strategy: Yup.string().required("Strategy is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
  image: Yup.string().required("Image is required"),
});
export const RequisitionSchema = Yup.object().shape({
  doctorName: Yup.string().required("Doctor name is required"),
  product: Yup.string().required("Product is required"),
  reason: Yup.string().required("Reason is required"),
  duration: Yup.string().required("Duration is required"),
  paymentType: Yup.string().required("Payment type is required"),
  amount: Yup.string().required("Amount is required"),
  supportingDocument: Yup.string().required("Supporting Document is required"),
  commitment: Yup.string().required("commitment is required"),
  paymentDate: Yup.string().required("Payment Date Document is required"),
});

export const ProductSchema = Yup.object().shape({
  productName: Yup.string().required("Product Name is required"),
  category: Yup.string().required("Category is required"),
  isfrom: Yup.string().required("From is required"),
  amount: Yup.number()
    .typeError("Amount must be a number")
    .required("Amount is required"),
  isStatus: Yup.string().required("Status is required"),
  productImage: Yup.string().required("Product Image is required"),
  strength: Yup.string().required("Strength is required"),
  packSize: Yup.string().required("Pack Size is required"),
});

export const StrategySchema = Yup.object().shape({
  region: Yup.string().required("Please select a region."),
  area: Yup.string().required("Please select an area or city."),
  strategyName: Yup.string().required("Strategy name is required."),
  route: Yup.string().required("Please enter the route name."),
  day: Yup.string().required("Please select a day."),
  mrName: Yup.string().required("Please select the MR."),
  doctorList: Yup.array().min(1, "Please select at least one doctor."),
});

export const reportSchema = Yup.object().shape({
  region: Yup.string().required("Region is required"),
  dateRange: Yup.array()
    .of(Yup.date().required("Date is required"))
    .min(2, "Please select a start and end date")
    .required("Date range is required"),
  selectMR: Yup.string().required("MR is required"),
  exportType: Yup.string().required("Export type is required"),
  reports: Yup.array()
    .of(Yup.string())
    .min(1, "At least one report type must be selected"),
});

export const AccountSchema = (isEdit: boolean) =>
  Yup.object().shape({
    name: Yup.string().required("Name is required"),
    phoneNumber: Yup.string().required("Phone Number is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password:
      isEdit === true
        ? Yup.string()
            .notRequired()
            .matches(
              /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*\d).{6,}$/,
              "Must include 1 uppercase, 1 special character, and 1 digit."
            )
        : Yup.string()
            .required("Password is required")
            .matches(
              /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*\d).{6,}$/,
              "Must include 1 uppercase, 1 special character, and 1 digit."
            ),

    confirmPassword:
      isEdit === true
        ? Yup.string()
            .notRequired()
            .matches(
              /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*\d).{6,}$/,
              "Must include 1 uppercase, 1 special character, and 1 digit."
            )
        : Yup.string()
            .required("Password is required")
            .matches(
              /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*\d).{6,}$/,
              "Must include 1 uppercase, 1 special character, and 1 digit."
            ),
    image: Yup.string().optional(),
    division: Yup.string().required("Division is required"),
    area: Yup.string().required("Area is required"),
    region: Yup.string().required("Region is required"),
    strategy: Yup.string().required("Strategy is required"),
    position: Yup.string().required("Position is required"),
  });

export interface SidebarLink {
  name: string;
  path: string;
  icon: IconType;
}
export const defaultLinks: SidebarLink[] = [
  { name: "Dashboard", path: "/dashboard", icon: FaTachometerAlt },
  {
    name: "Doctor Profile Management",
    path: "/doctorProfileManagement",
    icon: FaUserMd,
  },

  {
    name: "Targets/Achievement",
    path: "/targets-achievement",
    icon: FaBullseye,
  },
  { name: "Products", path: "/products", icon: FaBoxOpen },
  { name: "Requisitions", path: "/requisition", icon: FaClipboardList },
  { name: "Call Reporting", path: "/callReporting", icon: FaPhoneAlt },
  { name: "Data Reporting", path: "/dataReporting", icon: FaChartBar },
  { name: "Orders", path: "/orders", icon: FaShoppingCart },
];
export const DistributorLinks: SidebarLink[] = [
  { name: "Dashboard", path: "/distributor/dashboard", icon: FaTachometerAlt },
  {
    name: "The Warehouse",
    path: "/distributor/warehouse",
    icon: FaBoxOpen,
  },
  {
    name: "Primary Sale",
    path: "/distributor/primarySale",
    icon: FaBullseye,
  },
  {
    name: "Secondary Sale",
    path: "/distributor/secondarySale",
    icon: FaBoxOpen,
  },
  {
    name: "MR & Route",
    path: "/distributor/mrRoute",
    icon: FaUserLarge,
  },
  {
    name: "Billing",
    path: "/distributor/billing",
    icon: FaMoneyBill,
  },
  {
    name: "Reports",
    path: "/distributor/reports",
    icon: FaChartBar,
  },
];
