import React, { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { MdFileUpload } from "react-icons/md";
import { FaFileAlt, FaTrash } from "react-icons/fa";
import { notifyError, notifySuccess } from "../Toast";
import { useQuery } from "@tanstack/react-query";
import { getAllDoctors, uploadCSVDoctor } from "../../api/doctorServices";

export default function DoctorUploads({ closeModle }: any) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const { refetch } = useQuery({
    queryKey: ["AllDoctors"],
    queryFn: () => getAllDoctors(),
    staleTime: 5 * 60 * 1000,
  });

  const handleUpload = async () => {
    if (!file) return notifyError("Please select a file first!");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file); // 🔹 key must match Multer
      console.log("🚀 FormData before upload:", formData.get("file")); // check this

      const response = await uploadCSVDoctor(formData);
      console.log("Upload response:", response.data);
      notifySuccess("Doctor list uploaded successfully!");
      closeModle(false);
      refetch();
    } catch (error: any) {
      console.error("Upload Error:", error.response?.data || error.message);
      notifyError(error.response?.data?.message || "Failed to upload file");
    } finally {
      setLoading(false);
      setProgress(100);
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl xl:mx-0 mx-5 xl:w-[600px] w-full xl:h-auto overflow-x-auto shadow-xl relative">
        <div className="flex xl:p-6 p-4 bg-[#E5EBF7] items-center justify-between">
          <p className="text-[20px] text-heading font-medium">
            Bulk Upload Doctors
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
              Supported format: CSV, XLS, XLSX
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
