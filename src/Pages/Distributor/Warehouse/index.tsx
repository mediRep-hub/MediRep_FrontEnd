import { IoMdEye } from "react-icons/io";
import circle1 from "../../../assets/circle1.png";
import circle2 from "../../../assets/circle2.png";
import CustomTable from "../../../Components/CustomTable";
import SearchBar from "../../../Components/SearchBar";
import Pagination from "../../../Components/Pagination";
import { useEffect } from "react";
const titles = [
  "Product SKU",
  "Product Name",
  "Category",
  "Form",
  "Status",
  "Amount",
  "Image",
];
const data = [
  [
    "SKU10001",
    "Xtreme -mg — 4C-8P",
    "Tablet",
    "Oral",
    "Available",
    " Rs.500",
    <div className="flex items-center gap-1">
      <IoMdEye size={16} color="#7d7d7d" />
      <p>View</p>
    </div>,
  ],
  [
    "SKU10002",
    "Neurox -mg — 5C-2M",
    "Injection",
    "Liquid",
    "Out of Stock",
    "Rs.1000",
    <div className="flex items-center gap-1">
      <IoMdEye size={16} color="#7d7d7d" />
      <p>View</p>
    </div>,
  ],
  [
    "SKU10003",
    "Cardex -mg — 1A-9F",
    "Capsule",
    "Oral",
    "Available",
    "Rs.750",
    <div className="flex items-center gap-1">
      <IoMdEye size={16} color="#7d7d7d" />
      <p>View</p>
    </div>,
  ],
  [
    "SKU10004",
    "Glucobeta -mg — 3B-6K",
    "Tablet",
    "Oral",
    "Available",
    "Rs.600",
    <div className="flex items-center gap-1">
      <IoMdEye size={16} color="#7d7d7d" />
      <p>View</p>
    </div>,
  ],
  [
    "SKU10005",
    "Painrelief -mg — 2C-7P",
    "Capsule",
    "Oral",
    "Out of Stock",
    "Rs.450",
    <div className="flex items-center gap-1">
      <IoMdEye size={16} color="#7d7d7d" />
      <p>View</p>
    </div>,
  ],
  [
    "SKU10006",
    "Cardiomed -mg — 6D-4R",
    "Injection",
    "Liquid",
    "Available",
    "Rs.1200",
    <div className="flex items-center gap-1">
      <IoMdEye size={16} color="#7d7d7d" />
      <p>View</p>
    </div>,
  ],
  [
    "SKU10007",
    "Neuroplus -mg — 7A-1M",
    "Tablet",
    "Oral",
    "Available",
    " Rs.800",
    <div className="flex items-center gap-1">
      <IoMdEye size={16} color="#7d7d7d" />
      <p>View</p>
    </div>,
  ],
  [
    "SKU10008",
    "XtremeMax -mg — 8F-3C",
    "Capsule",
    "Oral",
    "Out of Stock",
    "Rs.550",
    <div className="flex items-center gap-1">
      <IoMdEye size={16} color="#7d7d7d" />
      <p>View</p>
    </div>,
  ],
  [
    "SKU10009",
    "Glucocare -mg — 9E-5B",
    "Tablet",
    "Oral",
    "Available",
    "Rs.700",
    <div className="flex items-center gap-1">
      <IoMdEye size={16} color="#7d7d7d" />
      <p>View</p>
    </div>,
  ],
  [
    "SKU10010",
    "Painaway -mg — 10C-2D",
    "Injection",
    "Liquid",
    "Available",
    "Rs.1100",
    <div className="flex items-center gap-1">
      <IoMdEye size={16} color="#7d7d7d" />
      <p>View</p>
    </div>,
  ],
];
export default function Warehouse() {
  useEffect(() => {
    document.title = "MediRep | Warehouse";
  }, []);
  return (
    <>
      <div className="sticky top-0">
        {" "}
        <SearchBar />
      </div>

      <div className="mt-4">
        {" "}
        <div
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="bg-secondary md:h-[calc(100vh-129px)] overflow-y-auto h-auto rounded-xl p-4 flex flex-col gap-4"
        >
          <div className="flex flex-wrap gap-4">
            <div className="px-4 bg-white h-[150px] w-full lg:w-[calc(50%-8px)] rounded-[12px] flex justify-between">
              <div className="w-[40%] py-4 flex flex-col justify-between">
                <p className="text-[#7D7D7D] text-base">Total Stock</p>
                <div className="flex gap-5 items-center">
                  <div>
                    <p className="text-heading font-bold text-lg">
                      <span className="text-sm">Rs.</span>1,032,000
                    </p>
                    <p className="text-heading text-base">Today Value</p>
                  </div>
                  <div className="border-heading border-l-[1px] h-12"></div>
                  <div>
                    <p className="text-heading font-bold text-lg">185.36</p>
                    <p className="text-heading text-base">Total Carton’s</p>
                  </div>
                </div>
              </div>
              <div className="w-auto flex items-center">
                <img src={circle2} />
              </div>
            </div>
            <div className="px-4 bg-white h-[150px] w-full lg:w-[calc(50%-8px)] rounded-[12px] flex justify-between">
              <div className="w-[40%] py-4 flex flex-col justify-between">
                <p className="text-[#7D7D7D] text-base">Damage/Expiry</p>{" "}
                <div className="flex gap-5 items-center">
                  <div>
                    <p className="text-heading font-bold text-lg">
                      <span className="text-sm">Rs.</span>32,000
                    </p>
                    <p className="text-heading text-base">Today Value</p>
                  </div>
                  <div className="border-heading border-l-[1px] h-12"></div>
                  <div>
                    <p className="text-heading font-bold text-lg">1,118 </p>
                    <p className="text-heading text-base">Total Carton’s</p>
                  </div>
                </div>
              </div>
              <div className="w-auto flex items-center">
                <img src={circle1} />
              </div>
            </div>
          </div>
          <div className="bg-[#E5EBF7] rounded-[12px] p-4 2xl:h-[calc(90vh-122px)] lg:h-[calc(90vh-162px)] h-auto ">
            <div className="flex justify-between items-center">
              <p className="text-[#7D7D7D] text-sm leading-[100%]">
                Stock List
              </p>
              <Pagination />
            </div>
            <div
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              className="scroll-smooth bg-white rounded-lg 2xl:h-[calc(77vh-146px)] xl:h-[calc(61vh-60px)] mt-4 overflow-y-auto scrollbar-none"
            >
              {" "}
              <CustomTable titles={titles} data={data} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
