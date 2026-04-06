import { useEffect, useState } from "react";
import { MonthYearPicker } from "../../../Components/FilterMonthYear";
import { Icon } from "@iconify/react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { IoMdCloseCircle } from "react-icons/io";
import GroupedTable from "./GroupedTable";
import { useSelector } from "react-redux";

const titles = [
  "Month",
  "Distributor_Name",
  "Brick ID",
  "Brick Name",
  "Chemist Code",
  "Chemist Name",
  "Product Code",
  "Product Name",
  "Wimits Product Name",
  "Group",
  "Doctor Name ",
  "Activity Type",
  "TM Name",
  "SM Name",
  "NSM Name",
  "TP",
  "Sales Qty",
  "Sale Return",
  "Gross Sale Qty",
  "Gross Value",
  "Disc %",
  "Disc Value",
  "Bonus Qty",
  "Bonus Amount",
  "Activity Amount",
  "Net Value",
];

const tableDataTitles = [
  [
    "Jan, 2026",
    "Drug Services & Zaheer Pharma",
    "1011601",
    "Ali Pur",

    "468066",
    "GREEN HILLS PHARMACY",
    "075039",
    "VALTA-AM 5/160MG TABS",
    "VALTA-AM 5MG/160MG TAB",
    "GM",
    "-",
    "-",
    " MR UZAIR ",
    "MR WASEEM MAQBOOL",
    " WAHEED ASLAM",
    "345",
    "1",
    "-",
    "1",
    "262",
    "-",
    "-",
    "-",
    "-",
    "-",
    "262",
  ],
];
const fields = [
  "All",
  "Distributor Name",
  "Brick ID",
  "Brick Name",
  "Chemist Code",
  "Chemist Name",
  "Product Code",
  "Distributor Product Name",
  "Wimits Product Name",
  "Group",
  "Doctor Name",
  "Activity Type",
  "TM Name",
  "SM Name",
  "ASM Name",
  "NSM Name",
];

const fields222 = [
  "All",
  "TP",
  "Sales Qty",
  "Sale Return",
  "Gross Sale Qty",
  "Gross Value",
  "Disc %",
  "Disc Value",
  "Bonus Qty",
  "Bonus Amount",
  "Activity Amount",
  "Net Value",
  "Quarters",
  "Years",
];

