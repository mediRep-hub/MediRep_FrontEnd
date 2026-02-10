import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
  const initialRowData =
    state?.row || JSON.parse(localStorage.getItem("selectedRow") || "null");
  const [rowData, setRowData] = useState<any>(initialRowData);
  const navigate = useNavigate();
  useEffect(() => {
    if (state?.row) {
      localStorage.setItem("selectedRow", JSON.stringify(state.row));
      setRowData(state.row);
    }
  }, [state?.row]);

  const handleGoToBack = () => {
    navigate("/targets-achievements");
  };

  const handleOpenAsmTarget = () => {
    const dummyAsmData = [
      {
        employeeName: "Dummy Employee 1",
        city: "Dummy City 1",
        brick: "Dummy Brick 1",
        target: "100,000",
        achievement: "50,000",
        percentage: "50%",
      },
      {
        employeeName: "Dummy Employee 2",
        city: "Dummy City 2",
        brick: "Dummy Brick 2",
        target: "200,000",
        achievement: "150,000",
        percentage: "75%",
      },
    ];

    navigate("/asm-target", {
      state: {
        row: { asm: "ASM Name" },
        asmData: dummyAsmData,
      },
    });
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
            className="h-10  min-w-10 cursor-pointer rounded-lg border border-[#D2D2D2] flex justify-center items-center bg-white"
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
          <div className="md:w-[220px] w-full">
            <SearchByName name="MR Name:" />
          </div>
          <div className="md:w-[220px] w-full">
            <SearchByName name="Brick Name:" />
          </div>{" "}
          <div className="md:w-[220px] w-full">
            <SearchByName name="City:" />
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-[12px] bg-[#E5EBF7] p-4 2xl:h-[calc(76.7vh-0px)] xl:h-[calc(57.5vh-0px)] h-auto ">
        <p className="text-[#7D7D7D] font-medium text-sm">
          {rowData.mrName} {rowData.asm} Wise Target
        </p>
        <div
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(69.5vh-0px)] xl:h-[calc(47vh-0px)] mt-4 overflow-y-auto scrollbar-none"
        >
          <CustomTable titles={titles} data={tableData} />
        </div>
      </div>
    </div>
  );
}
