import { useEffect, useMemo, useState } from "react";
import { MonthYearPicker } from "../../../Components/FilterMonthYear";
import { Icon } from "@iconify/react";
import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
import { IoMdCloseCircle } from "react-icons/io";
import GroupedTable from "./GroupedTable";
import { useSelector } from "react-redux";
import {
  PivotSalesData,
  PivotSalesData2,
  purchaseChildren,
  saleChildren,
} from "../../../utils/validation";

type Column = {
  label: any;
  rowSpan?: number;
  colSpan?: number;
  children?: string[];
};

export default function PivotSaleSummary() {
  const [generateReport, setGenerateReport] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [itemSearch, setItemSearch] = useState("");
  const [selectedDistributor, setSelectedDistributor] = useState<string>("");
  const [selected, setSelected] = useState<string[]>([
    ...PivotSalesData,
    ...PivotSalesData2,
  ]);
  const { salesData } = useSelector((state: any) => state.user);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleDownloadExcel = () => {
    if (!rows.length) return;

    // ✅ Prepare headers (same as table)
    const headerRow: string[] = [];

    orderedSelected.forEach((col) => {
      if (col === "Month") headerRow.push("Month");
      else if (col === "Distributor Name") headerRow.push("Distributor Name");
      else if (col === "Item Description") headerRow.push("Item Description");
      else if (col === "Rate") headerRow.push("Rate");
      else if (col === "Pack") headerRow.push("Pack");
      else if (col === "Today Sale") headerRow.push("Today Sale");
      else if (col === "Today Return") headerRow.push("Today Return");
      // Opening Balance
      else if (col === "Opening Balance") {
        headerRow.push("Opening Qty");
        if (selected.includes("Value")) {
          headerRow.push("Opening Value");
        }
      }

      // Purchase
      else if (col === "Purchase") {
        headerRow.push("Purchase Qty");
        if (selected.includes("Purchase Bonus"))
          headerRow.push("Purchase Bonus");
        if (selected.includes("Purchase Return"))
          headerRow.push("Purchase Return");
        if (selected.includes("Purchase Bonus Return"))
          headerRow.push("Purchase Bonus Return");
        if (selected.includes("Purchase Total"))
          headerRow.push("Purchase Total");
        if (selected.includes("Purchase Total Bonus"))
          headerRow.push("Purchase Total Bonus");
      }

      // Sale
      else if (col === "Sale") {
        headerRow.push("Sale Qty");
        if (selected.includes("Sale Bonus")) headerRow.push("Sale Bonus");
        if (selected.includes("Sale Return")) headerRow.push("Sale Return");
        if (selected.includes("Sale Bonus Return"))
          headerRow.push("Sale Bonus Return");
        if (selected.includes("Total Sale Qty"))
          headerRow.push("Total Sale Qty");
        if (selected.includes("Total Sale Bonus"))
          headerRow.push("Total Sale Bonus");
        if (selected.includes("Sale Value")) headerRow.push("Sale Value");
      }

      // Adjustment
      else if (col === "Adjustment Quantity")
        headerRow.push("Adjustment Quantity");
      else if (col === "Adjustment Bonus") headerRow.push("Adjustment Bonus");
      // Transfer
      else if (col === "Transfer In") headerRow.push("Transfer In");
      else if (col === "Transfer Out") headerRow.push("Transfer Out");
      else if (col === "Availability Current")
        headerRow.push("Availability Current");
      else if (col === "Availability Total")
        headerRow.push("Availability Total");
      else if (col === "To Date Sale") headerRow.push("To Date Sale");
      else if (col === "To Date Return") headerRow.push("To Date Return");
      // Closing
      else if (col === "Closing") {
        headerRow.push("Closing Qty");
        if (selected.includes("Closing Balance Bonus"))
          headerRow.push("Closing Bonus");
        if (selected.includes("Closing Value")) headerRow.push("Closing Value");
      }
    });

    // ✅ Combine header + rows
    const worksheetData = [headerRow, ...rows];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // 👇 1. HEADER STYLE (pehle)
    headerRow.forEach((_, colIndex) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: colIndex });

      if (!worksheet[cellAddress]) {
        worksheet[cellAddress] = { t: "s", v: headerRow[colIndex] };
      }

      worksheet[cellAddress].s = {
        alignment: { horizontal: "center", vertical: "center" },
        font: { color: { rgb: "000000" }, bold: true },
        fill: { patternType: "solid", fgColor: { rgb: "F2F2F2" } },
      };
    });

    // 👇 2. DATA CENTER ALIGNMENT (yahan add karo)
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "");

    for (let row = 1; row <= range.e.r; row++) {
      for (let col = 0; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        const cell = worksheet[cellAddress];

        if (cell) {
          cell.s = {
            alignment: {
              horizontal: "center",
              vertical: "center",
            },
          };
        }
      }
    }

    // 👇 3. phir workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pivot Sales");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "Pivot_Sales_Report.xlsx");
  };

  useEffect(() => {
    if (selected.length === PivotSalesData.length - 1) {
      setSelected(PivotSalesData);
    }
    // if (!selected.includes("Opening Balance")) {
    //   setSelected((prev) => prev.filter((f) => f !== "Value"));
    // }
  }, [selected]);
  const isAllSelected = selected.includes("All");

  const handleSelect = (field: string) => {
    // ✅ ALL logic
    if (field === "All") {
      if (isAllSelected) {
        setSelected([]);
      } else {
        setSelected([...PivotSalesData, ...PivotSalesData2]);
      }
      return;
    }

    // ❌ agar All selected hai to baqi kuch na ho
    if (isAllSelected) return;

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

      // 🔥 NEW: Item Description filter
      const itemOk =
        !itemSearch ||
        item["Item Description"]
          ?.toLowerCase()
          .includes(itemSearch.toLowerCase());

      return dateOk && distributorOk && itemOk;
    });
  }, [salesData, fromDate, toDate, selectedDistributor, itemSearch]);
  console.log("🚀 ~ PivotSaleSummary ~ filteredData...:", filteredData);

  const closingChildren = ["Closing Balance Bonus", "Closing Value"];
  const orderedSelected = [
    ...selected.filter((f) => f === "Month"),
    ...selected.filter((f) => f === "Distributor Name"),
    ...selected.filter((f) => f === "Item Description"),
    ...selected.filter((f) => f === "Rate"),
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
          "Transfer In",
          "Transfer Out",
          "Availability Current",
          "Availability Total",
          "To Date Sale",
          "To Date Return",
          ...saleChildren,
          ...purchaseChildren,
          ...closingChildren,
        ].includes(f),
    ),
    ...selected.filter((f) => f === "Transfer In"),
    ...selected.filter((f) => f === "Transfer Out"),
    ...selected.filter((f) => f === "Availability Current"),
    ...selected.filter((f) => f === "Availability Total"),
    ...selected.filter((f) => f === "To Date Sale"),
    ...selected.filter((f) => f === "To Date Return"),
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
        if (col === "Availability Current")
          return item["Availability Current"] || "-";
        if (col === "Availability Total")
          return item["Availability Total"] || "-";
        if (col === "To Date Sale") return item["To Date Sale"] || "-";
        if (col === "To Date Return") return item["To Date Return"] || "-";

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
            <div className="flex justify-center pb-0 position-abzsolute top-[40px] w-full">
              <select
                value={selectedDistributor}
                onChange={(e) => setSelectedDistributor(e.target.value)}
                className="inline-block w-auto bg-white border border-gray-300 rounded-md px-1 py-1 text-[12px] outline-none text-center"
              >
                <option value="">All Distributors</option>
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
                <option value="New Mohed Traders">New Mohed Traders</option>
                <option value="Zaheer Pharma  ">Zaheer Pharma</option>
              </select>
            </div>
          ),
          rowSpan: 2,
        },
      ];
    }
    if (col === "Item Description")
      return [
        {
          label: (
            <div className="flex flex-col items-center gap-1 w-full">
              <span>Item Description</span>
              <input
                type="text"
                placeholder="Search..."
                value={itemSearch}
                onChange={(e) => setItemSearch(e.target.value)}
                className="w-[140px] border border-gray-300 rounded px-2 py-1 text-[12px] outline-none text-left"
              />
            </div>
          ),
          rowSpan: 2,
        },
      ];
    if (col === "Rate") return [{ label: "Rate", rowSpan: 2 }];
    if (col === "Pack") return [{ label: "Pack", rowSpan: 2 }];
    if (col === "Today Sale") return [{ label: "Today Sale", rowSpan: 2 }];
    if (col === "Today Return") return [{ label: "Today Return", rowSpan: 2 }];

    if (col === "Adjustment Quantity")
      return [{ label: "Adjustment Quantity", rowSpan: 2 }];
    if (col === "Adjustment Bonus")
      return [{ label: "Adjustment Bonus", rowSpan: 2 }];
    if (col === "Transfer In") return [{ label: "Transfer In", rowSpan: 2 }];
    if (col === "Transfer Out") return [{ label: "Transfer Out", rowSpan: 2 }];
    if (col === "Availability Current")
      return [{ label: "Availability Current", rowSpan: 2 }];
    if (col === "Availability Total")
      return [{ label: "Availability Total", rowSpan: 2 }];
    if (col === "To Date Sale") return [{ label: "To Date Sale", rowSpan: 2 }];
    if (col === "To Date Return")
      return [{ label: "To Date Return", rowSpan: 2 }];
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
              {PivotSalesData.map((field, index) => (
                <div
                  key={index}
                  onClick={() => handleSelect(field)}
                  className={`border-primary border flex gap-3 items-center bg-white p-4 rounded-md cursor-pointer ${
                    selected.includes(field) ? "bg-blue-100" : ""
                  } ${isAllSelected && field !== "All" ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <input
                    className="cursor-pointer"
                    type="checkbox"
                    checked={selected.includes(field)}
                    disabled={isAllSelected && field !== "All"}
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

              {/* <p
                onClick={clearFilters22}
                className="text-[12px] text-[#0000FF] underline font-normal cursor-pointer"
              >
                Clear Filters
              </p> */}
            </div>
            <div
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              className="bg-[#E5EBF7] h-[31vh] overflow-y-auto rounded-xl w-full p-4 mt-4 grid-cols-1 grid md:grid-cols-3 gap-4"
            >
              {PivotSalesData2.map((field, index) => (
                <div
                  key={index}
                  onClick={() => handleSelect(field)}
                  className={`border-primary border flex gap-3 items-center bg-white p-4 rounded-md cursor-pointer ${
                    selected.includes(field) ? "bg-blue-100" : ""
                  } ${isAllSelected ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <input
                    className="cursor-pointer"
                    type="checkbox"
                    disabled={isAllSelected}
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
