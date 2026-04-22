import { Icon } from "@iconify/react";
import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import pdfWorker from "pdfjs-dist/legacy/build/pdf.worker?url";
import CustomSelect from "../../../Components/Select";
import { notifyError, notifySuccess } from "../../../Components/Toast";
import { useDispatch } from "react-redux";
import { setSalesData } from "../../../redux/userSlice";
import { parseFile } from "./fileParser";
import { structureData } from "./structureData";
import { getHeadersByDistributor } from "./headersConfig";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const distributorList = [
  "Abdullah Enterprises - Chakwal",
  "AL Aziz Distributors - Sargodha",
  "Al-Fateh Medicine Co - Burewala",
  "Al Qamar",
  "Drug Services",
  "Allied Enterprises",
  "New Mohed Traders",
  "Zaheer Pharma",
  "MZ Pharma Distribution (Pakpattan)",
  "Sajjad Enterprises",
  "Pharma Link Distributor",
  "Ali Pharma (Distribution)",
  "Al-Rehmat Distributors",
  "Faisal Pharma",
  "Latif & Sons Distributors",
  "Pharma Page Plus",
  "Sheryar Distributor",
  "Umer Brothers",
];
const Reports = ["Closing Report"];

interface StockItem {
  "Item Description": string;
  rate: number;
  "Opening Balance": string;
  Purchase: string;
  "Purchase Return": string;
  "Purchase Total": string;
  Sale: string;
  "Sale Return": string;
  "Sale Total": string;
  Value: number;
  Adjustment: string;
  ClosingBalance: string;
  "Closing Value": number;
  todaySale: number;
  todayReturn: number;
  Pack: string;
}

export default function SaleUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [tableData, setTableData] = useState<StockItem[]>([]);
  const [distributor, setDistributor] = useState<any>("");
  const [reportType, setReportType] = useState("");
  const [loading, setLoading] = useState(false);
  const [headers, setHeaders] = useState<string[]>([]);

  const dispatch = useDispatch();
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

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first!");
    if (!distributor || !reportType)
      return alert("Please select distributor and report type");

    setLoading(true);

    try {
      const handleDistributorName =
        distributor === "Latif & Sons Distributors" ? "Latif" : distributor;

      let rawData: any = await parseFile(file, handleDistributorName);

      const structuredData: any = structureData(rawData, distributor);

      // ✅ yahan data pass karo
      const headersObj = getHeadersByDistributor(distributor);

      setHeaders(Object.keys(headersObj));

      const key = getStorageKey();
      if (key) localStorage.setItem(key, JSON.stringify(structuredData));
      const cleanData = structuredData.filter((item: any) => {
        const desc = item["Item Description"]?.toString().trim() || "";
        const normalizedDesc = desc.replace(/\s+/g, " ").trim();
        const lower = desc.toLowerCase();
        const isDate =
          /^\d{1,2}-[A-Za-z]{3}-\d{4}$/.test(normalizedDesc) ||
          /^\d{1,2}-\d{1,2}-\d{4}$/.test(normalizedDesc) ||
          /^\d{4}-\d{1,2}-\d{1,2}$/.test(normalizedDesc);

        const isTime = /\b\d{1,2}\s*:\s*\d{2}(\s*:\s*\d{2})?\s*(AM|PM)\b/i.test(
          normalizedDesc,
        );

        const isDateTime =
          /\b\d{1,2}-[A-Za-z]{3}-\d{4}\s+\d{1,2}:\d{2}(:\d{2})?\s?(AM|PM)\b/i.test(
            normalizedDesc,
          );

        return (
          desc &&
          /[a-z]/i.test(desc) &&
          desc.length > 3 &&
          !isDate &&
          !isTime &&
          !isDateTime &&
          // ❌ remove "Date From..."
          !lower.includes("date from") &&
          !lower.startsWith("date") &&
          !lower.includes("distributor") &&
          !lower.includes("distributer") &&
          !lower.includes("www") &&
          !lower.includes(".com") &&
          !lower.includes("@") &&
          !lower.includes("+92") &&
          !lower.includes("support") &&
          !lower.includes("version") &&
          !lower.includes("company") &&
          !lower.includes("nutra") &&
          !lower.includes("sales") &&
          !lower.includes("purchase") &&
          !lower.includes("prodcuts") &&
          !lower.includes("product") &&
          !lower.includes("date") &&
          !lower.includes("near") &&
          !lower.includes("baseer") &&
          // !lower.includes("tablets") &&
          !lower.includes("undefined") &&
          !lower.includes("tax") &&
          !lower.includes("daska") &&
          !lower.includes("mobile") &&
          !lower.includes("pharma") &&
          !lower.includes("solutions") &&
          !lower.includes("sialkot") &&
          !lower.includes("road") &&
          !lower.includes("sale") &&
          !lower.includes("description") &&
          !lower.includes("group") &&
          !lower.includes("total") &&
          !lower.includes("abdullah") &&
          !lower.includes("opening") &&
          !lower.includes("software") &&
          !lower.includes("powered") &&
          !lower.includes("al-fateh") &&
          !lower.includes("al qamar") &&
          !lower.includes("allied enterprises") &&
          !lower.includes("#") &&
          !lower.includes("trade") &&
          !lower.includes("&") &&
          !lower.includes("medicin") &&
          !lower.includes("rate") &&
          !lower.includes("value") &&
          !lower.includes("umer brothers") &&
          !lower.includes("opp.") &&
          !lower.includes("garden") &&
          !lower.includes("statement") &&
          !lower.includes("stock") &&
          !lower.includes("from") &&
          !lower.includes("grand") &&
          !lower.includes("gyn") &&
          !lower.includes("drug") &&
          !lower.includes("services") &&
          !lower.includes("general") &&
          !lower.includes("gram") &&
          !lower.includes("latif") &&
          !lower.includes("win2pdf.") &&
          // ❌ remove pure numbers like "475779"
          !/^\d+$/.test(desc)
        );
      });

      setTableData(cleanData);
      setFile(null);

      dispatch(
        setSalesData({
          distributor,
          data: cleanData,
        }),
      );
      notifySuccess(`File processed! ${structuredData.length} rows loaded.`);
    } catch (err) {
      console.error(err);
      notifyError("Failed to process file");
    } finally {
      setLoading(false);
    }
  };

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
              {tableData.map((row, i) => {
                return (
                  <tr key={i}>
                    {headers.map((key) => {
                      return (
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
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