export default function PivotSaleSummary() {
  const [generateReport, setGenerateReport] = useState(false);
  const [animate, setAnimate] = useState(false);
  const { salesData } = useSelector((state: any) => state.user);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleDownloadExcel = () => {
    const worksheetData = [titles, ...tableDataTitles];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Summary");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "Sales_Summary.xlsx");
  };
  useEffect(() => {
    document.title = "MediRep | Pivot Sales Summary";
  }, []);

  const [selected, setSelected] = useState<string[]>([]);
  const [selected22, setSelected22] = useState<string[]>([]);

  const handleSelect = (field: string) => {
    if (selected.includes(field)) {
      setSelected(selected.filter((item) => item !== field));
    } else {
      setSelected([...selected, field]);
    }
  };

  const handleSelect22 = (field: string) => {
    if (selected22.includes(field)) {
      setSelected22(selected22.filter((item) => item !== field));
    } else {
      setSelected22([...selected22, field]);
    }
  };

  const clearFilters = () => {
    setSelected([]);
  };
  const clearFilters22 = () => {
    setSelected([]);
  };

  const addSpace = "\u00A0\u00A0\u00A0\u00A0\u00A0";
  const mapDataToRows = (apiData: any[]) => {
    return apiData.map((item) => [
      // Basic Info
      item["Date From"] || "-",
      item["distributor"] || "-",

      item["Item Description"] || "-",
      item["Rate"] || "-",
      item["Pack"] || "-",

      // Opening Balance
      item["Opening Balance Quantity"] || "-",
      item["Opening Balance Value"] || "-",

      item["Purchase Quantity"] || "-",
      item["Purchase Bonus"] || "-",
      item["Purchase Return Quantity"] || "-",
      item["Purchase Bonus Return"] || "-",
      `${item["Purchase Total Quantity"] || "-"} ${addSpace} ${item["Purchase Total Bonus"] || "-"}`,
      // Sale / Net Sale & Return
      item["Gross Sale"] || "-",
      item["Gross Return"] || "-",
      item["Bonus Claim"] || "-",
      item["Sale Quantity"] || "-",
      item["Sale Bonus"] || "-",
      item["Sale Return"] || "-",
      item["Sale Bonus Return"] || "-",
      item["Total Sale Quantity"] || "-",
      item["Total Sale Bonus"] || "-",
      item["Sale Value"] || "-",

      // Expiry & Adjustment

      item["Expiry"] || "-",
      `${item["Adjustment Quantity"] || "-"} ${addSpace} ${item["Adjustment Bonus"] || "-"}`,

      // Transfer
      item["Transfer In"] || "-",
      item["Transfer Out"] || "-",

      // Availability
      item["Avaialbility Current"] || "-",
      item["Avaialbility Total"] || "-",

      // Closing

      `${item["Closing Balance Quantity"] || "-"} ${addSpace} ${item["Closing Balance Bonus"] || "-"}`,

      item["Closing Value"] || "-",

      // Today
      item["Today Sale"] || "-",
      item["Today Return"] || "-",
         item["Day Sale"] || "-",
      item["Day Sale Value"] || "-",

      // To Date
      item["To Date Sale"] || "-",
      item["To Date Return"] || "-",
    ]);
  };

  const rows = mapDataToRows(salesData || []);

  return (
    <>
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap lg:flex-nowrap justify-between items-center gap-4">
          <div className="flex w-full md:w-auto md:flex-nowrap justify-start md:justify-between lg:justify-start flex-wrap items-center gap-4 ">
            <p className="text-heading font-medium text-[22px] sm:text-[24px]">
              Pivot Sales Summary
            </p>
            <div className="md:w-[180px] w-full">
              <MonthYearPicker />
            </div>
          </div>

          <div className="flex flex-wrap w-full md:w-auto sm:flex-nowrap gap-4 items-center">
            <button
              onClick={handleDownloadExcel}
              className="h-[55px] w-full md:w-[140px] lg:w-[180px] bg-[#E5EBF7] rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
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
            <button
              onClick={() => {
                setGenerateReport(true);
              }}
              className="h-[55px] w-full md:w-[170px] lg:w-[200px] bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
            >
              <Icon
                icon="mingcute:add-fill"
                height="20"
                width="20"
                color="#fff"
              />
              <p className="text-white font-medium">Generate Reports</p>
            </button>
          </div>
        </div>{" "}
        <div className="bg-[#E5EBF7]  mt-4 rounded-[12px] p-4 2xl:h-[calc(75.5vh-0px)] xl:h-[calc(64vh-0px)] h-auto ">
          <p className="text-sm text-[#7d7d7d] leading-[100%]">
            Stock Movement Report
          </p>
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="scroll-smooth mt-4 md:gap-0 gap-5 bg-white rounded-lg 2xl:h-[calc(69vh-0px)] xl:h-[calc(54.4vh-0px)]  overflow-y-auto scrollbar-none"
          >
            {/* <CustomTable titles={titles} data={tableDataTitles} /> */}
            <GroupedTable
              columns={[
                { label: "Month", rowSpan: 2 },
                { label: "Distributor_Name", rowSpan: 2 },

                { label: "Item Description", rowSpan: 2 },
                { label: "Rate", rowSpan: 2 },
                { label: "Pack", rowSpan: 2 },

                {
                  label: "Opening Balance",
                  colSpan: 2,
                  children: ["Qty", "Value"],
                },
                {
                  label: "Purchase / Receipt & Return",
                  colSpan: 5,
                  children: [
                    "Purchase",
                    "Bonus",
                    "Return",
                    "Bonus Return",
                    "Total",
                  ],
                },
                { label: "Gross Sale", rowSpan: 2 },
                { label: "Gross Return", rowSpan: 2 },
                { label: "Bonus Claim", rowSpan: 2 },

                {
                  label: "Sale / Net Sale & Return",
                  colSpan: 7,
                  children: [
                    "Sale",
                    "Bonus",
                    "Sale Return",
                    "Sale Bonus Return",
                    "Total Sale Qty",
                    "Total Sale Bonus",
                    "Total Sale Value",
                  ],
                },
                { label: "Expiry", rowSpan: 2 },
                { label: "Adjustment", rowSpan: 2 },
                {
                  label: "Transfer",
                  colSpan: 2,
                  children: ["In", "Out"],
                },
                {
                  label: "Availability",
                  colSpan: 2,
                  children: ["Current", "Total"],
                },
                {
                  label: "Closing",
                  colSpan: 2,
                  children: ["Balance", "Value"],
                },
                { label: "Today Sale", rowSpan: 2 },
                { label: "Today Return", rowSpan: 2 },
                { label: "Day Sale", rowSpan: 2 },
                { label: "Day Sale Value", rowSpan: 2 },
                {
                  label: "To Date",
                  colSpan: 2,
                  children: ["Sale", "Return"],
                },
              ]}
              data={rows}
            />
          </div>{" "}
        </div>
      </div>
      {generateReport && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-end items-center z-50">
          <div
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className={`bg-white
          rounded-xl md:rounded-tl-xl md:rounded-bl-xl md:rounded-tr-none md:rounded-br-none
          xl:mx-0 mx-5 md:mx-0
          w-[800px] h-[90vh] md:h-[100vh] overflow-y-auto
          xl:p-6 p-4 shadow-xl relative
          transform transition-transform duration-500 ease-in-out
          ${animate ? "translate-x-0" : "translate-x-full"}
        `}
          >
            <div className="flex items-center justify-between">
              <p className="text-[24px] text-heading capitalize font-semibold">
                Select Fields
              </p>
              <div className="h-[35px] group w-[35px] p-2 rounded-full  hover:shadow-[rgba(99,99,99,0.25)_0px_4px_12px_2px] flex items-center justify-center">
                <div className="group-hover:bg-white">
                  <IoMdCloseCircle
                    size={24}
                    onClick={() => setGenerateReport(false)}
                    className="cursor-pointer text-primary"
                  />
                </div>
              </div>
            </div>{" "}
            <div className="flex items-center mt-10 justify-between">
              <p className="text-[12px] text-heading font-normal">
                Choose Fields to add to report
              </p>

              <p
                onClick={clearFilters}
                className="text-[12px] text-[#0000FF] underline font-normal cursor-pointer"
              >
                Clear Filters
              </p>
            </div>
            <div
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              className="bg-[#E5EBF7] h-[31vh] overflow-y-auto rounded-xl w-full p-4 mt-4 grid-cols-1 grid md:grid-cols-3 gap-4"
            >
              {fields.map((field, index) => (
                <div
                  key={index}
                  onClick={() => handleSelect(field)}
                  className={`border-primary border flex gap-3 items-center bg-white p-4 rounded-md cursor-pointer ${
                    selected.includes(field) ? "bg-blue-100" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    className="cursor-pointer"
                    checked={selected.includes(field)}
                    onChange={() => handleSelect(field)}
                  />

                  <p className="text-sm text-[#131313]">{field}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center mt-10 justify-between">
              <p className="text-[12px] text-heading font-medium">
                Choose Fields to add to report
              </p>

              <p
                onClick={clearFilters22}
                className="text-[12px] text-[#0000FF] underline font-normal cursor-pointer"
              >
                Clear Filters
              </p>
            </div>
            <div
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              className="bg-[#E5EBF7] h-[31vh] overflow-y-auto rounded-xl w-full p-4 mt-4 grid-cols-1 grid md:grid-cols-3 gap-4"
            >
              {fields222.map((field, index) => (
                <div
                  key={index}
                  onClick={() => handleSelect22(field)}
                  className={`border-primary border flex gap-3 items-center bg-white p-4 rounded-md cursor-pointer ${
                    selected22.includes(field) ? "bg-blue-100" : ""
                  }`}
                >
                  <input
                    className="cursor-pointer"
                    type="checkbox"
                    checked={selected22.includes(field)}
                    onChange={() => handleSelect22(field)}
                  />

                  <p className="text-sm text-[#131313]">{field}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 items-center mt-10">
              <button
                onClick={() => setGenerateReport(false)}
                className="h-[56px] rounded-md cursor-pointer bg-[#F2FAFD] w-[120px]"
              >
                Cancel
              </button>{" "}
              <button
                onClick={() => setGenerateReport(false)}
                className="h-[56px] rounded-md bg-[#0755E9] text-white cursor-pointer w-full"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
