import CustomTable from "../../Components/CustomTable";
import Pagination from "../../Components/Pagination";

const titles = [
  "Requisition ID",
  "Doctor Name",
  "MR Name",
  "Product",
  "Actual Sales Qty",
  "Achievement %",
  "Status",
];
const Data = [
  ["REQ-001", "Dr. Ali", "Ahmed", "Panadol", 120, "85%", "Below Target"],
  ["REQ-002", "Dr. Sara", "Usman", "Brufen", 90, "70%", "Average"],
  ["REQ-003", "Dr. Khan", "Bilal", "Calpol", 150, "95%", "Below Target"],
];

export default function TrackRequisition() {
  return (
    <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
      <div className="flex flex-wrap gap-4 justify-between items-start">
        <p className="text-heading w-full lg:w-auto font-medium text-[22px] sm:text-[24px]">
          Track Requisition
        </p>
      </div>
      <div className="bg-[#E5EBF7]  gap-4 mt-4 rounded-[12px] p-4 2xl:h-[calc(77.7vh-0px)] xl:h-[calc(64vh-0px)] h-auto ">
        <div className="flex justify-between items-center">
          <p className="text-[#7D7D7D] font-medium text-sm">Requisition List</p>

          <Pagination />
        </div>
        <div
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(70.2vh-0px)] xl:h-[calc(54vh-0px)] mt-4 overflow-y-auto scrollbar-none"
        >
          <CustomTable titles={titles} data={Data} />
        </div>
      </div>
    </div>
  );
}
