import { IoMdCloseCircle } from "react-icons/io";
import { MdFileUpload } from "react-icons/md";
type SecondarySaleUploadProps = {
  open: boolean;
  onClose: () => void;
};

export default function SecondarySaleUpload({
  open,
  onClose,
}: SecondarySaleUploadProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-[95%] sm:w-[520px] rounded-xl overflow-hidden">
        <div className="flex justify-between items-center px-5 py-4 bg-[#EEF3FB]">
          <p className="text-lg font-semibold">Bulk Upload Profiles</p>

          <button onClick={onClose} className="text-blue-600 text-xl font-bold">
            <IoMdCloseCircle
              size={22}
              className="cursor-pointer text-primary"
            />
          </button>
        </div>

        <div className="px-5 py-12">
          <label className="border-2 border-dashed border-blue-500 rounded-lg bg-[#EEF3FB] h-[140px] flex flex-col justify-center items-center cursor-pointer text-center">
            <MdFileUpload size={50} className="text-primary mb-3" />

            <p className="text-lg">
              Drag and Drop or{" "}
              <span className="text-blue-600 font-medium">Click to upload</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">Supported format: CSV</p>

            <input type="file" accept=".csv" className="hidden" />
          </label>

          <div className="flex justify-end mt-5">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md">
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
