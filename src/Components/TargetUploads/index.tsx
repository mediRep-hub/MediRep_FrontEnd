import React, { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { MdFileUpload } from "react-icons/md";
import { FaFileAlt, FaTrash } from "react-icons/fa";
import { notifyError, notifySuccess } from "../Toast";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { getAllProducts, uploadCSVTarget } from "../../api/productServices";
import { useQuery } from "@tanstack/react-query";

export default function UploadFile({ closeModle, addToList }: any) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const { refetch } = useQuery({
    queryKey: ["AllProducts"],
    queryFn: () => getAllProducts(),
    staleTime: 5 * 60 * 1000,
  });

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
      closeModle(false);
    } catch (error: any) {
      console.error("Upload Error:", error);
      notifyError(error.message || "Failed to upload file");
    } finally {
      setLoading(false);
      refetch();
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
      "fileUpload"
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
      <div className="bg-white rounded-xl xl:mx-0 mx-5 xl:w-[600px] w-full xl:h-auto overflow-x-auto shadow-xl relative">
        <div className="flex xl:p-6 p-4 bg-[#E5EBF7] items-center justify-between">
          <p className="text-[20px] text-heading font-medium">
            Bulk Upload File
          </p>
          <IoMdCloseCircle
            size={22}
            onClick={() => closeModle(false)}
            className="cursor-pointer text-primary"
          />
        </div>
        <div className="flex xl:p-6 p-4 flex-col items-center justify-center mt-10">
          <label
            htmlFor="fileUpload"
            className="flex flex-col items-center justify-center border-2 w-full rounded-md p-10 border-dashed border-primary hover:bg-[#E5EBF7] cursor-pointer transition"
          >
            <MdFileUpload size={50} className="text-primary mb-3" />
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
        </div>

        {file && (
          <div className="mt-6 xl:mx-6 mx-4 flex items-center justify-between border p-3 rounded-md">
            <div className="flex items-center gap-2">
              <FaFileAlt className="text-primary" />
              <p className="text-sm">{file.name}</p>
            </div>
            <FaTrash
              className="text-red-500 cursor-pointer"
              onClick={handleDelete}
            />
          </div>
        )}
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
        <div className="flex justify-end mt-6 xl:p-6 p-4">
          <button
            className={`h-[45px] px-6 bg-primary text-white rounded-[6px] cursor-pointer ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
