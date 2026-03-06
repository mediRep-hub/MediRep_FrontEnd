import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { notifyError, notifySuccess } from "../../Components/Toast";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import * as XLSX from "xlsx";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import pdfWorker from "pdfjs-dist/legacy/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

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
  pack: string; // <-- new field
}

export default function Testing() {
  const [openModel, setOpenModel] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<StockItem[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const allowed = ["csv", "pdf", "xls", "xlsx"];
    const ext = selectedFile.name.split(".").pop()?.toLowerCase();

    if (!ext || !allowed.includes(ext)) {
      notifyError("Please upload CSV, PDF, or Excel file!");
      return;
    }

    setFile(selectedFile);
    setProgress(0);
    e.target.value = "";
  };

  const handleDelete = () => {
    setFile(null);
    setProgress(0);
  };
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
    ];

    return rawData.filter((row) => {
      if (!row || row.length === 0) return false;
      const rowString = row.join(" ").toLowerCase();
      return !skipKeywords.some((keyword) => rowString.includes(keyword));
    });
  };
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
    if (!file) return notifyError("Please select a file first!");

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
        rawData = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          defval: "",
        });
      } else if (ext === "pdf") {
        rawData = await extractPDFData(file);
      }

      setProgress(60);

      const cleaned = cleanTableData(rawData);
      const dataRows = cleaned.slice(1);

      const structuredData: StockItem[] = dataRows.map((row) => {
        const itemDescriptionParts: string[] = [];
        for (let i = 0; i <= 4; i++) {
          if (row[i] && isNaN(Number(row[i]))) {
            itemDescriptionParts.push(row[i].toString().trim());
          }
        }
        const itemDescription = itemDescriptionParts.join(" ");

        // Assign pack based on report type
        let pack = "";

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
          pack, // add new field
        };
      });
      localStorage.setItem("stockData", JSON.stringify(structuredData));
      setTableData(structuredData);

      setProgress(100);
      notifySuccess(
        `File processed successfully! ${structuredData.length} rows found.`,
      );

      setTimeout(() => {
        setFile(null);
        setOpenModel(false);
        setProgress(0);
      }, 800);
    } catch (error) {
      console.error(error);
      notifyError("Failed to process file");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("stockData");
    if (stored) setTableData(JSON.parse(stored));
  }, []);

  const antIcon = <Loading3QuartersOutlined style={{ fontSize: 24 }} spin />;

  const headers = Object.keys({
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
  });

  return (
    <>
      <div className="bg-secondary p-4 rounded-[12px]">
        <div className="flex justify-between items-center">
          <p className="text-[22px] font-medium">Stock Reports</p>
          <button
            onClick={() => setOpenModel(true)}
            className="h-[55px] w-full md:w-[180px] bg-[hsl(0,0%,100%)] px-6 py-3 rounded flex items-center gap-3"
          >
            <Icon
              icon="solar:download-broken"
              className="rotate-180 text-2xl"
            />
            Upload
          </button>
        </div>

        <div
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(75.5vh-0px)] xl:h-[calc(76vh-0px)]  mt-4 overflow-y-auto scrollbar-none"
        >
          <table className="w-full border-collapse table-auto">
            <thead className="sticky top-0 bg-white z-10 h-14">
              <tr>
                {headers.map((h) => (
                  <th
                    key={h}
                    className="border-b border-[#0755E9] capitalize px-5 py-2 text-[12px] font-medium text-[#131313] text-left break-words"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => (
                <tr
                  key={i}
                  className="hover:bg-[#E5EBF7] h-14 hover:text-black cursor-pointer"
                >
                  {headers.map((key) => (
                    <td
                      key={key}
                      className="px-5 py-2 border min-w-max text-[13px] font-normal text-[#131313]"
                    >
                      {typeof (row as any)[key] === "string" &&
                      (row as any)[key].includes(" ") ? (
                        <div className="flex justify-between">
                          {(row as any)[key]
                            .split(" ")
                            .map((v: string, i: number) => (
                              <span key={i}>{v}</span>
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
      {openModel && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl xl:mx-0 mx-5 xl:w-[450px] w-full xl:h-auto overflow-x-auto shadow-xl relative">
            <div className="flex p-4 bg-[#E5EBF7] items-center justify-between">
              <p className="text-[16px] leading-[100%] text-heading font-medium">
                Upload Document
              </p>
            </div>

            <div className="flex relative p-4 flex-col items-center justify-center">
              <label
                htmlFor="fileUpload"
                className={`flex flex-col items-center justify-center w-full rounded-md border-[1px] p-10 border-dashed border-[#7d7d7d] cursor-pointer transition
                ${file ? "bg-[#E5EBF7]" : "hover:bg-[#E5EBF7]"}`}
              >
                <Icon
                  icon="hugeicons:upload-03"
                  width={22}
                  height={22}
                  className="text-[#7d7d7d] mb-3 mt-5"
                />
                <p className="text-xl text-center text-heading font-medium">
                  Drag and Drop or{" "}
                  <span className="text-primary">Click to upload</span>
                </p>
                <p className="text-base text-center font-medium text-[#7d7d7d]/60">
                  Supported format only: CSV
                </p>
              </label>
              <input
                id="fileUpload"
                type="file"
                accept=".csv, .xlsx, .xls, .pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              {file && (
                <div className="absolute z-10  bg-primary top-10 gap-4 left-10  flex items-center justify-between border px-3 py-2 rounded-md">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-white font-medium">
                      {file.name}
                    </p>
                  </div>
                  <div
                    style={{
                      boxShadow: " 0.67px 0.67px 2.67px 1.33px #00000040",
                    }}
                    className="absolute top-[-15px] right-[-15px] z-50 bg-white p-1 rounded-full"
                  >
                    <Icon
                      icon="material-symbols:close-rounded"
                      className="text-[#131313] cursor-pointer"
                      onClick={handleDelete}
                    />
                  </div>
                </div>
              )}
            </div>

            {file && progress > 0 && (
              <div className="mt-4 xl:mx-6 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm mt-1">{progress}%</p>
              </div>
            )}

            {file && <p className="mb-2 px-4 text-sm">{file.name}</p>}
            <div className="flex justify-end gap-3 p-4">
              <button
                className="h-[48px] px-6 bg-[#F2FAFD] text-[#131313] rounded-[6px] transition-all"
                onClick={() => setOpenModel(false)}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="bg-primary text-white px-4 py-2 rounded"
              >
                {loading ? <Spin indicator={antIcon} /> : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
