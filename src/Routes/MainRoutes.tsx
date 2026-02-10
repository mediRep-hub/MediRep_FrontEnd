import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import Logo from "../assets/medirep-logoBIg.png";
import { useSelector } from "react-redux";
import TrackSale from "../Pages/Orders/trackSale";
import AsmTarget from "../Pages/Targets/AsmTarget";

const Tragets = lazy(() => import("../Pages/Targets"));

const CallReporting = lazy(() => import("../Pages/CallReporting"));
const CallReportingDetail = lazy(
  () => import("../Pages/CallReporting/CallReportingDetail"),
);
const Brick = lazy(() => import("../Pages/Brick"));
const SalewiseTargetDetail = lazy(
  () => import("../Pages/Targets/salewiseTargetDetail"),
);
const PlanSummary = lazy(() => import("../Pages/Plan Management"));
const WeeklyPlans = lazy(() => import("../Pages/Plan Management/WeeklyPlans"));
const MonthlyPlans = lazy(
  () => import("../Pages/Plan Management/MonthlyPlans"),
);

const DoctorMeetingExpense = lazy(
  () => import("../Pages/Expense Management/Doctor Meeting Expense"),
);
const MonthlyTEReport = lazy(
  () => import("../Pages/Expense Management/Monthly T&E Report"),
);
const MRWiseExpense = lazy(
  () => import("../Pages/Expense Management/MR-wise Expense"),
);
const RouteWiseExpense = lazy(
  () => import("../Pages/Expense Management/Route-wise Expense"),
);
const CategoryWiseExpense = lazy(
  () => import("../Pages/Expense Management/Category-wise Expense"),
);

const ProductWiseDistribution = lazy(
  () => import("../Pages/Reports/Product Wise Distribution"),
);

const GroupDetails = lazy(() => import("../Pages/Group/groupDetails"));
const AccountDetails = lazy(
  () => import("../Pages/ManageAccount/AccountDetails"),
);
const PendingOrders = lazy(() => import("../Pages/Orders/pendingOrder"));

const DailyCallReport = lazy(() => import("../Pages/Reports/DailyCallReport"));

const MRProductivityReport = lazy(
  () => import("../Pages/Reports/MRProductivityReport"),
);

const GeoLocationReport = lazy(
  () => import("../Pages/Reports/Geo-locationReport"),
);

const DoctorCoverageReport = lazy(
  () => import("../Pages/Reports/DoctorCoverageReport"),
);

const RouteComplianceReport = lazy(
  () => import("../Pages/Reports/RouteComplianceReport"),
);

const SampleDistributionReport = lazy(
  () => import("../Pages/Reports/SampleDistributionReport"),
);

const TeamPerformanceReport = lazy(
  () => import("../Pages/Reports/TeamPerformanceReport"),
);

const DailyCallReportingDetail = lazy(
  () => import("../Pages/Reports/DailyCallReport/DailyCallReportingDetail"),
);

const BrickWiseSale = lazy(() => import("../Pages/SaleData/BrickWiseSale"));

const ChannelWiseSale = lazy(() => import("../Pages/SaleData/ChannelwiseSale"));
const PrimarySale = lazy(
  () => import("../Pages/SaleData/PrimarySales/primarySale"),
);
const PrimarySaleDetails = lazy(
  () => import("../Pages/SaleData/PrimarySales/primarySaleDetails"),
);
const SecondarySale = lazy(
  () => import("../Pages/SaleData/SecondarySales/secondarySale"),
);
const SecondarySaleDetails = lazy(
  () => import("../Pages/SaleData/SecondarySales/secondarySaleDetails"),
);

