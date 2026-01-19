import { Icon } from "@iconify/react";
import CustomTable from "../../Components/CustomTable";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PrimarySaleUpload from "../../Components/PrimarySaleUpload";
import { useQuery } from "@tanstack/react-query";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import dayjs from "dayjs";
import { getAllSECONDARYSales } from "../../api/secondaryServices";
import ReportFilterModal from "../../Components/ReportFilter";
const titles = [
  "Order ID",
  "Order Date",
  "Doctor/Pharmacy Name",
  "Distributor Name",
  "MR Name",
  "Amount",
  "Details",
];

export default function SecondarySale() {
  const [openImport, setOpenImport] = useState(false);
  const [openReportModal, setOpenReportModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    document.title = "MediRep | Secondary Sale";
  }, []);
  const { data, refetch } = useQuery({
    queryKey: ["PrimarySales"],
    queryFn: () => getAllSECONDARYSales(),
    staleTime: 5 * 60 * 1000,
  });

  let AllSales = data?.data?.data;
  console.log("🚀 ~ SecondarySale ~ AllSales:", AllSales);

  let tableData: any = [];
  AllSales?.map((v: any) => {
    tableData.push([
      v.orderId,
      v.createdAt ? dayjs(v.createdAt).format("DD MMM, YYYY") : "-",
      v.pharmacyId?.name || v?.pharmacyName,
      v.distributorName,
      v.mrName,
      <p key={`amount-${v.orderId}`} className="text-[12px]">
        Rs: {v.total}
      </p>,
      <button
        key={`details-${v.orderId}`}
        className="flex gap-2 items-center"
        onClick={() => handleGoDetails(v)}
      >
        <Icon icon="iconoir:notes" height="16" width="16" color="#7d7d7d" />
        Details
      </button>,
    ]);
  });
  const handleGoDetails = (v: any[]) => {
    navigate("/secondarySale/secondarySaleDetails", { state: { order: v } });
  };

  const handleDownloadExcel = () => {
    if (!AllSales || AllSales.length === 0) return;

    setIsDownloading(true);

    try {
      const workbook = XLSX.utils.book_new();

      // =========================
      // SHEET 1: SECONDARY SALE SUMMARY
      // =========================
      const secondarySaleSheetData = AllSales.map((v: any) => ({
        Order_ID: v.orderId,
        Order_Date: v.createdAt
          ? dayjs(v.createdAt).format("DD MMM, YYYY")
          : "-",
        Pharmacy: v.pharmacyId?.name || v.pharmacyName,
        Distributor: v.distributorName,
        MR: v.mrName,
        Total_Amount: v.total,
        Status: v.status || "-",
      }));

      const summarySheet = XLSX.utils.json_to_sheet(secondarySaleSheetData);
      summarySheet["!cols"] = Object.keys(secondarySaleSheetData[0]).map(
        () => ({
          wch: 25,
        }),
      );

      XLSX.utils.book_append_sheet(workbook, summarySheet, "Secondary Sales");

      // =========================
      // SHEET 2: SECONDARY SALE DETAILS
      // =========================
      const secondarySaleDetailData: any[] = [];

      AllSales.forEach((sale: any) => {
        sale?.medicines?.forEach((med: any) => {
          secondarySaleDetailData.push({
            Order_ID: sale.orderId,
            Pharmacy: sale.pharmacyId?.name || sale.pharmacyName,
            Distributor: sale.distributorName,
            MR: sale.mrName,
            Product: med.medicineId?.productName || "-",
            Strength: med.medicineId?.strength || "-",
            Category: med.medicineId?.category || "-",
            Quantity: med.quantity || 0,
            Rate: med.medicineId?.amount || 0,
            Amount: (med.medicineId?.amount || 0) * (med.quantity || 0),
          });
        });
      });

      if (secondarySaleDetailData.length > 0) {
        const detailSheet = XLSX.utils.json_to_sheet(secondarySaleDetailData);
        detailSheet["!cols"] = Object.keys(secondarySaleDetailData[0]).map(
          () => ({
            wch: 25,
          }),
        );
        XLSX.utils.book_append_sheet(
          workbook,
          detailSheet,
          "Secondary Sale Details",
        );
      }

      // =========================
      // DOWNLOAD
      // =========================
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "Secondary_Sales_Report.xlsx");
    } catch (err) {
      console.error("Excel Download Error:", err);
    } finally {
      setIsDownloading(false);
    }
  };
  const handleClose = () => {
    setOpenReportModal(false);
  };
  return (
    <>
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap lg:flex-nowrap justify-between items-start gap-4">
          <p className="text-heading font-medium text-[22px] lg:text-[24px]">
            Secondary Sale
          </p>
          <div className="flex flex-wrap sm:flex-nowrap gap-4 items-center">
            <button
              onClick={() => {
                setOpenImport(true);
              }}
              className="h-[55px] w-full min-w-[172px] bg-white rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
            >
              <Icon
                icon="solar:upload-linear"
                height="24"
                width="24"
                color="#131313"
              />
              <p className="text-heading text-base font-medium">Import</p>
            </button>{" "}
            <button
              onClick={handleDownloadExcel}
              disabled={isDownloading}
              className={`h-[55px] w-full min-w-[172px] rounded-[6px] gap-3 flex justify-center items-center
    ${
      isDownloading
        ? "bg-gray-300 cursor-not-allowed"
        : "bg-[#E5EBF7] cursor-pointer"
    }`}
            >
              {isDownloading ? (
                <p className="text-gray-600 font-medium">Downloading...</p>
              ) : (
                <>
                  <Icon
                    icon="solar:download-linear"
                    height="24"
                    width="24"
                    color="#0755E9"
                  />
                  <p className="text-primary text-base font-medium">Download</p>
                </>
              )}
            </button>
            <button
              onClick={() => {
                setOpenReportModal(true);
              }}
              className="h-[55px] w-full min-w-[192px] bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
            >
              <Icon
                icon="grommet-icons:status-good"
                height="20"
                width="20"
                color="#fff"
              />
              <p className="text-white text-base font-medium">
                Generate Report{" "}
              </p>
            </button>
          </div>
        </div>
        <div
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(76vh-0px)] xl:h-[calc(64vh-0px)] overflow-y-auto scrollbar-none"
        >
          <p className="text-[#7d7d7d] text-sm">
            Distributor Details Stock Report
          </p>
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(68.5vh-0px)] xl:h-[calc(53vh-0px)]  mt-4 overflow-y-auto scrollbar-none"
          >
            <CustomTable titles={titles} data={tableData} />
          </div>
        </div>
        {openImport && (
          <PrimarySaleUpload closeModle={setOpenImport} refetch={refetch} />
        )}
      </div>
      {openReportModal && (
        <>
          <ReportFilterModal close={handleClose} />{" "}
        </>
      )}
    </>
  );
}
