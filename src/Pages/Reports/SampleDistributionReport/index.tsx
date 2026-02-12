import { Icon } from "@iconify/react";
import CustomTable from "../../../Components/CustomTable";
import { MonthYearPicker } from "../../../Components/FilterMonthYear";
import ReportFilterModalStatic from "../../../Components/ReportFilter";
import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const title = [
  "Date",
  "MR Name",
  "Doctor/Pharmacy Name",
  "Products",
  "Quantity(pcs)",
];

export default function SampleDistributionReport() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const Data = [
    ["Sep 20,2025", "Omar Rosser", "Jaydon Carder", "Synflex", "02"],

    ["Sep 21,2025", "Aiden Brooks", "Lucas Henry", "Medcore", "05"],

    ["Sep 22,2025", "Liam Scott", "Ethan Miles", "Techline", "03"],

    ["Sep 23,2025", "Noah Parker", "Caleb Turner", "Infysoft", "04"],
  ];
  const [generateReport, setGenerateReport] = useState(false);
  const handleClose = () => {
    setGenerateReport(false);
  };
  const handleDownloadExcel = () => {
    const exportData = Data.map((row) =>
      row.map((cell: any) => {
        if (typeof cell === "object" && cell?.props) {
          if (cell.props.children) {
            if (Array.isArray(cell.props.children)) {
              return cell.props.children
                .map((child: any) =>
                  typeof child === "string"
                    ? child
                    : child.props?.children || "",
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

    const worksheet = XLSX.utils.aoa_to_sheet([title, ...exportData]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Sample Distribution Report",
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, "Sample Distribution Report.xlsx");
  };
  useEffect(() => {
    document.title = "MediRep | Sample Distribution Report";
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);
    setProgress(10);

    const fileType = file.type;

    try {
      // 🟢 EXCEL FILE
      if (
        fileType ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        fileType === "application/vnd.ms-excel"
      ) {
        const reader = new FileReader();

        reader.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setProgress(percent);
          }
        };

        reader.onload = (evt: any) => {
          const data = evt.target.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(sheet);

          console.log("📊 Excel Data:", json);

          setProgress(100);
          setSuccessMsg("Excel file uploaded successfully ✅");
          setTimeout(() => setSuccessMsg(""), 3000);
          setLoading(false);
        };

        reader.onerror = () => {
          throw new Error("Failed to read Excel file");
        };

        reader.readAsBinaryString(file);
      }

      // 🔵 PDF FILE
      else if (fileType === "application/pdf") {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("http://localhost:5000/upload-pdf", {
          method: "POST",
          body: formData,
        });

        setProgress(70);

        if (!response.ok) {
          throw new Error("PDF upload failed");
        }

        const data = await response.json();
        console.log("📄 PDF Extracted Data:", data.text);

        setProgress(100);
        setSuccessMsg("PDF uploaded & parsed successfully ✅");
        setTimeout(() => setSuccessMsg(""), 3000);
        setLoading(false);
      } else {
        throw new Error("Unsupported file format");
      }
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "Upload failed ❌");
      setTimeout(() => setErrorMsg(""), 3000);
      setLoading(false);
    }

    e.target.value = "";
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      {loading && (
        <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 w-[260px] z-50">
          <p className="text-sm font-medium mb-2">Uploading...</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs mt-1 text-right">{progress}%</p>
        </div>
      )}
      {successMsg && (
        <div className="fixed top-4 right-4 bg-green-100 text-green-700 px-4 py-2 rounded-lg shadow z-50">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="fixed top-4 right-4 bg-red-100 text-red-700 px-4 py-2 rounded-lg shadow z-50">
          {errorMsg}
        </div>
      )}

      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex w-full md:w-auto items-center gap-3">
            <p className="text-heading  font-medium text-[22px] sm:text-[24px]">
              Reports
            </p>
            <div className="w-full">
              <MonthYearPicker />
            </div>
          </div>

          <div className="flex flex-wrap w-full md:w-auto items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="h-[55px] w-full md:w-[180px] bg-[#E5EBF7] rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
            >
              <Icon
                icon="solar:download-broken"
                height="24"
                width="24"
                color="#131313"
                className="rotate-180"
              />
              <p className="text-heading text-base font-medium">Upload</p>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.xlsx,.xls"
              hidden
              onChange={handleUpload}
            />
            <button
              onClick={handleDownloadExcel}
              className="h-[55px] w-full md:w-[180px] bg-[#E5EBF7] rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
            >
              <Icon
                icon="solar:download-broken"
                height="24"
                width="24"
                color="#0755E9"
              />
              <p className="text-primary text-base font-medium">Download</p>
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
              <p className="text-white text-base font-medium">
                Generate Reports
              </p>
            </button>
          </div>
        </div>

        <div className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(75.7vh-0px)] xl:h-[calc(64vh-0px)] h-auto ">
          <p className="text-sm text-[#7d7d7d]">Sample Distribution Report</p>
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="scroll-smooth bg-white mt-3 rounded-xl 2xl:h-[calc(69vh-0px)] xl:h-[calc(54vh-0px)]  overflow-y-auto scrollbar-none"
          >
            <CustomTable titles={title} data={Data} />
          </div>
        </div>
      </div>
      {generateReport && (
        <>
          {" "}
          <>
            <ReportFilterModalStatic close={handleClose} />{" "}
          </>
        </>
      )}
    </>
  );
}
