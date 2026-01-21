import { Icon } from "@iconify/react";
import CustomTable from "../../Components/CustomTable";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PrimarySaleUpload from "../../Components/PrimarySaleUpload";
import ReportFilterModal from "../../Components/ReportFilter";
import { LuSearch } from "react-icons/lu";
const titles = [
  "MR Name",
  "Region",
  "Area",
  "Products",
  "Brick Name",
  "Target Qty/Value",
  "Total Sale Qty/Value",
  "Action",
];
const titles22 = [
  "Group Name",
  "Region",
  "Area",
  "No Of Bricks",
  "Active MR",
  "Products",
  "Target Qty/Value",
  "Total Sale Qty/Value",
  "Action",
];

export default function SecondarySale() {
  const [openImport, setOpenImport] = useState(false);
  const [openReportModal, setOpenReportModal] = useState(false);
  const [selectTab, setSelectTab] = useState<"Individual Sale" | "Group Sale">(
    "Individual Sale",
  );
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "MediRep | Secondary Sale";
  }, []);

  const handleGoDetails = () => {
    navigate("/secondarySale/secondarySaleDetails", { state: selectTab });
  };

  const handleClose = () => {
    setOpenReportModal(false);
  };
  const tableDataTitles = [
    [
      "Cardio Alpha",
      "Lahore",
      "Canal Road",
      "Naunehal Baby Soap - 100 gm, Roghan B...",
      "Brick A",
      <div>
        <p>Qty: 7500</p>
        <p>Rs: 550000</p>
      </div>,
      <div>
        <p>Qty: 5500</p>
        <p>Rs: 312100</p>
      </div>,
      <div className="flex gap-2 items-center" onClick={handleGoDetails}>
        <Icon icon="iconoir:notes" height="16" width="16" color="#7d7d7d" />
        <p>Details</p>
      </div>,
    ],
    [
      "HealthCare Pharma",
      "Lahore",
      "Shadman",
      "Roghan Badam Shirin - 500 ml",
      "Brick B",
      <div>
        <p>Qty: 6000</p>
        <p>Rs: 420000</p>
      </div>,
      <div>
        <p>Qty: 4800</p>
        <p>Rs: 336000</p>
      </div>,
      <div className="flex gap-2 items-center" onClick={handleGoDetails}>
        <Icon icon="iconoir:notes" height="16" width="16" color="#7d7d7d" />
        <p>Details</p>
      </div>,
    ],
    [
      "LifeLine Traders",
      "Karachi",
      "Clifton",
      "Baby Soap - 200 gm",
      "Brick C",
      <div>
        <p>Qty: 8000</p>
        <p>Rs: 640000</p>
      </div>,
      <div>
        <p>Qty: 7200</p>
        <p>Rs: 576000</p>
      </div>,
      <div className="flex gap-2 items-center" onClick={handleGoDetails}>
        <Icon icon="iconoir:notes" height="16" width="16" color="#7d7d7d" />
        <p>Details</p>
      </div>,
    ],
    [
      "City Medicos",
      "Islamabad",
      "F-6 Markaz",
      "Roghan Arq - 100 ml",
      "Brick D",
      <div>
        <p>Qty: 5000</p>
        <p>Rs: 250000</p>
      </div>,
      <div>
        <p>Qty: 4500</p>
        <p>Rs: 225000</p>
      </div>,
      <div className="flex gap-2 items-center" onClick={handleGoDetails}>
        <Icon icon="iconoir:notes" height="16" width="16" color="#7d7d7d" />
        <p>Details</p>
      </div>,
    ],
    [
      "Good Health Supplies",
      "Peshawar",
      "University Town",
      "Baby Oil - 100 ml",
      "Brick E",
      <div>
        <p>Qty: 4000</p>
        <p>Rs: 200000</p>
      </div>,
      <div>
        <p>Qty: 3500</p>
        <p>Rs: 175000</p>
      </div>,
      <div className="flex gap-2 items-center" onClick={handleGoDetails}>
        <Icon icon="iconoir:notes" height="16" width="16" color="#7d7d7d" />
        <p>Details</p>
      </div>,
    ],
  ];

  const tableDataTitles22 = [
    [
      "Alpha Group",
      "Peshawar",
      "University Town",
      5,
      8,
      "Naunehal Baby Soap - 100 gm, Roghan B...",
      <div>
        <p>Qty: 7500</p>
        <p>Rs: 550000</p>
      </div>,
      <div>
        <p>Qty: 5500</p>
        <p>Rs: 312100</p>
      </div>,
      <div className="flex gap-2 items-center" onClick={handleGoDetails}>
        <Icon icon="iconoir:notes" height="16" width="16" color="#7d7d7d" />
        <p>Details</p>
      </div>,
    ],
    [
      "Beta Group",
      "Lahore",
      "Canal Road",
      4,
      7,
      "Roghan Badam Shirin - 500 ml",
      <div>
        <p>Qty: 6000</p>
        <p>Rs: 420000</p>
      </div>,
      <div>
        <p>Qty: 4800</p>
        <p>Rs: 336000</p>
      </div>,
      <div className="flex gap-2 items-center" onClick={handleGoDetails}>
        <Icon icon="iconoir:notes" height="16" width="16" color="#7d7d7d" />
        <p>Details</p>
      </div>,
    ],
    [
      "Gamma Group",
      "Karachi",
      "Clifton",
      6,
      9,
      "Baby Soap - 200 gm",
      <div>
        <p>Qty: 8000</p>
        <p>Rs: 640000</p>
      </div>,
      <div>
        <p>Qty: 7200</p>
        <p>Rs: 576000</p>
      </div>,
      <div className="flex gap-2 items-center" onClick={handleGoDetails}>
        <Icon icon="iconoir:notes" height="16" width="16" color="#7d7d7d" />
        <p>Details</p>
      </div>,
    ],
    [
      "Delta Group",
      "Islamabad",
      "F-6 Markaz",
      3,
      5,
      "Roghan Arq - 100 ml",
      <div>
        <p>Qty: 5000</p>
        <p>Rs: 250000</p>
      </div>,
      <div>
        <p>Qty: 4500</p>
        <p>Rs: 225000</p>
      </div>,
      <div className="flex gap-2 items-center" onClick={handleGoDetails}>
        <Icon icon="iconoir:notes" height="16" width="16" color="#7d7d7d" />
        <p>Details</p>
      </div>,
    ],
    [
      "Epsilon Group",
      "Lahore",
      "Shadman",
      2,
      4,
      "Baby Oil - 100 ml",
      <div>
        <p>Qty: 4000</p>
        <p>Rs: 200000</p>
      </div>,
      <div>
        <p>Qty: 3500</p>
        <p>Rs: 175000</p>
      </div>,
      <div className="flex gap-2 items-center" onClick={handleGoDetails}>
        <Icon icon="iconoir:notes" height="16" width="16" color="#7d7d7d" />
        <p>Details</p>
      </div>,
    ],
  ];
  return (
    <>
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap lg:flex-nowrap justify-between items-start gap-4">
          <p className="text-heading font-medium text-[22px] lg:text-[24px]">
            Secondary Sale
          </p>
          <div className="flex flex-wrap sm:flex-nowrap gap-4 items-center">
            {" "}
            <div className=" w-[200] flex items-center gap-2">
              <p className="text-sm text-[#131313] font-medium">Brick Name:</p>
              <div className="relative flex items-center">
                <LuSearch
                  className="absolute left-2 text-[#7d7d7d]"
                  size={16}
                />

                <input
                  placeholder="Search"
                  type="text"
                  className="h-[40px] pl-[30px] pr-3 w-full border font-normal border-primary rounded-md text-xs text-heading focus:outline-none"
                />
              </div>
            </div>
            <div className=" w-[200] flex items-center gap-2">
              <p className="text-sm text-[#131313] font-medium">City:</p>
              <div className="relative flex items-center">
                <LuSearch
                  className="absolute left-2 text-[#7d7d7d]"
                  size={16}
                />

                <input
                  placeholder="Search"
                  type="text"
                  className="h-[40px] pl-[30px] pr-3 w-full border font-normal border-primary rounded-md text-xs text-heading focus:outline-none"
                />
              </div>
            </div>
            <button className="h-[55px] w-[60px] bg-primary cursor-pointer rounded-[6px] gap-3 flex justify-center items-center ">
              <Icon
                icon="solar:upload-linear"
                height="24"
                width="24"
                color="#fff"
              />
            </button>
            <button className="h-[55px] bg-white w-[60px]  rounded-[6px] gap-3 flex justify-center items-center">
              <Icon
                icon="solar:download-linear"
                height="24"
                width="24"
                color="#131313"
              />
            </button>
            <button
              onClick={() => {
                setOpenReportModal(true);
              }}
              className="h-[55px] w-full md:w-[192px] bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
            >
              <Icon
                icon="mingcute:add-fill"
                height="20"
                width="20"
                color="#fff"
              />
              <p className="text-white text-base font-medium">
                Generate Reports{" "}
              </p>
            </button>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          {["Individual Sale", "Group Sale"].map((tab) => (
            <button
              key={tab}
              className={`w-[150px] h-12 rounded-t-lg ${
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
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className={`rounded-[12px] bg-[#E5EBF7] p-4 2xl:h-[calc(70.7vh-0px)] xl:h-[calc(56vh-0px)] h-auto ${
            selectTab === "Individual Sale"
              ? "rounded-tl-none"
              : "rounded-tl-[12px]"
          }`}
        >
          <p className="text-[#7d7d7d] text-sm">
            {selectTab == "Individual Sale" ? "Bricks List" : "Groups List"}
          </p>
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(63.2vh-0px)] xl:h-[calc(45vh-0px)] mt-4 overflow-y-auto scrollbar-none"
          >
            <CustomTable
              titles={selectTab == "Individual Sale" ? titles : titles22}
              data={
                selectTab == "Individual Sale"
                  ? tableDataTitles
                  : tableDataTitles22
              }
            />
          </div>
        </div>
        {openImport && <PrimarySaleUpload closeModle={setOpenImport} />}
      </div>
      {openReportModal && (
        <>
          <ReportFilterModal close={handleClose} />{" "}
        </>
      )}
    </>
  );
}
