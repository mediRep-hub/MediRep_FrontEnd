import { Icon } from "@iconify/react";
import { useState } from "react";
import { notifyError, notifySuccess } from "../../Components/Toast";
import { useQuery } from "@tanstack/react-query";
import { getAllStocks, uploadCSVStock } from "../../api/stockServices";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { Spin } from "antd";

export default function Testing() {
  const [openModel, setOpenModel] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const { data: Stock, refetch } = useQuery({
    queryKey: ["AllStocks"],
    queryFn: () => getAllStocks(),
  });
  console.log("🚀 ~ Testing ~ Stock:", Stock);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const allowed = ["csv", "pdf", "xls", "xlsx"];
      const ext = selectedFile.name.split(".").pop()?.toLowerCase();
      if (!ext || !allowed.includes(ext)) {
        notifyError("Please upload CSV, PDF, or Excel file!");
        return;
      }
      setFile(selectedFile);
      setProgress(0);
    }
    e.target.value = "";
  };

  const handleDelete = () => {
    setFile(null);
    setProgress(0);
    const inputElement = document.getElementById(
      "fileUpload",
    ) as HTMLInputElement;
    if (inputElement) inputElement.value = "";
  };

  const handleUpload = async () => {
    if (!file) return notifyError("Please select a file first!");
    setLoading(true);
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadCSVStock(formData);
      setProgress(70);

      notifySuccess(response.data?.message || "Stock uploaded successfully!");
      refetch();

      setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setFile(null);
          setProgress(0);
          setOpenModel(false);
        }, 800);
      }, 500);
    } catch (error: any) {
      console.error("Upload Error:", error.response?.data || error.message);
      notifyError(error.response?.data?.message || "Failed to upload file");
      setProgress(0);
      refetch();
    } finally {
      setLoading(false);
    }
  };
  const groupHeaders = (headers: string[]) => {
    const groups: Record<string, string[]> = {};

    headers.forEach((h) => {
      const parts = h.split(" ");

      if (parts.length > 1) {
        const parent = parts[0];
        const child = parts.slice(1).join(" ");

        if (!groups[parent]) groups[parent] = [];
        groups[parent].push(child);
      } else {
        if (!groups[h]) groups[h] = [];
      }
    });

    return groups;
  };

  const tableHeaders = Stock?.data?.titles || [];
  const tableData = Stock?.data?.data || [];
  const groupedHeaders = groupHeaders(tableHeaders);

  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 24, color: "white" }} spin />
  );
  console.log("HEADERS:", tableHeaders);

  return (
    <>
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex justify-between items-center gap-3">
          <p className="text-heading font-medium text-[22px] sm:text-[24px]">
            Stock Reports
          </p>
          <button
            onClick={() => setOpenModel(true)}
            className="h-[55px] w-full md:w-[180px] bg-[#E5EBF7] rounded-[6px] gap-3 flex justify-center items-center"
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
        </div>

        <div className="rounded-[12px] mt-4 bg-[#E5EBF7] p-4 h-[calc(75.5vh-0px)] overflow-y-auto">
          {" "}
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(68.5vh-0px)] xl:h-[calc(53vh-0px)] overflow-y-auto scrollbar-none"
          >
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100 sticky top-0">
                {/* FIRST HEADER ROW (PARENT) */}
                <tr>
                  {Object.entries(groupedHeaders).map(([parent, children]) => (
                    <th
                      key={parent}
                      colSpan={children.length || 1}
                      rowSpan={children.length ? 1 : 2}
                      className="border px-3 py-2 text-center font-semibold"
                    >
                      {parent}
                    </th>
                  ))}
                </tr>

                {/* SECOND HEADER ROW (CHILD) */}
                <tr>
                  {Object.entries(groupedHeaders).flatMap(([_, children]) =>
                    children.map((child, i) => (
                      <th
                        key={child + i}
                        className="border px-3 py-2 text-sm font-semibold"
                      >
                        {child}
                      </th>
                    )),
                  )}
                </tr>
              </thead>

              <tbody>
                {tableData.map((row: any, rowIndex: number) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    {(Array.isArray(row) ? row : Object.values(row)).map(
                      (cell: any, cellIndex: number) => {
                        const renderCell = () => {
                          if (cell === null || cell === undefined) return "";

                          if (typeof cell === "object") {
                            const extracted = Object.values(cell)[0];
                            return extracted ?? "";
                          }

                          return cell;
                        };

                        return (
                          <td
                            key={cellIndex}
                            className="border px-3 py-2 text-sm"
                          >
                            {renderCell()}
                          </td>
                        );
                      },
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {openModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-[450px] shadow-lg">
            <div className="flex p-4 rounded-t-lg bg-[#E5EBF7] justify-between items-center">
              <p className="text-[16px] text-heading font-medium">
                Upload Stock CSV
              </p>
            </div>
            <div className="p-4 flex flex-col items-center justify-center">
              <label
                htmlFor="fileUpload"
                className={`flex flex-col items-center justify-center w-full rounded-md border-[1px] p-10 border-dashed border-[#7d7d7d] cursor-pointer hover:bg-[#E5EBF7] ${file ? "bg-[#E5EBF7]" : ""}`}
              >
                <Icon
                  icon="hugeicons:upload-03"
                  width={22}
                  height={22}
                  className="text-[#7d7d7d] mb-3 mt-10"
                />
                <p className="text-xl text-center text-heading font-normal">
                  Drag & Drop or{" "}
                  <span className="text-primary">Click to upload</span>
                </p>
                <p className="text-base text-center font-normal text-[#7d7d7d]/60">
                  Supported format: CSV
                </p>
              </label>
              <input
                id="fileUpload"
                type="file"
                accept=".csv, .pdf, .xls, .xlsx"
                onChange={handleFileChange}
                className="hidden"
              />

              {file && (
                <div className="mt-2 flex justify-between items-center w-full bg-primary text-white px-3 py-2 rounded-md">
                  <p className="text-sm">{file.name}</p>
                  <Icon
                    icon="material-symbols:close-rounded"
                    className="cursor-pointer"
                    onClick={handleDelete}
                  />
                </div>
              )}

              {file && progress > 0 && (
                <div className="mt-4 w-full">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-primary h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm mt-1 text-[#7D7D7D]">{progress}%</p>
                </div>
              )}
            </div>
            <div className="p-4 flex justify-end gap-3">
              <button
                className="h-[48px] px-6 bg-[#F2FAFD] text-[#131313] rounded-[6px]"
                onClick={() => setOpenModel(false)}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="bg-primary text-white px-7 py-3 rounded"
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
