import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import pdfWorker from "pdfjs-dist/legacy/build/pdf.worker?url";
import CustomSelect from "../../../Components/Select";
import { notifyError, notifySuccess } from "../../../Components/Toast";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
const distributorList = ["Abdullah", "Al Aziz", "Al Fatch", "Al Qamar"];
const Reports = ["Closing Report"];

interface StockItem {
  itemDescription: string;
  rate: number;
  openingBalance: string;
  purchase: string;
  purchaseReturn: string;
  purchaseTotal: string;
  sale: string;
  saleReturn: string;
  saleTotal: string;
  value: number;
  adjustment: string;
  closingBalance: string;
  closingValue: number;
  todaySale: number;
  todayReturn: number;
  pack: string;
}

export default function SaleUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [tableData, setTableData] = useState<StockItem[]>([]);
  const [distributor, setDistributor] = useState("");
  const [reportType, setReportType] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    const allowed = ["csv", "pdf", "xls", "xlsx"];
    const ext = selectedFile.name.split(".").pop()?.toLowerCase();
    if (!ext || !allowed.includes(ext)) return;
    setFile(selectedFile);
    e.target.value = "";
  };

  const getStorageKey = () => {
    if (!distributor || !reportType) return null;
    return `stockData_${distributor}_${reportType}`;
  };
  useEffect(() => {
    const key = getStorageKey();
    if (!key) return setTableData([]);
    const stored = localStorage.getItem(key);
    if (stored) setTableData(JSON.parse(stored));
    else setTableData([]);
  }, [distributor, reportType]);
  const extractPDFData = async (file: File) => {
    const rawData: any[][] = [];

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      const items = textContent.items
        .map((item: any) => ({
          text: item.str.trim(),
          x: item.transform[4],
          y: item.transform[5],
        }))
        .filter((item: any) => item.text);

      const rows: any[] = [];
      const threshold = 5;

      items.forEach((item: any) => {
        let row = rows.find((r) => Math.abs(r.y - item.y) < threshold);

        if (!row) {
          row = { y: item.y, cells: [] };
          rows.push(row);
        }

        row.cells.push(item);
      });

      rows.sort((a, b) => b.y - a.y);

      rows.forEach((row) => {
        row.cells.sort((a: any, b: any) => a.x - b.x);
        rawData.push(row.cells.map((cell: any) => cell.text));
      });
    }

    return rawData;
  };
  const handleUpload = async () => {
    if (!file) return alert("Please select a file first!");
    if (!distributor || !reportType)
      return alert("Please select distributor and report type");

    setLoading(true);
    setProgress(10);

    try {
      let rawData: any[][] = [];
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext === "csv") {
        const text = await file.text();
        rawData = text.split("\n").map((line) => line.split(/,|\t/));
      } else if (ext === "xls" || ext === "xlsx") {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        rawData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
      } else if (ext === "pdf") {
        rawData = await extractPDFData(file);
      }

      setProgress(60);
      const cleanTableData = (rawData: any[][]) => {
        const skipKeywords = [
          "powered by",
          "item description",
          "print",
          "page",
          "version",
          "company",
          "date from",
          "sale and stock report",
          "www.",
          "include blocked items",
          "rate type",
          "zero sales",
          "sort by",
          "total for group",
          "report total",
          "opening",
          "sale",
          "closing",
          "today",
          "balance",
          "group",
          "default",
          "/",
          "558843",
        ];

        return rawData.filter((row) => {
          if (!row || row.length === 0) return false;
          const rowString = row.join(" ").toLowerCase();
          return !skipKeywords.some((keyword) => rowString.includes(keyword));
        });
      };
      const cleaned = cleanTableData(rawData);
      const dataRows = cleaned.slice(1);

      const structuredData: any = dataRows.map((row) => {
        let itemDescriptionParts: string[] = [];
        for (let i = 0; i <= 4; i++) {
          if (row[i] && isNaN(Number(row[i]))) {
            itemDescriptionParts.push(row[i].toString().trim());
          }
        }
        const itemDescription = itemDescriptionParts.join(" ");
        let pack = "";
        if (distributor === "Al Qamar") {
          return {
            itemDescription: (itemDescription || row[0]) ?? "",
            rate: Number(row[1] ?? 0),
            openingBalance: `${row[3] ?? 0} ${row[4] ?? 0}`,
            purchase: `${row[5] ?? 0} ${row[6] ?? 0}`,
            purchaseReturn: `${row[7] ?? 0} ${row[8] ?? 0}`,
            purchaseTotal: `${row[9] ?? 0} ${row[10] ?? 0}`,
            netsale: `${row[11] ?? 0}`,
            saleBouns: `${row[12] ?? 0} `,
            saleValue: `${row[13] ?? 0} `,
            adjustment: `${row[14] ?? 0} ${row[15] ?? 0}`,
            closingBalance: `${row[16] ?? 0} ${row[17] ?? 0}`,
            closingValue: Number(row[18] ?? 0),
            todaySale: Number(row[19] ?? 0),
            todayReturn: Number(row[20] ?? 0),
            pack: `${row[2] ?? 0} `,
          };
        } else if (distributor === "Al Aziz") {
          return {
            itemDescription: (itemDescription || row[0]) ?? "",
            rate: Number(row[1] ?? 0),
            openingBalance: `${row[3] ?? 0} ${row[4] ?? 0}`,
            purchase: `${row[5] ?? 0} ${row[6] ?? 0}`,
            purchaseReturn: `${row[7] ?? 0} ${row[8] ?? 0}`,
            purchaseTotal: `${row[9] ?? 0} ${row[10] ?? 0}`,
            netsale: `${row[11] ?? 0}`,
            saleBouns: `${row[12] ?? 0} `,
            saleValue: `${row[13] ?? 0} `,
            adjustment: `${row[14] ?? 0} ${row[15] ?? 0}`,
            closingBalance: `${row[16] ?? 0} ${row[17] ?? 0}`,
            closingValue: Number(row[18] ?? 0),
            todaySale: Number(row[19] ?? 0),
            todayReturn: Number(row[20] ?? 0),
            pack: `${row[2] ?? 0} `,
          };
        } else {
          return {
            itemDescription: (itemDescription || row[0]) ?? "",
            rate: Number(row[1] ?? 0),
            openingBalance: `${row[2] ?? 0} ${row[3] ?? 0}`,
            purchase: `${row[4] ?? 0} ${row[5] ?? 0}`,
            purchaseReturn: `${row[6] ?? 0} ${row[7] ?? 0}`,
            purchaseTotal: `${row[8] ?? 0} ${row[9] ?? 0}`,
            sale: `${row[10] ?? 0} ${row[11] ?? 0}`,
            saleReturn: `${row[12] ?? 0} ${row[13] ?? 0}`,
            saleTotal: `${row[14] ?? 0} ${row[15] ?? 0}`,
            value: Number(row[16] ?? 0),
            adjustment: `${row[17] ?? 0} ${row[18] ?? 0}`,
            closingBalance: `${row[19] ?? 0} ${row[20] ?? 0}`,
            closingValue: Number(row[21] ?? 0),
            todaySale: Number(row[22] ?? 0),
            todayReturn: Number(row[23] ?? 0),
            pack,
          };
        }
      });
      const key = getStorageKey();
      if (key) localStorage.setItem(key, JSON.stringify(structuredData));

      setTableData(structuredData);
      setProgress(100);
      setFile(null);
      notifySuccess(`File processed! ${structuredData.length} rows loaded.`);
    } catch (err) {
      console.error(err);
      notifyError("Failed to process file");
    } finally {
      setLoading(false);
    }
  };

  let headersObj;

  if (distributor === "Al Qamar" || distributor === "Al Aziz") {
    headersObj = {
      itemDescription: "",
      rate: 0,
      openingBalance: 0,
      purchase: 0,
      purchaseReturn: 0,
      purchaseTotal: 0,
      netSale: 0,
      saleBouns: 0,
      salevalue: 0,
      adjustment: 0,
      closingBalance: 0,
      closingValue: 0,
      todaySale: 0,
      todayReturn: 0,
      pack: "",
    };
  } else {
    headersObj = {
      itemDescription: "",
      rate: 0,
      openingBalance: 0,
      purchase: 0,
      purchaseReturn: 0,
      purchaseTotal: 0,
      sale: 0,
      saleReturn: 0,
      saleTotal: 0,
      value: 0,
      adjustment: 0,
      closingBalance: 0,
      closingValue: 0,
      todaySale: 0,
      todayReturn: 0,
      pack: "",
    };
  }

  const headers = Object.keys(headersObj);

  return (
    <div className="bg-secondary p-4 rounded-[12px]">
      <p className="text-[#131313] text-2xl">Sale Data Upload</p>
      <div className="bg-[#E5EBF7] p-3 rounded-lg mt-4">
        <p className="text-sm text-[#7d7d7d]">Select Sales Filters</p>
        <div className="grid bg-white p-6 mt-4 grid-cols-2 rounded-lg gap-4">
          <CustomSelect
            options={distributorList}
            placeholder="Select Distributor"
            onChange={(v: string) => setDistributor(v)}
          />
          <CustomSelect
            options={Reports}
            placeholder="Select Report"
            onChange={(v: string) => setReportType(v)}
          />

          <div
            onClick={() => document.getElementById("fileInput")?.click()}
            className="border-dashed border border-[#7D7D7D] flex flex-col cursor-pointer items-center justify-center h-[56px] rounded-md"
          >
            {file ? (
              <p className="text-base text-[#131313] font-medium">
                {file.name}
              </p>
            ) : (
              <>
                <Icon
                  icon="hugeicons:upload-03"
                  className="text-xl text-[#7d7d7d]"
                />
                <p className="text-base text-medium text-[#131313]">
                  Drag and Drop or
                  <span className="text-primary"> Click to upload</span>
                </p>
              </>
            )}
            <input
              id="fileInput"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <button
            className="bg-[#0755E9] h-[54px] w-[160px] flex justify-center gap-3 items-center text-white rounded-md"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                {" "}
                <Icon icon="solar:upload-broken" className="text-2xl" />
                <p>Upload</p>
              </>
            )}
          </button>
        </div>
        <p className="text-sm text-[#7d7d7d] mt-4">Select Sales Filters</p>
        <div
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="overflow-auto mt-4 bg-white p-2 rounded-lg h-[48vh] "
        >
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {headers.map((h) => (
                  <th key={h} className="border px-2 py-1">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => (
                <tr key={i}>
                  {headers.map((key) => (
                    <td key={key} className="border px-2 py-1">
                      {typeof (row as any)[key] === "string" &&
                      (row as any)[key].includes(" ") ? (
                        <div className="flex gap-10">
                          {(row as any)[key]
                            .split(" ")
                            .map((val: string, i: number) => (
                              <span key={i}>{val}</span>
                            ))}
                        </div>
                      ) : (
                        ((row as any)[key] ?? "-")
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
