import { BiMessageDetail } from "react-icons/bi";
import CustomTable from "../../../Components/CustomTable";
import SearchBar from "../../../Components/SearchBar";
import { Icon } from "@iconify/react";
import Pagination from "../../../Components/Pagination";
import { useEffect } from "react";
const titles = [
  "Order ID",
  "Order Date",
  "MR Name",
  "Doctor/Pharmacy Name",
  "Strategy Name",
  "Order Type",
  "Amount",
  "Details",
];
const data = [
  [
    "ORD001",
    "2025-11-26",
    "Ali Khan",
    "Dr. Ahmed",
    "Promotion A",
    "Online",
    1200,
    <div className="flex gap-2">
      <BiMessageDetail color="#7d7d7d" size={20} />
      <p>Details</p>
    </div>,
  ],
  [
    "ORD002",
    "2025-11-25",
    "Sara Malik",
    "Pharmacy Plus",
    "Strategy B",
    "Offline",
    2500,
    <div className="flex gap-2">
      <BiMessageDetail color="#7d7d7d" size={20} />
      <p>Details</p>
    </div>,
  ],
  [
    "ORD003",
    "2025-11-24",
    "Bilal Hassan",
    "Dr. Rehman",
    "Promotion C",
    "Online",
    1800,
    <div className="flex gap-2">
      <BiMessageDetail color="#7d7d7d" size={20} />
      <p>Details</p>
    </div>,
  ],
  [
    "ORD004",
    "2025-11-23",
    "Ayesha Tariq",
    "PharmaCare",
    "Strategy D",
    "Offline",
    3200,
    <div className="flex gap-2">
      <BiMessageDetail color="#7d7d7d" size={20} />
      <p>Details</p>
    </div>,
  ],
  [
    "ORD005",
    "2025-11-22",
    "Omar Farooq",
    "Dr. Kamal",
    "Promotion E",
    "Online",
    1500,
    <div className="flex gap-2">
      <BiMessageDetail color="#7d7d7d" size={20} />
      <p>Details</p>
    </div>,
  ],
];

export default function SecondarySale() {
  useEffect(() => {
    document.title = "MediRep | Secondary Sale";
  }, []);
  return (
    <div>
      <div>
        <>
          <div className="sticky top-0">
            <SearchBar />
          </div>
          <div className="mt-4">
            <div
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              className="bg-secondary md:h-[calc(100vh-129px)] overflow-y-auto h-auto rounded-xl p-4 flex flex-col gap-4"
            >
              <div className="flex justify-between items-start">
                <p className="text-heading font-medium text-[22px] sm:text-[24px]">
                  Secondary Sale
                </p>
                <div className="flex gap-3 items-center">
                  <button className="h-[55px] w-full md:w-[180px] flex items-center justify-center gap-3 rounded-[6px] bg-[#E5EBF7]">
                    <Icon
                      icon="material-symbols-light:download-2-rounded"
                      className="text-primary text-[24px]"
                    />
                    <p className="text-primary text-base font-medium ml-2">
                      Download
                    </p>
                  </button>{" "}
                  <button className="h-[55px] w-full md:w-[180px] flex items-center justify-center gap-3 rounded-[6px] bg-[#E5EBF7]">
                    <Icon
                      icon="material-symbols-light:aod-tablet"
                      className="text-primary text-[24px]"
                    />
                    <p className="text-primary text-base font-medium ml-2">
                      Dispatch
                    </p>
                  </button>
                </div>
              </div>
              <div className="bg-[#E5EBF7] rounded-[12px] p-4 2xl:h-[calc(90vh-122px)] lg:h-[calc(90vh-162px)] h-auto ">
                <div className="flex justify-between items-center">
                  <p className="text-[#7D7D7D] text-sm leading-[100%]">
                    Orders List
                  </p>
                  <Pagination />
                </div>
                <div
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                  className="bg-white border-2 mt-3 border-primary w-full md:h-[calc(73vh-10px)] overflow-y-auto h-auto rounded-xl"
                >
                  {" "}
                  <CustomTable titles={titles} data={data} />
                </div>
              </div>
            </div>
          </div>
        </>
      </div>
    </div>
  );
}
