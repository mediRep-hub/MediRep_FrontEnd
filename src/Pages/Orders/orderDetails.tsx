import { FaArrowLeft } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../../assets/medirep-logo.png";
import { LuDownload } from "react-icons/lu";
import { useEffect, useRef, useState } from "react";
import { Spin } from "antd";
import { Loading3QuartersOutlined } from "@ant-design/icons";
export default function OrderDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { order } = location.state || {};
  const invoiceRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "MediRep | Order Details";
  }, []);

  const handleBack = () => {
    navigate("/orders");
  };

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    setLoading(true);

    try {
      const clone = invoiceRef.current.cloneNode(true) as HTMLDivElement;
      clone.style.width = "800px";
      clone.style.height = "auto";
      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = 210;
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pdfHeight);
      pdf.save(`Invoice-${order?.orderId}.pdf`);
      document.body.removeChild(clone);
    } catch (err) {
      console.error("Error generating PDF:", err);
    } finally {
      setLoading(false);
    }
  };

  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 24, color: "white" }} spin />
  );

  return (
    <div>
      {" "}
      <div className="bg-secondary lg:h-[calc(100vh-129px)] h-auto rounded-[12px] py-4 px-4">
        <div className="flex flex-wrap gap-5 justify-between items-start">
          <div className="flex flex-wrap items-center gap-4 ">
            <div
              onClick={handleBack}
              className="w-10 h-10 border-[#7d7d7d] border-[1px] rounded-lg cursor-pointer flex justify-center items-center"
            >
              <FaArrowLeft size={16} color="#000000" />
            </div>
            <p className="text-heading font-medium text-[22px] sm:text-[24px]">
              Order Details
            </p>
          </div>
          <button
            onClick={handleDownloadPDF}
            className="h-[55px] w-full md:w-[220px] bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
          >
            {loading ? (
              <Spin indicator={antIcon} />
            ) : (
              <>
                <LuDownload size={20} className="text-white" />
                <p className="text-white text-base font-medium">
                  {" "}
                  Download Invoice
                </p>
              </>
            )}
          </button>
        </div>
        <div
          ref={invoiceRef}
          className="bg-[#E5EBF7]  mt-4 rounded-[12px] p-4 2xl:h-[calc(75.5vh-0px)] lg:h-[calc(64vh-0px)] h-auto "
        >
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="scroll-smooth p-4 md:gap-0 gap-5 bg-white border border-primary rounded-lg 2xl:h-[calc(72.2vh-0px)] xl:h-[calc(59vh-0px)] overflow-y-auto scrollbar-none"
          >
            <div className="flex flex-wrap items-center ">
              <div className="md:w-[40%] w-full flex items-center gap-3">
                <img src={logo} className="w-[52px] h-auto " />
                <p className="text-2xl font-medium text-primary">
                  Medi<span className="text-[#FF7631]">Rep</span>
                </p>
              </div>
              <p className="text-heading md:text-[24px] md:w-auto w-full text-center text-[16px] font-medium">
                Bill Invoice
              </p>
            </div>
            <div className="flex flex-wrap gap-2 items-start mt-5 border-b border-primary pb-5">
              <div className="lg:w-[calc(50%-4px)] w-full">
                <div className="flex items-center ">
                  <p className="text-[#7d7d7d] text-xs md:w-[120px] w-[45%]">
                    Order ID:
                  </p>
                  <p className="text-heading text-xs md:w-auto w-[55%]">
                    {order?.orderId}
                  </p>
                </div>
                <div className="flex items-center mt-2">
                  <p className="text-[#7d7d7d] text-xs md:w-[120px] w-[45%]">
                    Pharmacy Name:
                  </p>
                  <p className="text-heading text-xs md:w-auto w-[55%]">
                    {order?.pharmacyId.name}
                  </p>
                </div>{" "}
                <div className="flex items-center mt-2">
                  <p className="text-[#7d7d7d] text-xs md:w-[120px] w-[45%]">
                    Address:
                  </p>
                  <p className="text-heading text-xs md:w-auto w-[55%]">
                    {order?.address}
                  </p>
                </div>{" "}
                <div className="flex items-center mt-2">
                  <p className="text-[#7d7d7d] text-xs md:w-[120px] w-[45%]">
                    MR Name:
                  </p>
                  <p className="text-heading text-xs md:w-auto w-[55%]">
                    {order?.mrName}
                  </p>
                </div>
                <div className="flex items-center mt-2">
                  <p className="text-[#7d7d7d] text-xs md:w-[120px] w-[45%]">
                    Order ID:
                  </p>
                  <p className="text-heading text-xs md:w-auto w-[55%]">
                    {order?.orderId}
                  </p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto w-full">
              <div className="min-w-[700px] md:min-w-full">
                <div className="mt-6 border-y-[1px] border-[#7d7d7d] py-3 grid grid-cols-6 text-xs">
                  <p className="uppercase font-normal">Item Detail</p>
                  <p className="font-normal">Strength</p>
                  <p className="text-end font-normal">Qty</p>
                  <p className="text-end font-normal">Medicine Type</p>
                  <p className="text-end font-normal">Rate</p>
                  <p className="text-end font-normal">Amount</p>
                </div>
                <div className="border-b-[1px] border-[#7d7d7d] w-full">
                  {order?.medicines?.map((med: any, index: number) => (
                    <div
                      key={index}
                      className="grid grid-cols-6 items-center border-b border-gray-200 py-2 text-xs"
                    >
                      <p className="uppercase font-bold">
                        {med.medicineId?.productName || "-"}
                      </p>
                      <p className="font-bold">
                        {med.medicineId?.strength || "-"}
                      </p>
                      <p className="text-end font-bold">{med.quantity ?? 0}</p>
                      <p className="text-end font-bold">
                        {med.medicineId?.category || "-"}
                      </p>
                      <p className="text-end font-bold">
                        Rs.{med.medicineId?.amount?.toLocaleString() || 0}
                      </p>
                      <p className="text-end font-bold">
                        Rs.{(med.medicineId?.amount || 0) * (med.quantity || 0)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className=" flex  justify-end mt-5 ">
              <div className="md:w-1/2 w-full ">
                <div className="flex items-center justify-between ">
                  <p className="text-heading text-xs">Subtotal</p>
                  <p className="text-heading text-xs">Rs.{order?.subtotal}</p>
                </div>{" "}
                <div className="flex mt-4 items-center justify-between pb-2 border-b-[1px] border-[#7d7d7d] ">
                  <p className="text-heading text-xs">Distcount</p>
                  <p className="text-heading text-xs">
                    Rs.{" "}
                    {(order.subtotal * (order.discount / 100)).toLocaleString()}{" "}
                    ({order?.discount}%){" "}
                  </p>
                </div>{" "}
                <div className="flex mt-4 items-center justify-between ">
                  <p className="text-heading text-xs font-bold">Total</p>
                  <p className="text-heading text-xs font-bold">
                    Rs.{order?.total}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-heading text-sm font-bold mt-5">
              Thank you for your business.
            </p>
          </div>{" "}
        </div>
      </div>
    </div>
  );
}
