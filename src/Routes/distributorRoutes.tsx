import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import Logo from "../assets/medirep-logoBIg.png";
import Report from "../Pages/Distributor/Reports";
import Billing from "../Pages/Distributor/Billing";
import MrRoutes from "../Pages/Distributor/MrRoutes";
import SecondarySale from "../Pages/Distributor/SecondarySale";
import PrimarySale from "../Pages/Distributor/PrimaerySale";
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
          <Route path="/distributor/primarySale" element={<PrimarySale />} />

          <Route
            path="/distributor/secondarySale"
            element={<SecondarySale />}
          />

          <Route path="/distributor/mr-Routes" element={<MrRoutes />} />

          <Route path="/distributor/billing" element={<Billing />} />

          <Route path="/distributor/reports" element={<Report />} />
        </Routes>
      </Suspense>
    </div>
  );
}
