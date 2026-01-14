import { Icon } from "@iconify/react";
import CustomTable from "../../Components/CustomTable";
import BulkUploadModal from "../../Components/SecondarySaleUpload";

import { useEffect, useState } from "react";
const tableData = [
  [
    "D002",
    "XYZ Traders",
    "South",
    "Chennai",
    "2024-01-12",
    "Amit",
    "Brick B",
    "View",
  ],
  [
    "D003",
    "Noor Sons",
    "East",
    "Kolkata",
    "2024-01-15",
    "Imran",
    "Brick C",
    "View",
  ],
  [
    "D004",
    "Prime Supplies",
    "West",
    "Mumbai",
    "2024-01-18",
    "Salman",
    "Brick D",
    "View",
  ],
];
const tableDataGroup = [
  [
    "Noor Sons Group",
    "North Punjab",
    "Lahore",
    12,
    8,
    "Paracetamol, Amoxicillin",
    "5000 Units",
    "4200 Units",
    "View",
  ],
  [
    "ABC Distributors Group",
    "South Punjab",
    "Multan",
    9,
    5,
    "Ibuprofen, Vitamin C",
    "3500 Units",
    "2900 Units",
    "View",
  ],
  [
    "Prime Traders Group",
    "Central Punjab",
    "Faisalabad",
    15,
    10,
    "Cough Syrup, Antibiotics",
    "6000 Units",
    "5100 Units",
    "View",
  ],
];

export default function SecondarySale() {
  const [selectTab, setSelectTab] = useState<"Individual Sale" | "Group Sale">(
    "Individual Sale"
  );
  const [openUploadModal, setOpenUploadModal] = useState(false);
  useEffect(() => {
    document.title = "MediRep | Secondary Sale";
  }, []);

  return (
    <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
      <div className="flex flex-wrap lg:flex-nowrap justify-between items-start gap-4">
        <p className="text-heading font-medium text-[22px] lg:text-[24px]">
          Secondary Sale
        </p>
        <div className="flex flex-wrap sm:flex-nowrap gap-4 items-center">
          <button
            onClick={() => setOpenUploadModal(true)}
            className="h-[55px] w-full min-w-[172px] bg-white rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
          >
            <Icon
              icon="solar:upload-linear"
              height="24"
              width="24"
              color="#131313"
            />
            <p className="text-heading text-base font-medium">Import</p>
          </button>
          <button className="h-[55px] w-full min-w-[172px] bg-[#E5EBF7] rounded-[6px] gap-3 cursor-pointer flex justify-center items-center">
            <Icon
              icon="solar:download-linear"
              height="24"
              width="24"
              color="#0755E9"
            />
            <p className="text-primary text-base font-medium">Download</p>
          </button>
          <button className="h-[55px] w-full min-w-[192px] bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center">
            <Icon
              icon="mingcute:add-fill"
              height="20"
              width="20"
              color="#fff"
            />
            <p className="text-white text-base font-medium">Generate GRN</p>
          </button>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        {["Individual Sale", "Group Sale"].map((tab) => (
          <button
            key={tab}
            className={`w-[120px] text-sm h-12 rounded-t-lg ${
              selectTab === tab
                ? "bg-[#E5EBF7] text-heading"
                : "bg-white text-[#7d7d7d]"
            }`}
            onClick={() => {
              setSelectTab(tab as typeof selectTab);
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <div
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        className={`bg-[#E5EBF7] rounded-[12px] p-4 
          2xl:h-[calc(71vh-0px)] 
          xl:h-[calc(60vh-0px)] 
          overflow-y-auto scrollbar-none
          ${
            selectTab === "Group Sale" ? "rounded-tl-[12px]" : "rounded-tl-none"
          }
        `}
      >
        <p className="text-[#7d7d7d] text-sm">
          {selectTab === "Group Sale" ? "Group List" : "Bricks List"}
        </p>
        <div
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="scroll-smooth  bg-white rounded-xl 2xl:h-[calc(64vh-0px)] xl:h-[calc(49vh-0px)]  mt-4 overflow-y-auto scrollbar-none"
        >
          <CustomTable
            titles={
              selectTab === "Individual Sale"
                ? [
                    "MR Name",
                    "Region",
                    "Area",
                    "Brick Name",
                    "Products ",
                    "Target Qty/Value",
                    "Total Sale Qty/Value",
                    "Action",
                  ]
                : [
                    "Group Name",
                    "Region",
                    "Area",
                    "No Of Bricks",
                    "Active MR ",
                    "Products",
                    "Target Qty/Value",
                    "Target Sale Qty/Value",
                    "Action",
                  ]
            }
            data={selectTab === "Individual Sale" ? tableData : tableDataGroup}
          />
        </div>
      </div>
      <BulkUploadModal
        open={openUploadModal}
        onClose={() => setOpenUploadModal(false)}
      />
    </div>
  );
}
