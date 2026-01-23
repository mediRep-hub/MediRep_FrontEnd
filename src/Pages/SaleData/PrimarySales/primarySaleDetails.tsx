import { Icon } from "@iconify/react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CustomTable from "../../../Components/CustomTable";
import { useEffect } from "react";

const titles = [
  "SKU",
  "Product",
  "Opening Balance Qty(CTN)",
  "Purchase Qty(CTN)",
  "Purchase-Ret Qty(CTN)",
  "Net Sale Qty/Value",
  "Closing Stock Qty/Value",
];
const tableDataTitles = [
  [
    "SKU-001",
    "Naunehal Baby Soap 100gm",
    120,
    80,
    10,
    <div>
      <p>Qty: 150</p>
      <p>Rs: 550000</p>
    </div>,
    <div>
      <p>Qty: 40</p>
      <p>Rs: 180000</p>
    </div>,
  ],
  [
    "SKU-002",
    "Naunehal Baby Oil 100ml",
    90,
    60,
    5,
    <div>
      <p>Qty: 120</p>
      <p>Rs: 420000</p>
    </div>,
    <div>
      <p>Qty: 25</p>
      <p>Rs: 150000</p>
    </div>,
  ],
];

export default function PrimarySaleDetails() {
  const navigate = useNavigate();
  const handleGoToBack = () => {
    navigate("/primarySale");
  };
  useEffect(() => {
    document.title = "MediRep | Primary Sale Datails";
  }, []);
  return (
    <>
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap lg:flex-nowrap justify-between items-start gap-4">
          <div className="flex flex-wrap items-center gap-4 ">
            <div
              onClick={handleGoToBack}
              className="w-10 h-10 border-[#7d7d7d] border-[1px] rounded-lg cursor-pointer flex justify-center items-center"
            >
              <FaArrowLeft size={16} color="#000000" />
            </div>
            <p className="text-heading font-medium text-[22px] sm:text-[24px]">
              Primary Sale
            </p>
          </div>

          <div className="flex flex-wrap w-full md:w-auto sm:flex-nowrap gap-4 items-center">
            {" "}
            <button
              className="h-[55px] w-[calc(50%-8px)] md:w-[160px] bg-white cursor-pointer rounded-[6px] gap-3 flex justify-center items-center 
               "
            >
              <Icon
                icon="solar:upload-linear"
                height="24"
                width="24"
                color="#131313"
              />
              <p>Upload</p>
            </button>
            <button
              className="h-[55px] w-[calc(50%-8px)] md:w-[160px] bg-[#E5EBF7] rounded-[6px] gap-3 flex justify-center items-center 
           "
            >
              {" "}
              <p className="text-primary font-medium">Download</p>
              <Icon
                icon="solar:download-linear"
                height="24"
                width="24"
                color="#0755E9"
              />
            </button>
            <button className="h-[55px] w-full md:w-[192px] bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center">
              <Icon
                icon="grommet-icons:status-good"
                height="20"
                width="20"
                color="#fff"
              />
              <p className="text-white text-base font-medium">POA </p>
            </button>
          </div>
        </div>{" "}
        <div className="bg-[#E5EBF7]  mt-4 rounded-[12px] p-4 2xl:h-[calc(75.5vh-0px)] lg:h-[calc(64vh-0px)] h-auto ">
          <p className="text-sm text-[#7d7d7d] leading-[100%]">
            Noorsons Distributor Detail Stock Report
          </p>
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="scroll-smooth mt-4 md:gap-0 gap-5 bg-white rounded-lg 2xl:h-[calc(69vh-0px)] xl:h-[calc(59vh-0px)] overflow-y-auto scrollbar-none"
          >
            <CustomTable titles={titles} data={tableDataTitles} />
          </div>{" "}
        </div>
      </div>
    </>
  );
}
