import { useEffect } from "react";
import CustomTable from "../../Components/CustomTable";
import { BiMessageDetail } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllReports } from "../../api/callReporting";

const titles = [
  "Call ID",
  "MR Name",
  "Doctor Name",
  "Area",
  "Check in",
  "Check out",
  "Action",
];

export default function CallReporting() {
  const { data, refetch, isFetching } = useQuery({
    queryKey: ["AllReports"],
    queryFn: () => getAllReports(),
    staleTime: 5 * 60 * 1000,
  });
  let Reports = data?.data;
  let tableData: any = [];
  Reports?.map((v: any) => {
    tableData.push([
      v?.callId,
      v?.mrName,
      v?.doctorName,
      v?.area,
      v?.checkIn,
      v?.checkOut,
      <div
        onClick={() => {
          handleDetail(v);
        }}
        className="flex items-center cursor-pointer"
      >
        <BiMessageDetail size={16} className="inline text-[#7d7d7d] mr-2" />
        <p>Details</p>
      </div>,
    ]);
  });

  useEffect(() => {
    document.title = "MediRep | Call Reporting";
    refetch();
  }, []);
  const navigate = useNavigate();

  const handleDetail = (v: any) => {
    navigate("callReportingDetail", { state: { v } });
  };

  return (
    <>
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <p className="text-heading font-medium text-[22px] sm:text-[24px]">
            Call Reporting
          </p>
        </div>
        <div className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(90vh-110px)] lg:h-[calc(90vh-142px)] h-auto ">
          <p className="text-[#7D7D7D] font-medium text-sm">
            Recent Interactions
          </p>
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="scroll-smooth bg-white rounded-lg 2xl:h-[calc(85vh-127px)] xl:h-[calc(65vh-35px)] mt-4 overflow-y-auto scrollbar-none"
          >
            <CustomTable
              titles={titles}
              data={tableData}
              show="default"
              isFetching={isFetching}
            />
          </div>
        </div>
      </div>
    </>
  );
}
