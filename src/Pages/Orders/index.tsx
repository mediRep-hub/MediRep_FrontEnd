import { LuDownload } from "react-icons/lu";
import CustomTable from "../../Components/CustomTable";
import { useNavigate } from "react-router-dom";
import { BiMessageDetail } from "react-icons/bi";
import { getAllOrders } from "../../api/orderServices";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Checkbox, Spin } from "antd";
import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../../assets/medirep-logo.png";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { notifyError } from "../../Components/Toast";

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
  const [checkedOrders, setCheckedOrders] = useState<{ [key: string]: any }>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const { data: orders } = useQuery({
    queryKey: ["GetOrder"],
    queryFn: () => getAllOrders(),
    staleTime: 5 * 60 * 1000,
  });

  const navigate = useNavigate();

  const handleGODetails = (item: any) => {
    navigate("orderDetails", { state: { order: item } });
  };

  const allOrders = orders?.data;
  let tableData: any = [];

  allOrders?.forEach((v: any) => {
    tableData.push([
      <div className="flex gap-2 items-center">
        <Checkbox
          checked={!!checkedOrders[v.orderId]}
          onChange={(e) =>
            setCheckedOrders({
              ...checkedOrders,
              [v.orderId]: e.target.checked ? v : undefined,
            })
          }
          style={{ transform: "scale(1.2)", marginRight: "10px" }}
        />
        <p>{v?.orderId}</p>
      </div>,
      v?.createdAt ? dayjs(v.createdAt).format("DD MMM, YYYY") : "-",
      v?.mrName,
      v?.customerName,
      v?.strategyName,
      v?.orderType,
      <p className="text-[12px]">
        Rs:<span className="text-sm ml-1">{v?.amount}</span>
      </p>,
      <button
        className="flex gap-2 items-center cursor-pointer"
        onClick={() => handleGODetails(v)}
      >
        <BiMessageDetail size={16} className="inline text-[#7d7d7d] mr-2" />
        <p>Details</p>
      </button>,
    ]);
  });

  const handleDownloadSelectedPDF = async () => {
    const selectedOrders = Object.values(checkedOrders).filter(Boolean);
    if (!selectedOrders.length)
      return notifyError("Select at least one order!");

    setLoading(true);

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      for (let i = 0; i < selectedOrders.length; i++) {
        const order = selectedOrders[i];
        const tempDiv = document.createElement("div");
        tempDiv.style.width = "800px";
        tempDiv.style.padding = "20px";
        tempDiv.style.backgroundColor = "#fff";
        tempDiv.style.position = "fixed"; // ✅ hide off-screen
        tempDiv.style.top = "-9999px"; // ✅ move it out of view

        tempDiv.innerHTML = `
    <div style="font-family:Arial, sans-serif;">
      <div style="display:flex;align-items:center;margin-bottom:20px;">
        <img src="${logo}" style="width:52px;height:auto;margin-right:20px;"/>
        <h2>MediRep Bill Invoice</h2>
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
            (m: any) =>
              `<tr>
                <td style="text-transform:uppercase;">${m.name}</td>
                <td style="text-align:right;">${m.quantity}</td>
                <td style="text-align:right;">Rs.${m.rate}</td>
                <td style="text-align:right;">Rs.${m.amount}</td>
              </tr>`
          )
          .join("")}
      </table>
      <div style="margin-top:20px;text-align:right;">
        <p>Subtotal: Rs.${order.subtotal}</p>
        <p>Tax (10%): Rs.${order.tax}</p>
        <p><strong>Total: Rs.${order.total}</strong></p>
      </div>
      <p style="margin-top:20px;font-weight:bold;">Thank you for your business.</p>
    </div>
  `;

        document.body.appendChild(tempDiv);

        // ✅ Now it's hidden off-screen while still renderable by html2canvas
        const canvas = await html2canvas(tempDiv, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const pageWidth = 210;
        const imgProps = pdf.getImageProperties(imgData);
        const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pdfHeight);

        document.body.removeChild(tempDiv);
      }

      pdf.save("List Of Orders Invoivecs.pdf");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 24, color: "#0755E9" }} spin />
  );
  return (
    <div>
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <p className="text-heading font-medium text-[22px] sm:text-[24px]">
            Orders
          </p>
          <button
            onClick={handleDownloadSelectedPDF}
            disabled={loading}
            className="h-[55px] w-full md:w-[180px] rounded-[6px] gap-3 flex justify-center items-center bg-[#E5EBF7]
            "
          >
            {loading ? (
              <Spin indicator={antIcon} />
            ) : (
              <>
                {" "}
                <LuDownload size={20} className="text-primary" />{" "}
                <p className="text-primary text-base font-medium ml-2">
                  Download
                </p>
              </>
            )}
          </button>
        </div>

        <div className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(90vh-125px)] xl:h-[calc(90vh-162px)] h-auto">
          <p className="text-[#7D7D7D] font-medium text-sm">Orders List</p>
          <div
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(85vh-142px)] xl:h-[calc(65vh-55px)] mt-4 overflow-y-auto scrollbar-none"
          >
            <CustomTable titles={titles} data={tableData} />
          </div>
        </div>
      </div>
    </div>
  );
}
