import { Icon } from "@iconify/react";
import CustomTable from "../../Components/CustomTable";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PrimarySaleUpload from "../../Components/PrimarySaleUpload";
import { useQuery } from "@tanstack/react-query";
import { getAllPrimarySales } from "../../api/primaryServices";
const titles = [
  "ID",
  "Distributors Name",
  "Area",
  "Total Primary Qty(CTN)",
  "Total Sale Qty(CTN)",
  "Floor Stock Qty (CTN)",
  "Floor Stock Value",
  "Status",
];
const datafff = [
  ["DIS-007", "Lahore", "Noorsons", "8,000", "1,600", "8000", "18000", "Good"],
];
export default function PrimarySale() {
  const [openImport, setOpenImport] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "MediRep | Primary Sale";
  }, []);
  const { data, refetch, isFetching } = useQuery({
    queryKey: ["PrimarySales"],
    queryFn: () => getAllPrimarySales(),
    staleTime: 5 * 60 * 1000,
  });

  let AllSales = data?.data?.data;
  console.log("🚀 ~ PrimarySale ~ data:", AllSales);

  let tableData: any = [];
  AllSales?.map((v: any) => {
    tableData.push([
      v?.distributorId,
      v?.distributorName,
      v?.area,
      v?.primarySale,
      v?.totalSaleQNT,
      v?.floorStockQNT,
      v?.floorStockValue,
      v?.status,
    ]);
  });
  const handleGoToDetail = (rowIndex: number) => {
    const rowData = AllSales[rowIndex]; // get full object using index
    if (rowData) {
      navigate("/primarySale/primarySaleDetails", { state: rowData });
    }
  };

  return (
    <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
      <div className="flex flex-wrap lg:flex-nowrap justify-between items-start gap-4">
        <p className="text-heading font-medium text-[22px] lg:text-[24px]">
          Primary Sale
        </p>
        <div className="flex flex-wrap sm:flex-nowrap gap-4 items-center">
          <button
            onClick={() => {
              setOpenImport(true);
            }}
            className="h-[55px] w-full min-w-[172px] bg-white rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
          >
            <Icon
              icon="solar:upload-linear"
              height="24"
              width="24"
              color="#131313"
            />
            <p className="text-heading text-base font-medium">Import</p>
          </button>{" "}
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
          <CustomTable
            titles={titles}
            data={tableData}
            handleGoToDetail={handleGoToDetail}
          />
        </div>
      </div>
      {openImport && (
        <PrimarySaleUpload closeModle={setOpenImport} refetch={refetch} />
      )}
    </div>
  );
}
