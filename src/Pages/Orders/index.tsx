import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Checkbox, Spin } from "antd";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { LuDownload } from "react-icons/lu";
import { Loading3QuartersOutlined } from "@ant-design/icons";

import CustomTable from "../../Components/CustomTable";
import Pagination from "../../Components/Pagination";
import { getAllOrders } from "../../api/orderServices";
import { notifyError } from "../../Components/Toast";
import Logo from "../../assets/medirep-logo2.png";
import SearchDateRange from "../../Components/SearchBar/SearchDateRange";
import { SearchSelection } from "../../Components/SearchBar/SearchSelection";
import { getAllAccounts } from "../../api/adminServices";
import { Icon } from "@iconify/react";

const titles = [
  "Order ID",
  "Order Date",
  "Doctor/Pharmacy Name",
  "Distributor Name",
  "MR Name",
  "Amount",
  "Details",
];

export default function Orders() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "MediRep | Orders";
  }, []);
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
  const { data, isFetching } = useQuery({
    queryKey: [
      "GetOrder",
      currentPage,
      selectedMR,
      selectedDate.start,
      selectedDate.end,
      "approved",
    ],
    queryFn: () =>
      getAllOrders(
        currentPage,
        itemsPerPage,
        selectedMR,
        selectedDate.start || undefined,
        selectedDate.end || undefined,
        "approved"
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
        <div style="font-family:Outfit, sans-serif;" >
          <div style="display:flex;align-items:center;justify-content:center; gap:8px;">
            <img src="${Logo}" style="width:80px;height:auto;"/>
            <h1 style="font-size:34px; font-weight:bold; margin:0; display:inline-block;">
              <span style="color:#0755E9;">Medi</span>
               <span style="color:#FF8D28; margin-right:24px;">Rep</span>
              Bill Invoice
            </h1>
          </div>
          <div style="margin-bottom:20px;">
            <p><strong>Order ID:</strong> ${order.orderId}</p>
            <p><strong>Pharmacy Name:</strong> ${
              order.pharmacyId.name || "-"
            }</p>
            <p><strong>Address:</strong> ${order.address || "-"}</p>
            <p><strong>Order Date:</strong> ${dayjs(order.createdAt).format(
              "DD MMM, YYYY"
            )}</p>
            <p><strong>MR Name:</strong> ${order.mrName}</p>
          </div>
          <table border="1" cellspacing="0" cellpadding="5" style="width:100%;border-collapse:collapse;">
            <tr >
              <th style="width:40%;text-align:start">Item Detail</th>
              <th style="width:40%;text-align:start">Strength</th>
              <th style="width:20%;text-align:start;">Qty</th>      
              <th style="width:40%;text-align:start">Medicine Type</th>
              <th style="width:20%;text-align:start;">Rate</th>
              <th style="width:20%;text-align:start;">Amount</th>
            </tr>
            ${order.medicines
              .map(
                (m: any) => `
              <tr>
                <td style="text-transform:uppercase;">${
                  m.medicineId?.productName
                }</td>
                <td style="text-align:start;">${m.strength}</td>
                <td style="text-align:start;">${m.quantity}</td>
                <td style="text-align:start;">${m.medicineType}</td>
                <td style="text-align:start;">Rs.${m.medicineId?.amount}</td>
                <td style="text-align:start;">Rs.${
                  m?.medicineId?.amount * m?.quantity
                }</td>
              </tr>
            `
              )
              .join("")}
          </table>
          <div style="margin-top:20px;text-align:right;border-top:0.5px solid #000;border-bottom:0.5px solid #000;padding:10px 0;">
           <div style="display: flex; gap: 20px; justify-content: end;">
           <p class="font-medium">Subtotal:</p>
           <p style="width: 150px; text-align: start;"">Rs.${order.subtotal}</p>
          </div>
  <div style="display: flex; gap: 20px; justify-content: end;">
  <p class="font-medium">Discount:</p>
  <p style="width: 150px; text-align: start;"">
    Rs. ${(order.subtotal * (order.discount / 100)).toLocaleString()} (${
        order.discount
      }%)
  </p>
</div>
            <div style="border-top:0.5px solid #000;margin-top:20px;">
                <div style="display: flex; gap: 20px; justify-content: end; ">
                <p style="width: 100px;"><strong>Total:</strong></p>
                <p style="width: 150px; text-align: start;""><strong> Rs.${
                  order.total
                }</strong></p>
              </div>
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

  const tableData = allOrders
    .filter((order) => order.IStatus === true)
    .map((order) => [
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
      order.pharmacyId.name,
      order.distributorName,
      order.mrName,
      <p key={`amount-${order.orderId}`} className="text-[12px]">
        Rs: {order.total}
      </p>,
      <button
        key={`details-${order.orderId}`}
        className="flex gap-2 items-center"
        onClick={() => handleGoDetails(order)}
      >
        <Icon icon="iconoir:notes" height="16" width="16" color="#7d7d7d" />
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
          <div className="w-full md:w-[300px] md:mt-0 mt-2">
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

      <div className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(75.5vh-0px)] xl:h-[calc(64vh-0px)] h-auto">
        <div className="flex justify-between items-center">
          <p className="text-[#7D7D7D] font-medium text-sm">Orders List</p>
          <Pagination
            currentPage={paginationInfo.currentPage}
            itemsPerPage={paginationInfo.itemsPerPage}
            totalItems={paginationInfo.totalItems}
            onPageChange={handlePageChange}
          />
        </div>
        <div
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="scroll-smooth bg-white rounded-xl mt-4 overflow-y-auto scrollbar-none 2xl:h-[calc(68vh-0px)] xl:h-[calc(53vh-0px)]"
        >
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
