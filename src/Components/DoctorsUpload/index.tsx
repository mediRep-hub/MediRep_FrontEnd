import React, { useState } from "react";
import { notifyError, notifySuccess } from "../Toast";
import { uploadCSVDoctor } from "../../api/doctorServices";
import { Icon } from "@iconify/react";

export default function DoctorUploads({ closeModle, refetch }: any) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith(".csv")) {
        notifyError("Please upload a valid CSV file!");
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

      const response = await uploadCSVDoctor(formData);
      setProgress(70);

      notifySuccess(
        response.data?.message || "Profiles uploaded successfully!",
      );
      refetch();

      setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setFile(null);
          setProgress(0);
          closeModle(false);
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl xl:mx-0 mx-5 xl:w-[450px] w-full xl:h-auto shadow-xl relative overflow-hidden">
        <div className="flex p-4 bg-[#E5EBF7] items-center justify-between">
          <p className="text-[16px] text-heading leading-[100%] font-medium">
            Bulk Upload Doctors
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
            <p className="text-xl text-center text-heading font-normal">
              Drag and Drop or{" "}
              <span className="text-primary">Click to upload</span>
            </p>
            <p className="text-base text-center font-normal text-[#7d7d7d]/60">
              Supported format: CSV
            </p>
          </label>
          <input
            id="fileUpload"
            type="file"
            accept=".csv"
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
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-primary h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm mt-1 text-[#7D7D7D]">{progress}%</p>
          </div>
        )}
        <div className="flex justify-end gap-4 pt-0 p-4">
          <button
            className="h-[48px] px-6 bg-[#F2FAFD] text-[#131313] rounded-[6px] transition-all"
            onClick={() => closeModle(false)}
          >
            Cancel
          </button>
          <button
            className={`h-[48px] px-6 bg-primary text-white rounded-[6px] transition-all ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:bg-primary/90"
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
