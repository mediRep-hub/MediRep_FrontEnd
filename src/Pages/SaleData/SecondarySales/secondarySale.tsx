import { Icon } from "@iconify/react";
import CustomTable from "../../../Components/CustomTable";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PrimarySaleUpload from "../../../Components/PrimarySaleUpload";
import ReportFilterModal from "../../../Components/ReportFilter";
import { MonthYearPicker } from "../../../Components/FilterMonthYear";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { SearchSelection } from "../../../Components/SearchBar/SearchSelection";

const titles = [
  "MR Name",
  "Region",
  "Area",
  "Brick Name",
  "Products",
  "Target Qty/Value",
  "Total Sale Qty/Value",
  "Discount",
  "Action",
];
const titles22 = [
  "Group Name",
  "Region",
  "Area",
  "No Of Bricks",
  "Active MR",
  "Products",
  "Target Qty/Value",
  "Total Sale Qty/Value",
  "Action",
];

export default function SecondarySale() {
  const [openModelUpload, setOpenUpload] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [openReportModal, setOpenReportModal] = useState(false);
  const [selectTab, setSelectTab] = useState<"Individual Sale" | "Group Sale">(
    "Individual Sale",
  );
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "MediRep | Secondary Sale";
  }, []);

  const handleGoDetails = () => {
    navigate("/secondarySale/secondarySaleDetails", { state: selectTab });
  };

  const handleClose = () => {
    setOpenReportModal(false);
  };
  const tableDataTitles = [
    [
      "Cardio Alpha",
      "Lahore",
      "Canal Road",
      "Brick A",
      "Naunehal Baby Soap - 100 gm, Roghan B...",

      <div>
        <p>Qty: 7500</p>
        <p>Rs: 550000</p>
      </div>,
      <div>
        <p>Qty: 5500</p>
        <p>Rs: 312100</p>
      </div>,
      "30%",
      <div className="flex gap-2 items-center" onClick={handleGoDetails}>
        <Icon icon="iconoir:notes" height="16" width="16" color="#7d7d7d" />
        <p>Details</p>
      </div>,
    ],
    [
      "HealthCare Pharma",
      "Lahore",
      "Shadman",
      "Brick B",
      "Roghan Badam Shirin - 500 ml",

      <div>
        <p>Qty: 6000</p>
        <p>Rs: 420000</p>
      </div>,
      <div>
        <p>Qty: 4800</p>
        <p>Rs: 336000</p>
      </div>,
      "20%",
      <div className="flex gap-2 items-center" onClick={handleGoDetails}>
        <Icon icon="iconoir:notes" height="16" width="16" color="#7d7d7d" />
        <p>Details</p>
      </div>,
    ],
    [
      "LifeLine Traders",
      "Karachi",
      "Clifton",
      "Brick C",
      "Baby Soap - 200 gm",

      <div>
        <p>Qty: 8000</p>
        <p>Rs: 640000</p>
      </div>,
      <div>
        <p>Qty: 7200</p>
        <p>Rs: 576000</p>
      </div>,
      "12%",
      <div className="flex gap-2 items-center" onClick={handleGoDetails}>
        <Icon icon="iconoir:notes" height="16" width="16" color="#7d7d7d" />
        <p>Details</p>
      </div>,
    ],
    [
      "City Medicos",
      "Islamabad",
      "F-6 Markaz",
      "Brick D",
      "Roghan Arq - 100 ml",

      <div>
        <p>Qty: 5000</p>
        <p>Rs: 250000</p>
      </div>,
      <div>
        <p>Qty: 4500</p>
        <p>Rs: 225000</p>
      </div>,
      "10%",
      <div className="flex gap-2 items-center" onClick={handleGoDetails}>
        <Icon icon="iconoir:notes" height="16" width="16" color="#7d7d7d" />
        <p>Details</p>
      </div>,
    ],
    [
      "Good Health Supplies",
      "Peshawar",
      "University Town",
      "Brick E",
      "Baby Oil - 100 ml",

      <div>
        <p>Qty: 4000</p>
        <p>Rs: 200000</p>
      </div>,
      <div>
        <p>Qty: 3500</p>
        <p>Rs: 175000</p>
      </div>,
      "28%",
      <div className="flex gap-2 items-center" onClick={handleGoDetails}>
        <Icon icon="iconoir:notes" height="16" width="16" color="#7d7d7d" />
        <p>Details</p>
      </div>,
    ],
  ];

  const tableDataTitles22 = [
    [
      "Alpha Group",
      "Peshawar",
      "University Town",
      5,
      8,
      "Naunehal Baby Soap - 100 gm, Roghan B...",
      <div>
        <p>Qty: 7500</p>
        <p>Rs: 550000</p>
      </div>,
      <div>
        <p>Qty: 5500</p>
        <p>Rs: 312100</p>
      </div>,
      <div className="flex gap-2 items-center" onClick={handleGoDetails}>
        <Icon icon="iconoir:notes" height="16" width="16" color="#7d7d7d" />
        <p>Details</p>
      </div>,
    ],
    [
      "Beta Group",
      "Lahore",
      "Canal Road",
      4,
      7,
      "Roghan Badam Shirin - 500 ml",
      <div>
        <p>Qty: 6000</p>
        <p>Rs: 420000</p>
      </div>,
      <div>
        <p>Qty: 4800</p>
        <p>Rs: 336000</p>
      </div>,
      <div className="flex gap-2 items-center" onClick={handleGoDetails}>
        <Icon icon="iconoir:notes" height="16" width="16" color="#7d7d7d" />
        <p>Details</p>
      </div>,
    ],
    [
      "Gamma Group",
      "Karachi",
      "Clifton",
      6,
      9,
      "Baby Soap - 200 gm",
      <div>
        <p>Qty: 8000</p>
        <p>Rs: 640000</p>
      </div>,
      <div>
        <p>Qty: 7200</p>
        <p>Rs: 576000</p>
      </div>,
      <div className="flex gap-2 items-center" onClick={handleGoDetails}>
        <Icon icon="iconoir:notes" height="16" width="16" color="#7d7d7d" />
        <p>Details</p>
      </div>,
    ],
    [
      "Delta Group",
      "Islamabad",
      "F-6 Markaz",
      3,
      5,
      "Roghan Arq - 100 ml",
      <div>
        <p>Qty: 5000</p>
        <p>Rs: 250000</p>
      </div>,
      <div>
        <p>Qty: 4500</p>
        <p>Rs: 225000</p>
      </div>,
      <div className="flex gap-2 items-center" onClick={handleGoDetails}>
        <Icon icon="iconoir:notes" height="16" width="16" color="#7d7d7d" />
        <p>Details</p>
      </div>,
    ],
    [
      "Epsilon Group",
      "Lahore",
      "Shadman",
      2,
      4,
      "Baby Oil - 100 ml",
      <div>
        <p>Qty: 4000</p>
        <p>Rs: 200000</p>
      </div>,
      <div>
        <p>Qty: 3500</p>
        <p>Rs: 175000</p>
      </div>,
      <div className="flex gap-2 items-center" onClick={handleGoDetails}>
        <Icon icon="iconoir:notes" height="16" width="16" color="#7d7d7d" />
        <p>Details</p>
      </div>,
    ],
  ];

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
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap w-full xl:flex-nowrap justify-between items-start gap-4">
          <div className="flex flex-wrap w-full gap-4 items-center">
            <p className="text-heading font-medium text-[22px] lg:text-[24px]">
              Secondary Sale
            </p>
            <div className="md:w-[180px] w-full ">
              <MonthYearPicker />
            </div>
          </div>
          <div className="flex flex-wrap lg:flex-nowrap gap-4  items-center">
            <div className="w-full md:w-[250px] lg:w-[250px]">
              <SearchSelection placeholder="     Brick Name" />
            </div>{" "}
            <div className="w-full md:w-[250px] lg:w-[250px]">
              <SearchSelection placeholder="City" />
            </div>{" "}
            <div className="w-full md:w-[250px] lg:w-[250px]">
              <SearchSelection placeholder="Sale Type" />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap-reverse justify-between mt-4 items-start md:items-end">
          <div className="flex gap-2 w-full md:w-auto self-baseline">
            {["Individual Sale", "Group Sale"].map((tab) => (
              <button
                key={tab}
                className={`w-[150px] h-12 rounded-t-lg ${
                  selectTab === tab
                    ? "bg-[#E5EBF7] text-heading"
                    : "bg-white text-[#7d7d7d]"
                }`}
                onClick={() => setSelectTab(tab as typeof selectTab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex  gap-3 mb-4 w-full md:w-auto">
            <button
              onClick={handleDownloadExcel}
              className="h-[55px] bg-white min-w-[60px] rounded-[6px] gap-3 flex justify-center items-center"
            >
              <Icon
                icon="solar:download-broken"
                height="24"
                width="24"
                color="#131313"
                className="rotate-180"
              />
            </button>

            <button
              onClick={() => setOpenUpload(true)}
              className="h-[55px] min-w-[60px] bg-[#E5EBF7] rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
            >
              {" "}
              <Icon
                icon="solar:download-broken"
                height="24"
                width="24"
                color="#0755E9"
              />
            </button>

            <button
              onClick={() => setOpenReportModal(true)}
              className="h-[55px] w-full md:w-[200px] bg-primary rounded-[6px] flex items-center justify-center gap-2"
            >
              <Icon
                icon="mingcute:add-fill"
                height="20"
                width="20"
                color="#fff"
              />
              <p className="text-white text-base md:block hidden font-medium">
                Generate Reports
              </p>
            </button>
          </div>
        </div>

        <div
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className={`rounded-[12px] bg-[#E5EBF7] p-4 2xl:h-[calc(70vh-0px)] xl:h-[calc(50vh-0px)] h-auto ${
            selectTab === "Individual Sale"
              ? "rounded-tl-none"
              : "rounded-tl-[12px]"
          }`}
        >
          <p className="text-[#7d7d7d] text-sm">
            {selectTab == "Individual Sale" ? "Bricks List" : "Groups List"}
          </p>
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(63vh-0px)] xl:h-[calc(40.5vh-0px)] mt-4 overflow-y-auto scrollbar-none"
          >
            <CustomTable
              titles={selectTab == "Individual Sale" ? titles : titles22}
              data={
                selectTab == "Individual Sale"
                  ? tableDataTitles
                  : tableDataTitles22
              }
            />
          </div>
        </div>
        {openImport && <PrimarySaleUpload closeModle={setOpenImport} />}
      </div>
      {openReportModal && (
        <>
          <ReportFilterModal close={handleClose} />{" "}
        </>
      )}
      {openModelUpload && (
        <PrimarySaleUpload
          closeModle={() => {
            setOpenUpload(false);
          }}
        />
      )}
    </>
  );
}
