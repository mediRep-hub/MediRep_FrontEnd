import { useEffect, useState } from "react";
import CustomTable from "../../Components/CustomTable";
import { useQuery } from "@tanstack/react-query";
import { getAllRequisition } from "../../api/requisitionServices";
import { useNavigate } from "react-router-dom";
import Pagination from "../../Components/Pagination";
import { SearchSelection } from "../../Components/SearchBar/SearchSelection";
import { getAllAccounts } from "../../api/adminServices";
import SearchDateRange from "../../Components/SearchBar/SearchDateRange";

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
  const [selectedMR, setSelectedMR] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<{
    start: string;
    end: string;
  }>({
    start: "",
    end: "",
  });
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isFetching } = useQuery({
    queryKey: [
      "AllRequisition",
      page,
      selectedMR,
      selectedDate.start,
      selectedDate.end,
    ],
    queryFn: () =>
      getAllRequisition(
        page,
        limit,
        selectedMR,
        selectedDate.start || undefined,
        selectedDate.end || undefined
      ),
    placeholderData: (previous) => previous,
    staleTime: 5 * 60 * 1000,
  });
  const { data: allMr } = useQuery({
    queryKey: ["AllAccount"],
    queryFn: () => getAllAccounts(),
    staleTime: 5 * 60 * 1000,
  });
  const AllMR = allMr?.data?.admins ?? [];
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
        className={`inline-block rounded-sm px-2 py-0.5 font-normal text-sm border ${
          v?.status === "Pending"
            ? "text-[#E90761] border-[#E90761]"
            : v?.status === "Approved"
            ? "text-primary border-primary"
            : v?.status === "Rejected"
            ? "text-[#FF9500] border-[#FF9500]"
            : v?.status === "Paid"
            ? "text-[#0BA69C] border-[#0BA69C]"
            : "text-[#7d7d7d] border-[#7d7d7d]"
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
  const handleFilter = () => {
    if (selectedMR === "All") setSelectedMR("");
  };
  return (
    <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
      <div className="flex flex-wrap items-start gap-4 justify-between">
        <p className="text-heading w-full md:w-auto font-medium text-[22px] sm:text-[24px]">
          Requisitions
        </p>
        <div className="flex flex-wrap w-full lg:w-auto items-center gap-3">
          <div className="w-full md:w-[300px]">
            <SearchSelection
              placeholder="Select MR"
              options={[
                "All",
                ...AllMR.filter(
                  (mr: any) => mr?.position === "MedicalRep(MR)"
                ).map((mr: any) => mr?.name),
              ]}
              value={selectedMR}
              onChange={(val) => {
                setSelectedMR(val);
                handleFilter();
              }}
            />
          </div>{" "}
          <div className="w-full md:w-[300px] md:mt-0 mt-2">
            <SearchDateRange
              onChange={(range: { start: string; end: string }) => {
                setSelectedDate(range);
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(91vh-130px)] xl:h-[calc(80vh-83px)] h-auto ">
        <div className="flex justify-between items-center">
          <p className="text-[#7D7D7D] font-medium text-sm">Requisition List</p>

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
          className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(86vh-150px)] xl:h-[calc(65vh-48px)] mt-4 overflow-y-auto scrollbar-none"
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
  );
}
