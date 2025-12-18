import { useState, useEffect } from "react";
import { BiMessageDetail } from "react-icons/bi";
import { Checkbox, Spin } from "antd";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import Logo from "../../../assets/medirep-logo2.png";
import CustomTable from "../../../Components/CustomTable";
import SearchBar from "../../../Components/SearchBar";
import Pagination from "../../../Components/Pagination";
import { SearchSelection } from "../../../Components/SearchBar/SearchSelection";
import SearchDateRange from "../../../Components/SearchBar/SearchDateRange";
import { getAllAccounts } from "../../../api/adminServices";
import { getAllOrders } from "../../../api/orderServices";
import { useSelector } from "react-redux";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { notifyError } from "../../../Components/Toast";
import jsPDF from "jspdf";
import dayjs from "dayjs";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";

const titles = [
  "Order ID",
  "Order Date",
  "MR Name",
  "Doctor/Pharmacy Name",
  "Amount",
  "Details",
];

export default function SecondarySale() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checkedOrders, setCheckedOrders] = useState<{ [key: string]: any }>(
    {}
  );
  const [itemsPerPage] = useState(10);
  const [selectedMR, setSelectedMR] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<{
    start?: string;
    end?: string;
  }>({});
  const { user } = useSelector((state: any) => state.user);
  const { data: allAccounts } = useQuery({
    queryKey: ["AllAccounts"],
    queryFn: getAllAccounts,
    staleTime: 5 * 60 * 1000,
  });

  const AllMR =
    allAccounts?.data?.admins?.filter(
      (mr: any) => mr.position === "MedicalRep(MR)"
    ) ?? [];

  const { data: ordersData, isFetching } = useQuery({
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
        selectedMR || undefined,
        selectedDate.start || undefined,
        selectedDate.end || undefined,
        "approved"
      ),
    staleTime: 5 * 60 * 1000,
  });
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
  const handleGoDetails = (order: any) =>
    navigate("/distributor/secondarySale/secondarySaleDetails", {
      state: { order },
    });
  const tableData =
    ordersData?.data?.data
      ?.filter((order: any) => order?.pharmacyId?.area === user?.area)
      .map((order: any) => [
        <div className="flex items-center gap-2">
          <Checkbox
            style={{ transform: "scale(1.2)" }}
            onChange={(e) =>
              handleCheckboxChange(order.orderId, order, e.target.checked)
            }
            checked={!!checkedOrders[order.orderId]}
          />
          <p>{order.orderId || "-"}</p>
        </div>,
        order.createdAt || "-",
        order.mrName || "-",
        order.pharmacyId?.name || "-",
        order.total || "-",
        <div onClick={() => handleGoDetails(order)} className="flex gap-2">
          <BiMessageDetail color="#7d7d7d" size={20} />
          <p>Details</p>
        </div>,
      ]) ?? [];

  const paginationInfo = {
    currentPage: currentPage,
    itemsPerPage: itemsPerPage,
    totalItems: ordersData || 0,
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  useEffect(() => {
    document.title = "MediRep | Secondary Sale";
  }, []);
  const totalItems: number = ordersData?.data?.total ?? 0;
  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 40, color: "#0755E9" }} spin />
  );
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
                <td style="text-align:start;">${m.medicineId.strength}</td>
                <td style="text-align:start;">${m.quantity}</td>
                <td style="text-align:start;">${m.medicineId.isfrom}</td>
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
  return (
    <>
      <div className="sticky top-0">
        <SearchBar />
      </div>

      <div className="mt-4">
        <div
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          className="bg-secondary md:h-[calc(100vh-129px)] overflow-y-auto h-auto rounded-xl p-4 flex flex-col gap-4"
        >
          <div className="flex flex-wrap justify-between items-center gap-3">
            <p className="text-heading font-medium text-[22px] sm:text-[24px]">
              Secondary Sale
            </p>
            <div className="flex gap-4">
              <div className="w-full md:w-[200px] lg:w-[180px] 2xl:w-[300px]">
                <SearchSelection
                  placeholder="Select MR"
                  options={["All", ...AllMR.map((mr: any) => mr.name)]}
                  value={selectedMR}
                  onChange={(val) => setSelectedMR(val === "All" ? null : val)}
                />
              </div>
              <div className="w-full md:w-[200px] 2xl:w-[300px] lg:w-[180px] md:mt-0 mt-2">
                <SearchDateRange
                  onChange={(range: { start: string; end: string }) => {
                    setSelectedDate(range);
                  }}
                />
              </div>
            </div>
            <div className="flex gap-3 items-center md:w-auto w-full">
              <button className="h-[55px] w-full md:w-[70px] bg-[#E90761]/10 rounded-[6px] gap-3 cursor-pointer flex justify-center items-center">
                <Icon
                  icon="material-symbols-light:assignment-return"
                  className="text-[#E907617A] text-[24px]"
                />
              </button>

              <button
                onClick={handleDownloadSelectedPDF}
                disabled={loading}
                className="h-[55px] w-full md:w-[150px] flex items-center justify-center gap-3 rounded-[6px] bg-[#E5EBF7]"
              >
                {loading ? (
                  <Spin indicator={antIcon} />
                ) : (
                  <>
                    <Icon
                      icon="material-symbols-light:download-2-rounded"
                      className="text-primary text-[24px]"
                    />
                    <p className="text-primary text-base font-medium ml-2">
                      Download
                    </p>
                  </>
                )}
              </button>

              <button className="h-[55px] w-full md:w-[150px] flex items-center justify-center gap-3 rounded-[6px] bg-primary">
                <Icon
                  icon="material-symbols-light:aod-tablet"
                  className="text-white text-[24px]"
                />
                <p className="text-white text-base font-medium ml-2">
                  Dispatch
                </p>
              </button>
            </div>
          </div>
          <div className="bg-[#E5EBF7] rounded-[12px] p-4 2xl:h-[calc(89vh-125px)] lg:h-[calc(90vh-162px)] h-auto">
            <div className="flex justify-between items-center">
              <p className="text-[#7D7D7D] text-sm leading-[100%]">
                Orders List
              </p>
              <Pagination
                currentPage={paginationInfo.currentPage}
                itemsPerPage={paginationInfo.itemsPerPage}
                totalItems={totalItems}
                onPageChange={handlePageChange}
              />
            </div>

            <div
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              className="bg-white border-2 mt-3 border-primary w-full 2xl:h-[calc(70vh-14px)] xl:h-[calc(55vh-13px)] overflow-y-auto h-auto rounded-xl"
            >
              {isFetching ? (
                <div className="flex justify-center mt-5">
                  {" "}
                  <Spin indicator={antIcon} />
                </div>
              ) : (
                <CustomTable titles={titles} data={tableData} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
