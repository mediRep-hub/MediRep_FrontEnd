import { Icon } from "@iconify/react";
import CustomTable from "../../../Components/CustomTable";
import { useEffect } from "react";
import { MonthYearPicker } from "../../../Components/FilterMonthYear";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const titles = [
  "Channel Type",
  "Sales Qty",
  "Sales Value",
  "Contribution %",
  "Avg Discount %",
  "Active MR",
  "Action",
];

const tableDataTitles = [
  [
    "GT",
    "8,500",
    "1,450,000",
    "48%",
    "10%",
    "45",
    <div className="flex gap-2 items-center">
      <Icon icon="iconoir:notes" height="16" width="16" color="#7d7d7d" />
      <p>Details</p>
    </div>,
  ],
  [
    "MT",
    "7,200",
    "1,120,000",
    "52%",
    "8%",
    "38",
    <div className="flex gap-2 items-center">
      <Icon icon="iconoir:notes" height="16" width="16" color="#7d7d7d" />
      <p>Details</p>
    </div>,
  ],
  [
    "LT",
    "9,100",
    "1,680,000",
    "61%",
    "12%",
    "50",
    <div className="flex gap-2 items-center">
      <Icon icon="iconoir:notes" height="16" width="16" color="#7d7d7d" />
      <p>Details</p>
    </div>,
  ],
  [
    "PT",
    "6,750",
    "980,000",
    "44%",
    "6%",
    "32",
    <div className="flex gap-2 items-center">
      <Icon icon="iconoir:notes" height="16" width="16" color="#7d7d7d" />
      <p>Details</p>
    </div>,
  ],
  [
    "XT",
    "10,300",
    "1,920,000",
    "69%",
    "15%",
    "58",
    <div className="flex gap-2 items-center">
      <Icon icon="iconoir:notes" height="16" width="16" color="#7d7d7d" />
      <p>Details</p>
    </div>,
  ],
];

export default function ChannelWiseSale() {
  useEffect(() => {
    document.title = "MediRep | Channel Wise Sale";
  }, []);
  const handleDownloadExcel = () => {
    const exportData = tableDataTitles.map((row) =>
      row.map((cell) => {
        if (typeof cell === "object" && cell?.props) {
          if (cell.props.children) {
            if (Array.isArray(cell.props.children)) {
              return cell.props.children
                .map((child: any) =>
                  typeof child === "string"
                    ? child
                    : child?.props?.children || "",
                )
                .join(" ");
            }
            return cell.props.children;
          }
          return "";
        }
        return cell;
      }),
    );

    const worksheet = XLSX.utils.aoa_to_sheet([titles, ...exportData]);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Channel Wise Sale");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(data, "Channel_Wise_Sale_Report.xlsx");
  };

  return (
    <>
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap lg:flex-nowrap justify-between items-center gap-4">
          <div className="flex flex-wrap items-center gap-4 ">
            <p className="text-heading font-medium text-[22px] sm:text-[24px]">
              Channel Wise Sale
            </p>
            <div className="md:w-[180px] w-full ">
              <MonthYearPicker />
            </div>
          </div>

          <div className="flex flex-wrap w-full md:w-auto sm:flex-nowrap gap-4 items-center">
            <button
              onClick={handleDownloadExcel}
              className="h-[55px] w-full md:w-[160px] bg-[#E5EBF7] rounded-[6px] gap-3 flex justify-center items-center 
           "
            >
              {" "}
              <Icon
                icon="solar:download-broken"
                height="24"
                width="24"
                color="#0755E9"
              />
              <p className="text-primary font-medium">Download</p>
            </button>
          </div>
        </div>{" "}
        <div className="bg-[#E5EBF7]  mt-4 rounded-[12px] p-4 2xl:h-[calc(75.5vh-0px)] xl:h-[calc(64vh-0px)] h-auto ">
          <p className="text-sm text-[#7d7d7d] leading-[100%]">
            Chanel Wise Sale From Distributor
          </p>
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className=" scroll-smooth mt-4 md:gap-0 gap-5 bg-white rounded-lg 2xl:h-[calc(69vh-0px)] xl:h-[calc(54.4vh-0px)] overflow-y-auto scrollbar-none"
          >
            <CustomTable titles={titles} data={tableDataTitles} />
          </div>{" "}
        </div>
      </div>
    </>
  );
}