const TrackRequisition = lazy(
  () => import("../Pages/Requisition/trackRequisition"),
);
const Orders = lazy(() => import("../Pages/Orders"));
const OrderDetails = lazy(() => import("../Pages/Orders/orderDetails"));
const Pharmacy = lazy(() => import("../Pages/Pharmacy"));
const Group = lazy(() => import("../Pages/Group"));
const RequisitionDetail = lazy(
  () => import("../Pages/Requisition/RequisitionDetail"),
);
const ManageAccount = lazy(() => import("../Pages/ManageAccount"));
const DashBoard = lazy(() => import("../Pages/DashBoard"));
const Doctors = lazy(() => import("../Pages/Doctors"));
const StrategyPlanning = lazy(() => import("../Pages/CallReporting"));
const DataReporting = lazy(() => import("../Pages/DataReporting"));
const Products = lazy(() => import("../Pages/Products"));
const Requisition = lazy(() => import("../Pages/Requisition"));

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
        <Route
          path="/manageAccounts/details"
          element={
            user?.position === "Admin" ? (
              <AccountDetails />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />{" "}
        <Route path="/targets-achievements" element={<Tragets />} />
        <Route
          path="/targets-achievements/Details"
          element={<SalewiseTargetDetail />}
        />
        <Route path="/asm-target" element={<AsmTarget />} />
        <Route path="/products" element={<Products />} />
        <Route path="/pharmacies" element={<Pharmacy />} />
        <Route path="/requisitionsList" element={<Requisition />} />
        <Route
          path="/requisitionsList/requisitionDetail"
          element={<RequisitionDetail />}
        />{" "}
        <Route path="/trackRequisition" element={<TrackRequisition />} />
        <Route path="/group" element={<Group />} />
        <Route path="/group/groupDetails" element={<GroupDetails />} />
        <Route path="/callReporting" element={<CallReporting />} />
        <Route
          path="/callReporting/details"
          element={<CallReportingDetail />}
        />
        <Route path="/orders" element={<Orders />} />
        <Route path="/pendingOrders" element={<PendingOrders />} />
        <Route path="/orders/orderDetails" element={<OrderDetails />} />
        <Route path="/trackSale" element={<TrackSale />} />
        <Route path="/primarySale" element={<PrimarySale />} />
        <Route
          path="/primarySale/PrimarySaleDetails"
          element={<PrimarySaleDetails />}
        />{" "}
        <Route path="/secondarySale" element={<SecondarySale />} />
        <Route
          path="/secondarySale/secondarySaleDetails"
          element={<SecondarySaleDetails />}
        />
        <Route path="/channelWiseSale" element={<ChannelWiseSale />} />
        <Route path="/salebrickWise" element={<BrickWiseSale />} />
        <Route path="/brick" element={<Brick />} />
        <Route path="/dailyCallReport" element={<DailyCallReport />} />
        <Route
          path="/dailyCallReport/dailyCallReportingDetail"
          element={<DailyCallReportingDetail />}
        />
        <Route
          path="/mrProductivityReport"
          element={<MRProductivityReport />}
        />
        <Route
          path="/routeComplianceReport"
          element={<RouteComplianceReport />}
        />
        <Route
          path="/sampleDistributionReport"
          element={<SampleDistributionReport />}
        />
        <Route
          path="/doctorCoverageReport"
          element={<DoctorCoverageReport />}
        />
        <Route
          path="/teamPerformanceReport"
          element={<TeamPerformanceReport />}
        />
        <Route
          path="/productWiseDistribution"
          element={<ProductWiseDistribution />}
        />
        <Route path="/geo-locationReport" element={<GeoLocationReport />} />
        <Route path="/PlanSummary" element={<PlanSummary />} />
        <Route path="/weeklyPlans" element={<WeeklyPlans />} />
        <Route path="/monthlyPlans" element={<MonthlyPlans />} />
        <Route path="/mrWiseExpense" element={<MRWiseExpense />} />
        <Route path="/categoryWiseExpense" element={<CategoryWiseExpense />} />
        <Route path="/routeWiseExpense" element={<RouteWiseExpense />} />
        <Route
          path="/doctorMeetingExpense"
          element={<DoctorMeetingExpense />}
        />
        <Route path="/monthlyTandEReport" element={<MonthlyTEReport />} />
      </Routes>
    </Suspense>
  );
}
