import { useEffect } from "react";
import CustomTable from "../../Components/CustomTable";
import { useQuery } from "@tanstack/react-query";
import { getAllRequisition } from "../../api/requisitionServices";
import { useNavigate } from "react-router-dom";

const titles = [
  "Requisition ID",
  "Doctor Name",
  "MR Name",
  "Product",
  "Quantity",
  "Duration",
  "Amount",
  "Status",
];

export default function Requisition() {
  const { data, refetch, isFetching } = useQuery({
    queryKey: ["AllRequisition"],
    queryFn: () => getAllRequisition(),
    staleTime: 5 * 60 * 1000,
  });
  let Requisitions = data?.data?.requisitions;
  console.log("🚀 ~ Requisition ~ Requisitions:", Requisitions);
  let tableData: any = [];
  Requisitions?.map((v: any) => {
    tableData.push([
      v?.reqId,
      v?.doctorName,
      v?.mrName,
      v?.product?.map((p: any) => p.name).join(", "),
      v?.totalQuantity,
      v?.totalDuration,
      v?.totalAmount,
      <p
        className={`inline-block rounded-[3px] px-2 mt-3 font-normal text-sm border ${
          v?.status === "Pending"
            ? "text-[#E90761] border-[#E90761]"
            : v?.status === "Approved"
            ? "text-primary border-primary"
            : v?.status === "Rejected"
            ? "text-[#FF9500] border-[#FF9500]"
            : v?.status === "Paid"
            ? "text-[#0BA69C] border-[#0BA69C]"
            : "text-gray-500 border-gray-500"
        }`}
      >
        {v?.status}
      </p>,
    ]);
  });

  useEffect(() => {
    document.title = "MediRep | Requisitions";
    refetch();
  }, []);
  const navigate = useNavigate();
  const handleGoDetails = (requisition: any) => {
    navigate("/requisition/requisitionDetail", {
      state: { requisition },
    });
  };
  return (
    <>
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <p className="text-heading font-medium text-[22px] sm:text-[24px]">
            Requisitions
          </p>
        </div>
        <div className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(92vh-130px)] xl:h-[calc(90vh-142px)] h-auto ">
          <p className="text-[#7D7D7D] font-medium text-sm">Requisition List</p>
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(87vh-145px)] xl:h-[calc(65vh-35px)]  mt-4 overflow-y-auto scrollbar-none"
          >
            <CustomTable
              titles={titles}
              isFetching={isFetching}
              data={tableData}
              handleGoToDetail={(index) => handleGoDetails(Requisitions[index])}
            />
          </div>
        </div>
      </div>
    </>
  );
}
