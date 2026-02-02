import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import CustomTable from "../../../Components/CustomTable";
import { useNavigate } from "react-router-dom";
import PrimarySaleUpload from "../../../Components/PrimarySaleUpload";
import { SearchSelection } from "../../../Components/SearchBar/SearchSelection";

const titles = [
  "ID",
  "Distributors Name",
  "City",
  "Total Primary Qty(CTN)",
  "Total Sale Qty(CTN)",
  "Floor Stock Qty (CTN)",
  "Floor Stock Value",
  "Status",
];

type DistributorRow = [
  number,
  string,
  string,
  number,
  number,
  number,
  number,
  string,
];

const tableData: DistributorRow[] = [
  [11232, "Al-Fatah Distributors", "Karachi", 120, 90, 30, 450000, "Good"],
  [22132, "HealthCare Pharma", "Lahore", 200, 160, 40, 620000, "Below"],
  [334343, "City Medicos", "Islamabad", 150, 110, 40, 510000, "Good"],
  [43412, "LifeLine Traders", "Peshawar", 180, 140, 40, 580000, "Average"],
  [512312, "Good Health Supplies", "Quetta", 100, 70, 30, 390000, "Average"],
];

export default function PrimarySale() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [openModelUpload, setOpenUpload] = useState(false);
  useEffect(() => {
    document.title = "MediRep | Primary Sale";
  }, []);

  const handleDownloadExcel = () => {
    setIsDownloading(true);

    setTimeout(() => {
      try {
        const workbook = XLSX.utils.book_new();

        const excelData = tableData.map((row) => ({
          ID: row[0],
          "Distributor Name": row[1],
          City: row[2],
          "Total Primary Qty (CTN)": row[3],
          "Total Sale Qty (CTN)": row[4],
          "Floor Stock Qty (CTN)": row[5],
          "Floor Stock Value": row[6],
          Status: row[7],
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Primary Sales");

        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });

        const blob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(blob, "Primary_Sales_Report.xlsx");
      } finally {
        setIsDownloading(false);
      }
    }, 0);
  };

  const renderTableData = tableData.map((row) => [
    row[0],
    row[1],
    row[2],
    row[3],
    row[4],
    row[5],
    `Rs ${row[6].toLocaleString()}`,
    <span
      className={`px-2 py-0.5 rounded-sm text-sm font-medium ${
        row[7] === "Good"
          ? "border-[#0BA69C] border-[1px] text-[#0BA69C]"
          : row[7] === "Below"
            ? "border-[#E90761] border-[1px] text-[#E90761]"
            : "border-primary border-[1px] text-primary"
      }`}
    >
      {row[7]}
    </span>,
  ]);
  const navigate = useNavigate();
  const handleGoToDetail = () => {
    navigate("/primarySale/PrimarySaleDetails");
  };

  return (
    <>
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap lg:flex-nowrap justify-between items-start gap-4">
          <p className="text-heading font-medium text-[22px] lg:text-[24px]">
            Primary Sale
          </p>

          <div className="flex flex-wrap lg:flex-nowrap gap-4 items-center">
            {" "}
            <div className="w-full md:w-[250px]">
              <SearchSelection placeholder="Distributor Name" />
            </div>
            <div className="w-full md:w-[250px] ">
              <SearchSelection placeholder="City" />
            </div>
            <div className="flex gap-3 items-center w-full">
              <button
                onClick={handleDownloadExcel}
                disabled={isDownloading}
                className="h-[55px] bg-white min-w-[60px] rounded-[6px] gap-3 flex justify-center items-center"
              >
                <Icon
                  icon="solar:download-linear"
                  height="24"
                  width="24"
                  color="#131313"
                />
              </button>
              <button
                onClick={() => {
                  setOpenUpload(true);
                }}
                className="h-[55px] bg-primary min-w-[60px] cursor-pointer rounded-[6px] gap-3 flex justify-center items-center"
              >
                <Icon
                  icon="solar:upload-linear"
                  height="24"
                  width="24"
                  color="#fff"
                />
              </button>
              <button className="h-[55px] sm:w-[170x] w-full md:w-[142px] min-w-[110px] bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center">
                <Icon
                  icon="grommet-icons:status-good"
                  height="20"
                  width="20"
                  color="#fff"
                />
                <p className="text-white text-base font-medium">POA </p>
              </button>
            </div>
          </div>
        </div>
        <div
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
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
            className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(69vh-0px)] xl:h-[calc(53vh-0px)] mt-4 overflow-y-auto scrollbar-none"
          >
            <CustomTable
              titles={titles}
              data={renderTableData}
              handleGoToDetail={handleGoToDetail}
            />
          </div>
        </div>
      </div>
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
