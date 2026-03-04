import { useLocation, useNavigate } from "react-router-dom";
import { MonthYearPicker } from "../../Components/FilterMonthYear";
import SearchByName from "../../Components/SearchBar/searchByName";
import { FaArrowLeft } from "react-icons/fa";
import { Icon } from "@iconify/react";
import CustomTable from "../../Components/CustomTable";

const titles = [
  "Employee Name",
  "City",
  "Brick",
  "Enter Target",
  "Achievement",
  "Percentage",
];

export default function AsmTarget() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const rowData = state?.row;
  const handleGoBack = () => {
    navigate(-1);
  };

  if (!rowData) {
    return <p className="p-4">No Data Found</p>;
  }

  const tableData = state?.asmData?.map((d: any) => [
    d.employeeName,
    d.city,
    d.brick,
    d.target,
    d.achievement,
    d.percentage,
  ]);

  return (
    <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div
            onClick={handleGoBack}
            className="border cursor-pointer flex justify-center items-center border-[#D2D2D2] h-[44px] w-[44px] rounded-xl"
          >
            <FaArrowLeft size={16} color="#000000" />
          </div>

          <p className="text-heading font-medium text-[22px] sm:text-[24px]">
            ASM Target
          </p>
        </div>

        <div className="flex items-center gap-4 flex-wrap md:flex-nowrap ml-auto">
          <div className="md:w-[190px] w-full">
            <MonthYearPicker />
          </div>

          <div className="md:w-[190px] w-full">
            <SearchByName name="MR Name:" />
          </div>

          <div className="md:w-[190px] w-full">
            <SearchByName name="Brick Name:" />
          </div>

          <div className="md:w-[190px] w-full">
            <SearchByName name="City:" />
          </div>
        </div>
        <div className="w-full flex justify-end">
          <button className="h-[55px] w-full md:w-[180px] md:mb-2 bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center">
            <Icon
              icon="mingcute:add-fill"
              height="20"
              width="20"
              color="#fff"
            />
            <p className="text-white text-base font-medium">Upload Target</p>
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-[12px] bg-[#E5EBF7] p-4">
        <p className="text-[#7D7D7D] font-medium text-sm">
          {rowData.asm} Wise Target
        </p>

        <div
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(69.5vh-0px)] xl:h-[calc(45vh-0px)] mt-4 overflow-y-auto scrollbar-none"
        >
          <CustomTable titles={titles} data={tableData} />
        </div>
      </div>
    </div>
  );
}
