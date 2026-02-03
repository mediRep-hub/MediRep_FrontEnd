import React, { useState } from "react";
import { FaFileAlt, FaTrash } from "react-icons/fa";
import { notifyError, notifySuccess } from "../Toast";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { uploadCSVTarget } from "../../api/productServices";
import { Icon } from "@iconify/react";
export default function UploadFile({ closeModle, addToList, refetch }: any) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return notifyError("Please select a file first!");
    setLoading(true);

    try {
      const data = await readFileData(file);

      if (!data || data.length === 0) throw new Error("No data found");

      const formattedData = data.map((item: any) => ({
        SKU: item.SKU,
        target: Number(item.target),
      }));

      await uploadCSVTarget(formattedData);
      notifySuccess("Targets uploaded successfully!");

      if (addToList) addToList(formattedData);
      refetch();
      closeModle(false);
    } catch (error: any) {
      console.error("Upload Error:", error);
      notifyError(error.message || "Failed to upload file");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
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

  const readFileData = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const ext = file.name.split(".").pop()?.toLowerCase();

      if (ext === "csv") {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => resolve(results.data),
          error: (err) => reject(err),
        });
      } else if (ext === "xls" || ext === "xlsx") {
        const reader = new FileReader();
        reader.onload = (evt) => {
          try {
            const bstr = evt.target?.result;
            const workbook = XLSX.read(bstr, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);
            resolve(jsonData);
          } catch (err) {
            reject(err);
          }
        };
        reader.readAsBinaryString(file);
      } else {
        reject(new Error("Unsupported file format"));
      }
    });
  };

  return (
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
            accept=".csv, .xlsx, .xls"
            onChange={handleFileChange}
            className="hidden"
          />
          {file && (
            <div className="absolute z-10  bg-primary top-10 gap-4 left-10  flex items-center justify-between border px-3 py-2 rounded-md">
              <div className="flex items-center gap-2">
                <p className="text-sm text-white font-medium">{file.name}</p>
              </div>
              <div
                style={{ boxShadow: " 0.67px 0.67px 2.67px 1.33px #00000040" }}
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
        <div className="flex justify-end gap-4 pt-0 p-4">
          <button
            className="h-[48px] px-6 bg-[#F2FAFD] text-[#131313] rounded-[6px] cursor-pointer"
            onClick={() => closeModle(false)}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className={`h-[48px] px-6 bg-primary text-white rounded-[6px] cursor-pointer ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
