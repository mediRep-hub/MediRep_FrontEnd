import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Icon } from "@iconify/react";
import CustomTable from "../../../Components/CustomTable";
import ReportFilterModalStatic from "../../../Components/ReportFilter";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const titles = [
  "MR_Name",
  "Brick_Name",
  "Order_Dated ",
  "Pharmacy_Name",
  "Product_Name",
  "Quantity_Sold (Pack)",
  "Sales_Value",
];
const titles22 = [
  "Group Name",
  "Region",
  "Area ",
  "Brick Name",
  "MR Name",
  "Order_Dated ",
  "Pharmacy_Name",
  "Product_Name",
  "Traget Qty/Value",
  "Total Sale Qty/Value",
];
const tableDataTitles22 = [
  [
    "Alpha Group",
    "Peshawar",
    "University Town",
    "Canal Road",
    "Cardio Alpha",
    "2026-01-20",
    "Pharmacy A",
    "Naunehal Baby Soap - 100 gm",
    <div>
      <p>Qty: 7500</p>
      <p>Rs: 550000</p>
    </div>,
    <div>
      <p>Qty: 5500</p>
      <p>Rs: 312100</p>
    </div>,
  ],
  [
    "Beta Group",
    "Lahore",
    "Shadman",
    "Canal Road",
    "HealthCare Pharma",
    "2026-01-18",
    "Pharmacy B",
    "Roghan Badam Shirin - 500 ml",
    <div>
      <p>Qty: 6000</p>
      <p>Rs: 420000</p>
    </div>,
    <div>
      <p>Qty: 4800</p>
      <p>Rs: 336000</p>
    </div>,
  ],
  [
    "Gamma Group",
    "Karachi",
    "Clifton",
    "Clifton",
    "LifeLine Traders",
    "2026-01-19",
    "Pharmacy C",
    "Baby Soap - 200 gm",
    <div>
      <p>Qty: 8000</p>
      <p>Rs: 640000</p>
    </div>,
    <div>
      <p>Qty: 7200</p>
      <p>Rs: 576000</p>
    </div>,
  ],
  [
    "Delta Group",
    "Islamabad",
    "F-6 Markaz",
    "F-6 Markaz",
    "City Medicos",
    "2026-01-21",
    "Pharmacy D",
    "Roghan Arq - 100 ml",
    <div>
      <p>Qty: 5000</p>
      <p>Rs: 250000</p>
    </div>,
    <div>
      <p>Qty: 4500</p>
      <p>Rs: 225000</p>
    </div>,
  ],
  [
    "Epsilon Group",
    "Lahore",
    "Shadman",
    "Shadman",
    "Good Health Supplies",
    "2026-01-20",
    "Pharmacy E",
    "Baby Oil - 100 ml",
    <div>
      <p>Qty: 4000</p>
      <p>Rs: 200000</p>
    </div>,
    <div>
      <p>Qty: 3500</p>
      <p>Rs: 175000</p>
    </div>,
  ],
];
const tableDataTitles = [
  [
    "Cardio Alpha",
    "Canal Road",
    "2026-01-20",
    "Pharmacy A",
    "Naunehal Baby Soap - 100 gm",
    <div>
      <p>Qty: 7500</p>
      <p>Rs: 550000</p>
    </div>,
    <div>
      <p>Qty: 5500</p>
      <p>Rs: 312100</p>
    </div>,
  ],
  [
    "HealthCare Pharma",
    "Shadman",
    "2026-01-18",
    "Pharmacy B",
    "Roghan Badam Shirin - 500 ml",
    <div>
      <p>Qty: 6000</p>
      <p>Rs: 420000</p>
    </div>,
    <div>
      <p>Qty: 4800</p>
      <p>Rs: 336000</p>
    </div>,
  ],
  [
    "LifeLine Traders",
    "Clifton",
    "2026-01-19",
    "Pharmacy C",
    "Baby Soap - 200 gm",
    <div>
      <p>Qty: 8000</p>
      <p>Rs: 640000</p>
    </div>,
    <div>
      <p>Qty: 7200</p>
      <p>Rs: 576000</p>
    </div>,
  ],
  [
    "City Medicos",
    "F-6 Markaz",
    "2026-01-21",
    "Pharmacy D",
    "Roghan Arq - 100 ml",
    <div>
      <p>Qty: 5000</p>
      <p>Rs: 250000</p>
    </div>,
    <div>
      <p>Qty: 4500</p>
      <p>Rs: 225000</p>
    </div>,
  ],
  [
    "Good Health Supplies",
    "University Town",
    "2026-01-20",
    "Pharmacy E",
    "Baby Oil - 100 ml",
    <div>
      <p>Qty: 4000</p>
      <p>Rs: 200000</p>
    </div>,
    <div>
      <p>Qty: 3500</p>
      <p>Rs: 175000</p>
    </div>,
  ],
];

