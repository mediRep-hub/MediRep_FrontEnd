import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import Logo from "../assets/medirep-logoBIg.png";
import Tragets from "../Pages/Targets";
import { useSelector } from "react-redux";

const PendingOrder = lazy(() => import("../Pages/Orders/pendingOrder"));
const PrimarySale = lazy(() => import("../Pages/SaleData/primarySale"));
const SecondarySale = lazy(() => import("../Pages/SaleData/secondarySale"));
const PrimarySaleDetails = lazy(
  () => import("../Pages/SaleData/primarySaleDetails")
);
const TrackRequisition = lazy(
  () => import("../Pages/Requisition/trackRequisition")
);
const Setting = lazy(() => import("../Pages/Setting"));
const Orders = lazy(() => import("../Pages/Orders"));
const OrderDetails = lazy(() => import("../Pages/Orders/orderDetails"));
const BricksDetail = lazy(() => import("../Pages/Bricks/bricksDetail"));
const Pharmacy = lazy(() => import("../Pages/Pharmacy"));
const Group = lazy(() => import("../Pages/Group"));
const RequisitionDetail = lazy(
  () => import("../Pages/Requisition/RequisitionDetail")
);
const ManageAccount = lazy(() => import("../Pages/ManageAccount"));
const DashBoard = lazy(() => import("../Pages/DashBoard"));
const Doctors = lazy(() => import("../Pages/Doctors"));
const StrategyPlanning = lazy(() => import("../Pages/Bricks"));
const DataReporting = lazy(() => import("../Pages/DataReporting"));
const Products = lazy(() => import("../Pages/Products"));
const Requisition = lazy(() => import("../Pages/Requisition"));
const Bricks = lazy(() => import("../Pages/Bricks"));

export default function MainRoutes() {
  const { user } = useSelector((state: any) => state.user);
  return (
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
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/strategyPlanning" element={<StrategyPlanning />} />
        <Route path="/dataReporting" element={<DataReporting />} />
        <Route
          path="/manageAccounts"
          element={
            user?.position === "Admin" ? (
              <ManageAccount />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />{" "}
        <Route path="/targets-achievements" element={<Tragets />} />
        <Route path="/products" element={<Products />} />
        <Route path="/pharmacies" element={<Pharmacy />} />
        <Route path="/requisitionsList" element={<Requisition />} />
        <Route
          path="/requisitionsList/requisitionDetail"
          element={<RequisitionDetail />}
        />{" "}
        <Route path="/trackRequisition" element={<TrackRequisition />} />
        <Route path="/group" element={<Group />} />
        <Route path="/bricks" element={<Bricks />} />
        <Route path="/bricks/details" element={<BricksDetail />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/pendingOrders" element={<PendingOrder />} />
        <Route path="/orders/orderDetails" element={<OrderDetails />} />
        <Route path="/primarySale" element={<PrimarySale />} />{" "}
        <Route
          path="/primarySale/primarySaleDetails"
          element={<PrimarySaleDetails />}
        />
        <Route path="/secondarySale" element={<SecondarySale />} />
        <Route path="/setting" element={<Setting />} />
      </Routes>
    </Suspense>
  );
}
