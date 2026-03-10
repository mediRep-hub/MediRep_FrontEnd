import { Icon } from "@iconify/react";
import CustomSelect from "../../../Components/Select";
import { useRef, useState } from "react";

const distributorList = [
  "Latif Sons Distributors",
  "Pharma Link Distributor",
  "Sheryar Distributor",
  "Umer Brothers",
];
const Reports = [
  "Closing Report",
  "Stock & Sales Group Report",
  "Sales & Stock Group Report",
  "Area Wise Sales",
];
export default function UploadSales() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  return (
    <div>
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex w-full md:w-auto md:flex-nowrap flex-wrap items-center gap-4 ">
          <p className="text-heading font-medium text-[22px] sm:text-[24px]">
            Sales Data Upload
          </p>
        </div>
        <div className="bg-[#E5EBF7]  mt-4 rounded-xl p-4 2xl:h-[calc(77.5vh-0px)] xl:h-[calc(64vh-0px)] h-auto ">
          <p className="text-sm text-[#7d7d7d] leading-[100%]">
            Select Sales Filters
          </p>
          <div className="bg-white rounded-xl mt-4 grid grid-cols-2 gap-4 p-8">
            <CustomSelect
              options={distributorList}
              placeholder="Select Distributor"
            />
            <CustomSelect
              options={Reports}
              placeholder="Select Report Format"
            />

            <input
              type="file"
              ref={inputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            {!file ? (
              <div
                onClick={handleClick}
                className="border-dashed border border-[#7D7D7D] flex flex-col cursor-pointer items-center justify-center h-[56px] rounded-md"
              >
                <Icon
                  icon="hugeicons:upload-03"
                  className="text-xl text-[#7d7d7d]"
                />
                <p className="text-base text-medium text-[#131313]">
                  Drag and Drop or
                  <span className="text-primary"> Click to upload</span>
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between border p-3 rounded-md">
                <p className="text-sm text-[#131313]">{file.name}</p>

                <button
                  onClick={() => setFile(null)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            )}

            <button className="h-[56px] flex justify-center items-center gap-3 cursor-pointer w-[200px] bg-primary rounded-md text-white font-medium">
              <Icon icon="solar:upload-broken" className="text-2xl" />
              <p>Upload</p>
            </button>
          </div>
          <p className="text-sm text-[#7d7d7d] py-4 leading-[100%]">
            Select Data
          </p>
          <div className="bg-white rounded-xl h-[50%] flex justify-center items-center">
            <p className="text-2xl text-[#131313] font-medium">
              No Data to Prevew
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