export default function SecondarySaleDetails() {
  const location = useLocation();
  const [openReportModal, setOpenReportModal] = useState(false);
  const handleClose = () => {
    setOpenReportModal(false);
  };
  const selectTab = location.state as "Individual Sale" | "Group Sale";
  useEffect(() => {
    document.title = "MediRep | Secondary Sale Datails";
  }, []);

  const navigate = useNavigate();
  const handleGoToBack = () => {
    navigate("/secondarySale");
  };
  const extractCellText = (cell: any) => {
    if (typeof cell === "string" || typeof cell === "number") return cell;

    if (cell?.props?.children) {
      if (Array.isArray(cell.props.children)) {
        return cell.props.children
          .map((child: any) =>
            typeof child === "string" ? child : child?.props?.children || "",
          )
          .join(" | ");
      }
      return cell.props.children;
    }

    return "";
  };

  const handleDownloadExcel = () => {
    const isIndividual = selectTab === "Individual Sale";

    const headers = isIndividual ? titles : titles22;
    const rows = isIndividual ? tableDataTitles : tableDataTitles22;

    const exportData = rows.map((row) =>
      row.map((cell) => extractCellText(cell)),
    );

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...exportData]);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      isIndividual ? "Individual Sale" : "Group Sale",
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(
      blob,
      `Secondary_Sale_${isIndividual ? "Individual" : "Group"}_Report.xlsx`,
    );
  };

  return (
    <>
      <div>
        <div className="bg-secondary lg:h-[calc(100vh-129px)] h-auto rounded-[12px] py-4 px-4">
          <div className="flex flex-wrap gap-5 justify-between items-start">
            <div className="flex flex-wrap items-center gap-4 ">
              <div
                onClick={handleGoToBack}
                className="w-10 h-10 border-[#7d7d7d] border-[1px] rounded-lg cursor-pointer flex justify-center items-center"
              >
                <FaArrowLeft size={16} color="#000000" />
              </div>
              <p className="text-heading font-medium text-[22px] sm:text-[24px]">
                Secondary Sale
              </p>
            </div>
            <div className="flex gap-3 flex-wrap items-center w-full md:w-auto">
              <button
                onClick={handleDownloadExcel}
                className="h-[55px] w-full md:w-[192px] bg-[#E5EBF7] rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
              >
                <Icon
                  icon="solar:download-broken"
                  height="24"
                  width="24"
                  color="#0755E9"
                />
                <p className="text-primary text-base font-medium">Download</p>
              </button>{" "}
              <button
                onClick={() => {
                  setOpenReportModal(true);
                }}
                className="h-[55px] w-full md:w-[192px] bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
              >
                <Icon
                  icon="mingcute:add-fill"
                  height="20"
                  width="20"
                  color="#fff"
                />
                <p className="text-white text-base font-medium">
                  Generate Reports{" "}
                </p>
              </button>
            </div>
          </div>
          <div className="bg-[#E5EBF7]  mt-4 rounded-[12px] p-4 2xl:h-[calc(75.5vh-0px)] lg:h-[calc(64vh-0px)] h-auto ">
            <p className="text-sm text-[#7d7d7d] leading-[100%]">
              Brick Wise Sale
            </p>
            <div
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              className="scroll-smooth mt-4 md:gap-0 gap-5 bg-white rounded-lg 2xl:h-[calc(69vh-0px)] xl:h-[calc(59vh-0px)] overflow-y-auto scrollbar-none"
            >
              <CustomTable
                titles={selectTab == "Individual Sale" ? titles : titles22}
                data={
                  selectTab == "Individual Sale"
                    ? tableDataTitles
                    : tableDataTitles22
                }
              />
            </div>{" "}
          </div>
        </div>
      </div>
      {openReportModal && (
        <>
          <ReportFilterModalStatic close={handleClose} />{" "}
        </>
      )}
    </>
  );
}
