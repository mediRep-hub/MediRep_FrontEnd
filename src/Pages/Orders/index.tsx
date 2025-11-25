import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Checkbox, Spin } from "antd";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { LuDownload } from "react-icons/lu";
import { BiMessageDetail } from "react-icons/bi";
import { Loading3QuartersOutlined } from "@ant-design/icons";

import CustomTable from "../../Components/CustomTable";
import Pagination from "../../Components/Pagination";
import { getAllOrders } from "../../api/orderServices";
import { notifyError } from "../../Components/Toast";
import logo from "../../assets/medirep-logo.png";
import SearchDateRange from "../../Components/SearchBar/SearchDateRange";
import { SearchSelection } from "../../Components/SearchBar/SearchSelection";
import { getAllAccounts } from "../../api/adminServices";

const titles = [
  "Order ID",
  "Order Date",
  "MR Name",
  "Doctor/Pharmacy Name",
  "Strategy Name",
  "Order Type",
  "Amount",
  "Details",
];

export default function Orders() {
  const navigate = useNavigate();
  const [checkedOrders, setCheckedOrders] = useState<{ [key: string]: any }>(
    {}
  );
  const [selectedMR, setSelectedMR] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<{
    start: string;
    end: string;
  }>({
    start: "",
    end: "",
  });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { data: allMr } = useQuery({
    queryKey: ["AllAccount"],
    queryFn: () => getAllAccounts(),
    staleTime: 5 * 60 * 1000,
  });
  const AllMR = allMr?.data?.admins ?? [];
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      "GetOrder",
      currentPage,
      selectedMR,
      selectedDate.start,
      selectedDate.end,
    ],
    queryFn: () =>
      getAllOrders(
        currentPage,
        itemsPerPage,
        selectedMR,
        selectedDate.start || undefined,
        selectedDate.end || undefined
      ),
    staleTime: 5 * 60 * 1000,
  });

  const allOrders: any[] = Array.isArray(data?.data.data) ? data.data.data : [];
  const paginationInfo = {
    currentPage: data?.data.page || 1,
    itemsPerPage: itemsPerPage,
    totalItems: data?.data.totalItems || 0,
    totalPages: data?.data.totalPages || 1,
  };

  const handleGoDetails = (order: any) =>
    navigate("orderDetails", { state: { order } });
  const handleCheckboxChange = (
    orderId: string,
    order: any,
    checked: boolean
  ) => {
    setCheckedOrders((prev) => ({
      ...prev,
      [orderId]: checked ? order : undefined,
    }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setCheckedOrders({});
  };

  const generatePDF = async (orders: any[]) => {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      const tempDiv = document.createElement("div");
      tempDiv.style.width = "800px";
      tempDiv.style.padding = "20px";
      tempDiv.style.backgroundColor = "#fff";
      tempDiv.style.position = "fixed";
      tempDiv.style.top = "-9999px";

      tempDiv.innerHTML = `
        <div style="font-family:Arial, sans-serif;">
          <div style="display:flex;align-items:center;justify-content:center;margin-bottom:20px;text-align:center;">
            <img src="${logo}" style="width:80px;height:auto;margin-right:30px;"/>
            <h1 style="font-size:34px;font-weight:bold;">MediRep Bill Invoice</h1>
          </div>
          <div style="margin-bottom:20px;">
            <p><strong>Order ID:</strong> ${order.orderId}</p>
            <p><strong>Customer Name:</strong> ${order.customerName}</p>
            <p><strong>Address:</strong> ${order.address || "-"}</p>
            <p><strong>Order Date:</strong> ${dayjs(order.createdAt).format(
              "DD MMM, YYYY"
            )}</p>
            <p><strong>MR Name:</strong> ${order.mrName}</p>
            <p><strong>Strategy Name:</strong> ${order.strategyName}</p>
            <p><strong>Order Type:</strong> ${order.orderType}</p>
          </div>
          <table border="1" cellspacing="0" cellpadding="5" style="width:100%;border-collapse:collapse;">
            <tr>
              <th style="width:40%">Item Detail</th>
              <th style="width:20%;text-align:right;">Qty</th>
              <th style="width:20%;text-align:right;">Rate</th>
              <th style="width:20%;text-align:right;">Amount</th>
            </tr>
            ${order.medicines
              .map(
                (m: any) => `
              <tr>
                <td style="text-transform:uppercase;">${m.name}</td>
                <td style="text-align:right;">${m.quantity}</td>
                <td style="text-align:right;">Rs.${m.rate}</td>
                <td style="text-align:right;">Rs.${m.amount}</td>
              </tr>
            `
              )
              .join("")}
          </table>
          <div style="margin-top:20px;text-align:right;border-top:0.5px solid #000;border-bottom:0.5px solid #000;padding:10px 0;">
            <p>Subtotal: Rs.${order.subtotal}</p>
            <p>Tax (10%): Rs.${order.tax}</p>
            <div style="border-top:0.5px solid #000;margin-top:20px;">
              <p><strong>Total: Rs.${order.total}</strong></p>
            </div>
          </div>
          <p style="margin-top:20px;font-weight:bold;text-align:center">Thank you for your business.</p>
        </div>
      `;

      document.body.appendChild(tempDiv);
      const canvas = await html2canvas(tempDiv, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pageWidth = 210;
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;

      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pdfHeight);
      document.body.removeChild(tempDiv);
    }
    pdf.save("Orders_Invoice.pdf");
  };

  const handleDownloadSelectedPDF = async () => {
    const selectedOrders = Object.values(checkedOrders).filter(Boolean);
    if (!selectedOrders.length)
      return notifyError("Select at least one order!");
    setLoading(true);
    try {
      await generatePDF(selectedOrders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 24, color: "#0755E9" }} spin />
  );

  const tableData = allOrders.map((order) => [
    <div key={order.orderId} className="flex items-center gap-2">
      <Checkbox
        checked={!!checkedOrders[order.orderId]}
        onChange={(e) =>
          handleCheckboxChange(order.orderId, order, e.target.checked)
        }
        style={{ transform: "scale(1.2)", marginRight: "10px" }}
      />
      <p>{order.orderId}</p>
    </div>,
    order.createdAt ? dayjs(order.createdAt).format("DD MMM, YYYY") : "-",
    order.mrName,
    order.doctor.name,
    order.strategyName,
    order.orderType,
    <p key={`amount-${order.orderId}`} className="text-[12px]">
      Rs:<span className="text-sm ml-1">{order.amount}</span>
    </p>,
    <button
      key={`details-${order.orderId}`}
      className="flex gap-2 items-center"
      onClick={() => handleGoDetails(order)}
    >
      <BiMessageDetail size={16} className="text-[#7d7d7d]" />
      Details
    </button>,
  ]);
  const handleFilter = () => {
    if (selectedMR === "All") setSelectedMR("");
  };
  return (
    <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
      <div className="flex flex-wrap gap-4 justify-between items-start">
        <p className="text-heading font-medium text-[22px] sm:text-[24px]">
          Orders
        </p>
        <div className="flex flex-wrap w-full lg:w-auto items-center gap-3">
          <div className="w-full md:w-[300px]">
            <SearchSelection
              placeholder="Select MR"
              options={[
                "All",
                ...AllMR.filter(
                  (mr: any) => mr?.position === "MedicalRep(MR)"
                ).map((mr: any) => mr?.name),
              ]}
              value={selectedMR}
              onChange={(val) => {
                setSelectedMR(val);
                handleFilter();
              }}
            />
          </div>{" "}
          <div className="w-full md:w-[300px]">
            <SearchDateRange
              onChange={(range: { start: string; end: string }) => {
                setSelectedDate(range);
              }}
            />
          </div>
        </div>
        <button
          onClick={handleDownloadSelectedPDF}
          disabled={loading}
          className="h-[55px] w-full md:w-[180px] flex items-center justify-center gap-3 rounded-[6px] bg-[#E5EBF7]"
        >
          {loading ? (
            <Spin indicator={antIcon} />
          ) : (
            <>
              <LuDownload size={20} className="text-primary" />
              <p className="text-primary text-base font-medium ml-2">
                Download
              </p>
            </>
          )}
        </button>
      </div>

      <div className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(90vh-125px)] xl:h-[calc(90vh-162px)] h-auto">
        <div className="flex justify-between items-center">
          <p className="text-[#7D7D7D] font-medium text-sm">Orders List</p>
          <Pagination
            currentPage={paginationInfo.currentPage}
            itemsPerPage={paginationInfo.itemsPerPage}
            totalItems={paginationInfo.totalItems}
            onPageChange={handlePageChange}
          />
        </div>
        <div className="scroll-smooth bg-white rounded-xl mt-4 overflow-y-auto scrollbar-none 2xl:h-[calc(85vh-142px)] xl:h-[calc(65vh-55px)]">
          <CustomTable
            titles={titles}
            data={tableData}
            isFetching={isFetching}
          />
        </div>
      </div>
    </div>
  );
}
