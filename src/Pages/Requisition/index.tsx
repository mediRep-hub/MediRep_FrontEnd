import { useEffect, useState } from "react";
import CustomTable from "../../Components/CustomTable";
import { useQuery } from "@tanstack/react-query";
import { getAllRequisition } from "../../api/requisitionServices";
import { useNavigate } from "react-router-dom";
import Pagination from "../../Components/Pagination";

const titles = [
  "Requisition ID",
  "Doctor Name",
  "MR Name",
  "Product",
  "Quantity",
  "Duration",
  "Requisition Type",
  "Status",
];

export default function Requisition() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isFetching } = useQuery({
    queryKey: ["AllRequisition", page],
    queryFn: () => getAllRequisition(page, limit),
    placeholderData: (previous) => previous,
    staleTime: 5 * 60 * 1000,
  });

  const result = data?.data;
  const Requisitions = data?.data?.requisitions || [];
  const tableData: any = [];
  Requisitions?.map((v: any) => {
    tableData.push([
      v?.reqId,
      v?.doctorName,
      v?.mrName,
      v.product.map((p: any) => `${p.name} (${p.quantity})`).join(", "),
      v?.totalQuantity,
      v?.duration,
      <p className="capitalize">{v?.requisitionType}</p>,
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

  const handleGoDetails = (requisition: any) => {
    navigate("/requisition/requisitionDetail", {
      state: { requisition },
    });
  };

  useEffect(() => {
    document.title = "MediRep | Requisitions";
  }, []);

  return (
    <>
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <p className="text-heading font-medium text-[22px] sm:text-[24px]">
            Requisitions
          </p>
        </div>

        <div className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(92vh-130px)] xl:h-[calc(90vh-142px)] h-auto ">
          <div className="flex justify-between items-center">
            <p className="text-[#7D7D7D] font-medium text-sm">
              Requisition List
            </p>

            <Pagination
              currentPage={page}
              totalItems={result?.totalItems}
              itemsPerPage={limit}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>

          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(87vh-145px)] xl:h-[calc(65vh-35px)] mt-4 overflow-y-auto scrollbar-none"
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
