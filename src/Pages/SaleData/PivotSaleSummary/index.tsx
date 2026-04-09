import { useEffect, useMemo, useState } from "react";
import { MonthYearPicker } from "../../../Components/FilterMonthYear";
import { Icon } from "@iconify/react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { IoMdCloseCircle } from "react-icons/io";
import GroupedTable from "./GroupedTable";
import { useSelector } from "react-redux";

type Column = {
  label: any;
  rowSpan?: number;
  colSpan?: number;
  children?: string[];
};

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
  "Month",
  "Item Description",
  "Opening Balance",
  "Purchase",
  // "Pack",
  "Purchase Bonus",
  "Purchase Return",
  "Purchase Bonus Return",
  "Purchase Total",
  "Purchase Total Bonus",
  "Sale",
  "Sale Bonus",
  "Sale Return",
  "Sale Bonus Return",
  "Total Sale Qty",
  "Total Sale Bonus",
  "Sale Value",
  "Expiry",
  "Adjustment Quantity",
  "Adjustment Bonus",
  "Transfer In",
  "Transfer Out",
  "Availability",
  "Closing",
  "Closing Balance Bonus",
  "Today Sale",
  "Today Return",
  "Day Sale",
  "To Date Sale",
  "To Date Return",
];

const fields222 = [
  "Rate",
  "Pack",
  "Quantity",
  "Value",
  "Gross Sale",
  "Closing Value",
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
  // useEffect(() => {
  //   document.title = "MediRep | Pivot Sales Summary";
  // }, []);
  const [selectedDistributor, setSelectedDistributor] = useState<string>("");
  const [selected, setSelected] = useState<string[]>([...fields, ...fields222]);
  console.log("🚀 ~ PivotSaleSummary ~ salesData:", salesData);

  useEffect(() => {
    if (selected.length === fields.length - 1) {
      setSelected(fields);
    }
    if (!selected.includes("Opening Balance")) {
      setSelected((prev) => prev.filter((f) => f !== "Value"));
    }
  }, [selected]);
  const handleSelect = (field: string) => {
    // ✅ If "All" clicked
    if (field === "All") {
      if (selected.includes("All")) {
        // unselect all
        setSelected([]);
      } else {
        // select all fields
        setSelected(fields);
      }
      return;
    }

    // normal toggle
    if (selected.includes(field)) {
      setSelected(selected.filter((item) => item !== field));
    } else {
      setSelected([...selected, field]);
    }
  };

  const clearFilters = () => {
    setSelected([]);
  };
  const clearFilters22 = () => {
    setSelected([]);
  };
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const parseDMY = (dateStr: string) => {
    const [day, month, year] = dateStr.split("/");
    return new Date(Number(year), Number(month) - 1, Number(day));
  };
  const getDistributor = (item: any) => {
    return (
      item["distributor"] ||
      item["Distributor Name"] ||
      item["Distributor_Name"] ||
      ""
    );
  };
  const filteredData = useMemo(() => {
    return (salesData || []).filter((item: any) => {
      const itemDate = parseDMY(item["Date From"]);

      const dateOk =
        !fromDate || !toDate
          ? true
          : itemDate >= fromDate && itemDate <= toDate;

      const distributorValue = getDistributor(item);

      const distributorOk =
        !selectedDistributor || distributorValue === selectedDistributor;

      return dateOk && distributorOk;
    });
  }, [salesData, fromDate, toDate, selectedDistributor]);

  const saleChildren = [
    "Sale Bonus",
    "Sale Return",
    "Sale Bonus Return",
    "Total Sale Qty",
    "Total Sale Bonus",
    "Sale Value",
  ];

  const purchaseChildren = [
    "Purchase Bonus",
    "Purchase Return",
    "Purchase Bonus Return",
    "Purchase Total",
    "Purchase Total Bonus",
  ];

  const closingChildren = ["Closing Balance Bonus", "Closing Value"];
  const orderedSelected = [
    ...selected.filter((f) => f === "Month"),
    ...selected.filter((f) => f === "Distributor Name"),
    ...selected.filter((f) => f === "Item Description"),
    ...selected.filter((f) => f === "Rate"), // 👈 yahan control
    ...selected.filter((f) => f === "Pack"),

    ...selected.filter(
      (f) =>
        ![
          "All",
          "Month",
          "Distributor Name",
          "Item Description",
          "Rate",
          "Pack",
          "Adjustment Quantity",
          "Adjustment Bonus",
          ...saleChildren,
          ...purchaseChildren,
          ...closingChildren,
        ].includes(f),
    ),
     ...selected.filter((f) => f === "Transfer In"),
    ...selected.filter((f) => f === "Transfer Out"),
    ...selected.filter((f) => f === "Adjustment Quantity"),
    ...selected.filter((f) => f === "Adjustment Bonus"),
  ];
  const mapDataToRows = (apiData: any[]) => {
    return apiData.map((item) =>
      orderedSelected.flatMap((col) => {
        if (col === "Month") return item["Date From"] || "-";
        if (col === "Distributor Name") return item["distributor"] || "-";
        if (col === "Item Description") return item["Item Description"] || "-";
        if (col === "Rate") return [item["Rate"] || "-"];
        if (col === "Pack") return item["Pack"] || "-";
        if (col === "Today Sale") return item["Today Sale"] || "-";
        if (col === "Today Return") return item["Today Return"] || "-";

        // ✅ Opening Balance
        if (col === "Opening Balance") { 
          return [
            item["Opening Balance Quantity"] || "-",
            ...(selected.includes("Value")
              ? [item["Opening Balance Value"] || "-"]
              : []),
          ];
        }

        // ✅ Purchase (ONLY ONCE)
        if (col === "Purchase") {
          return [
            item["Purchase Quantity"] || "-",
            ...(selected.includes("Purchase Bonus")
              ? [item["Purchase Bonus"] || "-"]
              : []),
            ...(selected.includes("Purchase Return")
              ? [item["Purchase Return Quantity"] || "-"]
              : []),
            ...(selected.includes("Purchase Bonus Return")
              ? [item["Purchase Bonus Return"] || "-"]
              : []),
            ...(selected.includes("Purchase Total")
              ? [item["Purchase Total Quantity"] || "-"]
              : []),
            ...(selected.includes("Purchase Total Bonus")
              ? [item["Purchase Total Bonus"] || "-"]
              : []),
          ];
        }

        // ✅ Sale (ONLY ONCE — MAIN FIX)
        if (col === "Sale") {
          return [
            item["Sale Quantity"] || "-",
            ...(selected.includes("Sale Bonus")
              ? [item["Sale Bonus"] || "-"]
              : []),
            ...(selected.includes("Sale Return")
              ? [item["Sale Return"] || "-"]
              : []),
            ...(selected.includes("Sale Bonus Return")
              ? [item["Sale Bonus Return"] || "-"]
              : []),
            ...(selected.includes("Total Sale Qty")
              ? [item["Total Sale Quantity"] || "-"]
              : []),
            ...(selected.includes("Total Sale Bonus")
              ? [item["Total Sale Bonus"] || "-"]
              : []),
            ...(selected.includes("Sale Value")
              ? [item["Sale Value"] || "-"]
              : []),
          ];
        }
        if (col === "Adjustment Quantity")
          return item["Adjustment Quantity"] || "-";
        if (col === "Adjustment Bonus") return item["Adjustment Bonus"] || "-";


         if (col === "Transfer In") return item["Transfer In"] || "-";
          if (col === "Transfer Out") return item["Transfer Out"] || "-";

        if (col === "Closing") {
          return [
            item["Closing Balance Quantity"] || "-", // Balance
            ...(selected.includes("Closing Balance Bonus")
              ? [item["Closing Balance Bonus"] || "-"]
              : []),
            ...(selected.includes("Closing Value")
              ? [item["Closing Value"] || "-"] // ✅ FIXED
              : []),
          ];
        }

        return [];
      }),
    );
  };

  const rows = mapDataToRows(filteredData || []);

  const columns: Column[] = orderedSelected.flatMap((col): Column[] => {
    if (col === "Month") return [{ label: "Month", rowSpan: 2 }];
    if (col === "Distributor Name") {
      return [
        {
          label: (
            <select
              value={selectedDistributor}
              onChange={(e) => setSelectedDistributor(e.target.value)}
              className="bg-transparent border-none outline-none text-sm font-medium"
            >
              <option value="">Distributor_Name </option>
              <option value="Abdullah Enterprises - Chakwal">
                Abdullah Enterprises - Chakwal
              </option>
              <option value="Al-Fateh Medicine Co - Burewala">
                Al-Fateh Medicine Co - Burewala
              </option>
              <option value="AL Aziz Distributors - Sargodha">
                AL Aziz Distributors - Sargodha
              </option>
              <option value="Al Qamar">Al Qamar</option>
              <option value="Drug Services">Drug Services</option>
              <option value="Allied Enterprises">Allied Enterprises</option>

            </select>
          ),
          rowSpan: 2,
        },
      ];
    }
    if (col === "Item Description")
      return [{ label: "Item Description", rowSpan: 2 }];
    if (col === "Rate") return [{ label: "Rate", rowSpan: 2 }];
    if (col === "Pack") return [{ label: "Pack", rowSpan: 2 }];
    if (col === "Today Sale") return [{ label: "Today Sale", rowSpan: 2 }];
    if (col === "Today Return") return [{ label: "Today Return", rowSpan: 2 }];
    if (col === "Transfer In") return [{ label: "Transfer In", rowSpan: 2 }];
    if (col === "Transfer Out") return [{ label: "Transfer Out", rowSpan: 2 }];
    if (col === "Adjustment Quantity")
      return [{ label: "Adjustment Quantity", rowSpan: 2 }];
    if (col === "Adjustment Bonus")
      return [{ label: "Adjustment Bonus", rowSpan: 2 }];

    // if (col === "Pack") return [{ label: "Pack", rowSpan: 2 }];

    // ✅ Opening Balance
    if (col === "Opening Balance") {
      return [
        {
          label: "Opening Balance",
          colSpan: selected.includes("Value") ? 2 : 1,
          children: ["Qty", ...(selected.includes("Value") ? ["Value"] : [])],
        },
      ];
    }

    // ✅ Purchase (ONLY ONCE)
    if (col === "Purchase") {
      return [
        {
          label: "Purchase / Receipt & Return",
          colSpan:
            1 +
            (selected.includes("Purchase Bonus") ? 1 : 0) +
            (selected.includes("Purchase Return") ? 1 : 0) +
            (selected.includes("Purchase Bonus Return") ? 1 : 0) +
            (selected.includes("Purchase Total") ? 1 : 0) +
            (selected.includes("Purchase Total Bonus") ? 1 : 0),

          children: [
            "Purchase",
            ...(selected.includes("Purchase Bonus") ? ["P.Bonus"] : []),
            ...(selected.includes("Purchase Return") ? ["Return"] : []),
            ...(selected.includes("Purchase Bonus Return")
              ? ["Bonus Return"]
              : []),
            ...(selected.includes("Purchase Total") ? ["Purchase Total"] : []),
            ...(selected.includes("Purchase Total Bonus")
              ? ["Purchase Total Bonus"]
              : []),
          ],
        },
      ];
    }

    // ✅ Sale (ONLY ONCE — FIXED)
    if (col === "Sale") {
      return [
        {
          label: "Sale / Net Sale & Return",
          colSpan:
            1 +
            (selected.includes("Sale Bonus") ? 1 : 0) +
            (selected.includes("Sale Return") ? 1 : 0) +
            (selected.includes("Sale Bonus Return") ? 1 : 0) +
            (selected.includes("Total Sale Qty") ? 1 : 0) +
            (selected.includes("Total Sale Bonus") ? 1 : 0) +
            (selected.includes("Sale Value") ? 1 : 0),

          children: [
            "Sale",
            ...(selected.includes("Sale Bonus") ? ["S.Bonus"] : []),
            ...(selected.includes("Sale Return") ? ["Sale Return"] : []),
            ...(selected.includes("Sale Bonus Return")
              ? ["Sale Bonus Return"]
              : []),
            ...(selected.includes("Total Sale Qty") ? ["Total Sale Qty"] : []),
            ...(selected.includes("Total Sale Bonus")
              ? ["Total Sale Bonus"]
              : []),
            ...(selected.includes("Sale Value") ? ["Sale Value"] : []),
          ],
        },
      ];
    }
    if (col === "Closing") {
      return [
        {
          label: "Closing",
          colSpan:
            1 +
            (selected.includes("Closing Balance Bonus") ? 1 : 0) +
            (selected.includes("Closing Value") ? 1 : 0),

          children: [
            "Balance",
            ...(selected.includes("Closing Balance Bonus") ? ["Bonus"] : []),
            ...(selected.includes("Closing Value") ? ["Value"] : []),
          ],
        },
      ];
    }

    return [];
  });

  return (
    <>
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap lg:flex-nowrap justify-between items-center gap-4">
          <div className="flex w-full md:w-auto md:flex-nowrap justify-start md:justify-between lg:justify-start flex-wrap items-center gap-4 ">
            <p className="text-heading font-medium text-[22px] sm:text-[24px]">
              Pivot Sales Summary
            </p>
            <div className="md:w-[180px] w-full">
              <MonthYearPicker
                onChange={(range) => {
                  setFromDate(range.startDate);
                  setToDate(range.endDate);
                }}
              />
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
            <GroupedTable columns={columns} data={rows} />
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
                  onClick={() => handleSelect(field)}
                  className={`border-primary border flex gap-3 items-center bg-white p-4 rounded-md cursor-pointer ${
                    selected.includes(field) ? "bg-blue-100" : ""
                  }`}
                >
                  <input
                    className="cursor-pointer"
                    type="checkbox"
                    checked={selected.includes(field)}
                    onChange={() => handleSelect(field)}
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
