import { Icon } from "@iconify/react";
import CustomTable from "../../Components/CustomTable";
import { useLocation, useNavigate } from "react-router-dom";
import PrimarySaleUpload from "../../Components/PrimarySaleUpload";
import { useEffect, useState } from "react";
const titles = [
  "SKU",
  "Product",
  "Opening Balance Qty(CTN)",
  "Purchase Qty(CTN)",
  "Purchase Return Qty(CTN) ",
  "Sale Qty (CTN)",
  "Sale Return Qty (CTN)",
  "Net Sale Qty (CTN)",
  "Floor Stock Value",
];

export default function PrimarySaleDetails() {
  const { state } = useLocation();
  useEffect(() => {
    document.title = "MediRep | Primary Sale Datails";
  }, []);
  console.log("Primary Sale Details:", state);
  const [openImport, setOpenImport] = useState(false);

  const formattedData: any[][] =
    state?.products?.map((item: any) => [
      item.sku,
      item.productName,
      item.openBalance,
      item.purchaseQNT,
      item.purchaseReturn,
      item.saleQty,
      item.saleReturnQNT,
      item.netSale,
      item.floorStockValue,
    ]) || [];

  const navigate = useNavigate();

  const handleGoToBack = () => {
    navigate("/primarySale");
  };
  return (
    <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
      <div className="flex flex-wrap lg:flex-nowrap justify-between items-start gap-4">
        <div className="flex gap-3 items-center">
          <div
            onClick={handleGoToBack}
            className="cursor-pointer h-10 w-10 border-[1px] border-[#D2D2D2] rounded-[12px] flex justify-center items-center"
          >
            <Icon
              icon="famicons:arrow-back-outline"
              height="20px"
              width="20px"
              color="#131313"
            />
          </div>
          <p className="text-heading font-medium text-[22px] lg:text-[24px]">
            Primary Sale
          </p>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap gap-4 items-center">
          {/* <button className="h-[55px] w-full min-w-[172px] bg-[#E5EBF7] rounded-[6px] gap-3 cursor-pointer flex justify-center items-center">
            <Icon
              icon="solar:download-linear"
              height="24"
              width="24"
              color="#0755E9"
            />
            <p className="text-primary text-base font-medium">Download</p>
          </button> */}
          <button className="h-[55px] w-full min-w-[192px] bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center">
            <Icon
              icon="grommet-icons:status-good"
              height="20"
              width="20"
              color="#fff"
            />
            <p className="text-white text-base font-medium">POA</p>
          </button>
        </div>
      </div>
      <div
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(76vh-0px)] xl:h-[calc(64vh-0px)] overflow-y-auto scrollbar-none"
      >
        <p className="text-[#7d7d7d] text-sm">
          Distributor Details Stock Report
        </p>
        <div
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(68.5vh-0px)] xl:h-[calc(53vh-0px)]  mt-4 overflow-y-auto scrollbar-none"
        >
          <CustomTable titles={titles} data={formattedData} />
        </div>
      </div>{" "}
      {openImport && <PrimarySaleUpload closeModle={setOpenImport} />}
    </div>
  );
}
