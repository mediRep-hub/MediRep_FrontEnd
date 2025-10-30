import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import Logo from "../assets/Logo/logo.png";
import { useAuth } from "../Context/AuthContext";
import Tragets from "../Pages/Targets";

const RequisitionDetail = lazy(
  () => import("../Pages/Requisition/RequisitionDetail")
);
const ManageAccount = lazy(() => import("../Pages/ManageAccount"));
const DashBoard = lazy(() => import("../Pages/DashBoard"));
const DoctorProfileManagement = lazy(
  () => import("../Pages/DoctorProfileManagement")
);
const StrategyPlanning = lazy(() => import("../Pages/StrategyPlanning"));
const DataReporting = lazy(() => import("../Pages/DataReporting"));
const ManageMR = lazy(() => import("../Pages/ManageMR"));
const Products = lazy(() => import("../Pages/Products"));
const Requisition = lazy(() => import("../Pages/Requisition"));
const CallReporting = lazy(() => import("../Pages/CallReporting"));
const CallReportingDetail = lazy(
  () => import("../Pages/CallReporting/CallReportingDetail")
);

export default function MainRoutes() {
  const { admin } = useAuth();
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <img src={Logo} alt="Logo" className="w-auto h-[110px]" />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route
          path="/doctorProfileManagement"
          element={<DoctorProfileManagement />}
        />
        <Route path="/strategyPlanning" element={<StrategyPlanning />} />
        <Route path="/dataReporting" element={<DataReporting />} />
        <Route path="/manageMR" element={<ManageMR />} />
        <Route
          path="/manageAccount"
          element={
            admin?.position === "Admin" ? (
              <ManageAccount />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />{" "}
        <Route path="/targets-achievement" element={<Tragets />} />
        <Route path="/products" element={<Products />} />
        <Route path="/requisition" element={<Requisition />} />
        <Route
          path="/requisition/requisitionDetail"
          element={<RequisitionDetail />}
        />
        <Route path="/callReporting" element={<CallReporting />} />
        <Route
          path="/callReporting/callReportingDetail"
          element={<CallReportingDetail />}
        />
      </Routes>
    </Suspense>
  );
}
