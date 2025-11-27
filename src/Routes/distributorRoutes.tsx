import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import Logo from "../assets/medirep-logo.png";
const Warehouse = lazy(() => import("../Pages/Distributor/Warehouse"));
const DistributorDashboard = lazy(
  () => import("../Pages/Distributor/DistributorDashboard")
);
export default function DistributorRoutes() {
  return (
    <div>
      <Suspense
        fallback={
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="h-[120px] w-[120px] rounded-lg bg-white">
              <img src={Logo} alt="Logo" className="w-auto h-[110px]" />
            </div>
          </div>
        }
      >
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/distributor/dashboard" replace />}
          />
          <Route
            path="/distributor/dashboard"
            element={<DistributorDashboard />}
          />

          <Route path="/distributor/warehouse" element={<Warehouse />} />
        </Routes>
      </Suspense>
    </div>
  );
}
