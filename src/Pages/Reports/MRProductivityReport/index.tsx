import { Icon } from "@iconify/react";
import CustomTable from "../../../Components/CustomTable";
import { MonthYearPicker } from "../../../Components/FilterMonthYear";
import { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { Avatar } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getAllDoctors } from "../../../api/doctorServices";
import ReportFilterModalStatic from "../../../Components/ReportFilter";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const title = [
  "MR Name",
  "Planned Calls",
  "Actual Calls",
  "Call Completion %",
  "Orders Generated",
  "Samples Given",
  "Coverage %",
  "Working Days",
];

export default function MRProductivityReport() {
  const [openList, setOpenList] = useState(false);

  const [generateReport, setGenerateReport] = useState(false);
  const handleClose = () => {
    setGenerateReport(false);
  };
  let currentPage = 1;
  let itemsPerPage = 7;

  const { data: Doctor } = useQuery({
    queryKey: ["AllPharmacies", currentPage],
    queryFn: () =>
      getAllDoctors({
        page: currentPage,
        limit: itemsPerPage,
      }),
    placeholderData: (previous) => previous,
  });
  let AllDoctor = Doctor?.data?.data;
  const Data = [
    [
      "Omar Rosser",
      <p className="text-primary underline" onClick={() => setOpenList(true)}>
        96
      </p>,
      <p className="text-primary underline">84</p>,
      "87.5 %",
      "Yes",
      "Yes",
      "Yes",
      "13",
    ],

    [
      "Aiden Brooks",
      <p className="text-primary underline" onClick={() => setOpenList(true)}>
        88
      </p>,
      <p className="text-primary underline">79</p>,
      "83.2 %",
      "Yes",
      "No",
      "Yes",
      "10",
    ],

    [
      "Liam Scott",
      <p className="text-primary underline" onClick={() => setOpenList(true)}>
        92
      </p>,
      <p className="text-primary underline">90</p>,
      "91.0 %",
      "Yes",
      "Yes",
      "Yes",
      "15",
    ],
  ];
  const handleDownloadExcel = () => {
    const exportData = Data.map((row) =>
      row.map((cell) => {
        if (typeof cell === "object" && cell.props) {
          if (cell.props.children) {
            if (Array.isArray(cell.props.children)) {
              return cell.props.children
                .map((child: any) =>
                  typeof child === "string"
                    ? child
                    : child.props?.children || "",
                )
                .join(" ");
            }
            return cell.props.children;
          }
          return "";
        }
        return cell;
      }),
    );

    const worksheet = XLSX.utils.aoa_to_sheet([title, ...exportData]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "MR Productivity Report");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "MR Productivity Report.xlsx");
  };
  return (
    <>
      {" "}
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex w-full md:w-auto items-center gap-3">
            <p className="text-heading  font-medium text-[22px] sm:text-[24px]">
              Reports
            </p>
            <div className="w-full">
              <MonthYearPicker />
            </div>
          </div>
          <div className="flex flex-wrap w-full md:w-auto items-center gap-3">
            <button
              onClick={handleDownloadExcel}
              className="h-[55px] w-full md:w-[180px] bg-[#E5EBF7] rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
            >
              <Icon
                icon="solar:download-broken"
                height="24"
                width="24"
                color="#0755E9"
              />
              <p className="text-primary text-base font-medium">Download</p>
            </button>

            <button
              onClick={() => {
                setGenerateReport(true);
              }}
              className="h-[55px] w-full md:w-[170px] lg:w-[200px] bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
            >
              <Icon
                icon="mingcute:add-fill"
                height="20"
                width="20"
                color="#fff"
              />
              <p className="text-white text-base font-medium">
                Generate Reports
              </p>
            </button>
          </div>
        </div>

        <div className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(75.7vh-0px)] xl:h-[calc(64vh-0px)] h-auto ">
          <p className="text-sm text-[#7d7d7d]">MR Productivity Report</p>
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="scroll-smooth bg-white mt-3 rounded-xl 2xl:h-[calc(69vh-0px)] xl:h-[calc(54vh-0px)]  overflow-y-auto scrollbar-none"
          >
            <CustomTable titles={title} data={Data} />
          </div>
        </div>
      </div>
      {openList && (
        <>
          {" "}
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              className="bg-white rounded-xl xl:mx-0 mx-5 w-[800px] xl:h-auto max-h-[90vh] overflow-x-auto xl:py-6 py-4 shadow-xl relative"
            >
              <div className="flex justify-between pb-4 items-center gap-4 px-4 ">
                <p className="text-[#131313] font-normal text-2xl leading-[100%]">
                  Planned Call List
                </p>
                <div className="flex items-center gap-5">
                  <div className="flex justify-center p-2 border border-primary rounded-md cursor-pointer">
                    <Icon
                      icon="solar:download-bold"
                      onClick={() => setOpenList(false)}
                      className="cursor-pointer text-primary text-xl"
                    />
                  </div>{" "}
                  <div className="h-[35px] group w-[35px] p-2 rounded-full  hover:shadow-[rgba(99,99,99,0.25)_0px_4px_12px_2px] flex items-center justify-center">
                    <div className="group-hover:bg-white">
                      <IoMdCloseCircle
                        size={24}
                        onClick={() => setOpenList(false)}
                        className="cursor-pointer text-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {AllDoctor.map((item: any, index: number) => (
                <div
                  key={index}
                  className="border-[#131313] border-t-[1px] flex-wrap gap-5 flex items-center p-3 px-10"
                >
                  <div className="flex  items-center gap-5 md:gap-10 w-full md:w-[40%]">
                    <p>0{index + 1}</p>

                    <div className="flex items-center gap-3">
                      <Avatar src={item.image} size={50} />
                      <div>
                        <p className="text-[#131313] font-medium leading-[100%]">
                          {item.name}
                        </p>
                        <p className="text-xs font-medium text-primary">
                          {item.docId}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-[40%]">
                    <div className="flex gap-3 items-center">
                      <div className="min-w-[30px]">
                        {" "}
                        <Icon
                          icon="material-symbols-light:action-key-rounded"
                          color="#7D7D7D"
                          className="text-xl"
                        />
                      </div>
                      <p className="text-[#131313] text-xs">{item.specialty}</p>
                    </div>

                    <div className="flex gap-3 mt-2 items-start">
                      <div className="min-w-[30px]">
                        <Icon
                          icon="material-symbols-light:edit-location-alt-rounded"
                          color="#7D7D7D"
                          className="text-xl"
                        />
                      </div>
                      <p className="text-[#131313] w-[99%] text-xs">
                        {item.location?.address}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="border-[#131313] border-t-[1px]"></div>
            </div>
          </div>
        </>
      )}
      {generateReport && (
        <>
          {" "}
          <>
            <ReportFilterModalStatic close={handleClose} />{" "}
          </>
        </>
      )}
    </>
  );
}
