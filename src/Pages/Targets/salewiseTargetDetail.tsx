import { useLocation, useNavigate } from "react-router-dom";
import { MonthYearPicker } from "../../Components/FilterMonthYear";
import SearchByName from "../../Components/SearchBar/searchByName";
import CustomTable from "../../Components/CustomTable";
import { Icon } from "@iconify/react";

const titles = [
  "Employee Name",
  "City",
  "Brick",
  "Enter Target",
  "Achievement",
  "Percentage",
];

export default function SalewiseTargetDetail() {
  const { state } = useLocation();
  const rowData = state?.row;
  const navigate = useNavigate();
  const handleGoToBack = () => {
    navigate("/targets-achievements");
  };
  console.log(rowData);
  const tableData = rowData?.details?.map((d: any) => [
    d.employeeName,
    d.city,
    d.brick,
    d.target,
    d.achievement,
    d.percentage,
  ]);
  return (
    <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
      <div className="flex flex-wrap gap-4 items-start justify-between">
        <div className="flex flex-wrap  gap-3 items-center">
          <div
            onClick={handleGoToBack}
            className="h-10 w-10 cursor-pointer rounded-lg border border-[#D2D2D2] flex justify-center items-center bg-white"
          >
            <Icon
              icon="material-symbols:arrow-back-rounded"
              className="text-xl text-heading"
            />
          </div>
          <p className="text-heading font-medium text-[22px] sm:text-[24px]">
            ZSM Target
          </p>
        </div>

        <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
          <div className="md:w-[190px] w-full ">
            <MonthYearPicker />
          </div>
          <div className="w-[220px]">
            <SearchByName name="MR Name:" />
          </div>
          <div className="w-[220px]">
            <SearchByName name="Brick Name:" />
          </div>{" "}
          <div className="w-[220px]">
            <SearchByName name="City:" />
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-[12px] bg-[#E5EBF7] p-4 2xl:h-[calc(76.7vh-0px)] xl:h-[calc(60vh-0px)] h-auto ">
        <p className="text-[#7D7D7D] font-medium text-sm">
          {rowData.mrName} {rowData.asm} Wise Target
        </p>
        <div
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(69.5vh-0px)] xl:h-[calc(50vh-0px)] mt-4 overflow-y-auto scrollbar-none"
        >
          <CustomTable titles={titles} data={tableData} />
        </div>
      </div>
    </div>
  );
}
