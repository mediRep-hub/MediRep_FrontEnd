import { useEffect, useState } from "react";
import CustomTable from "../../Components/CustomTable";
import { IoMdCloseCircle } from "react-icons/io";
import CustomSelect from "../../Components/Select";
import { Checkbox } from "antd";
import { FiClock } from "react-icons/fi";
import { useFormik } from "formik";
import { reportSchema } from "../../utils/validation";
import { LuDownload } from "react-icons/lu";
import CustomTimePicker from "../../Components/TimeRangePicker";
import Pagination from "../../Components/Pagination";
import { Icon } from "@iconify/react";
const titles = [
  "MR Name",
  "Strategy",
  "Planned Visits",
  "Completed Visits",
  "Duration",
  "Last Sync",
];
const data = [
  [
    "Umair Yaqoob",
    "Raiwind road, Lahore, Punjab",
    "18",
    "11",
    "3:45m",
    <div className="flex items-start">
      <FiClock size={16} className="inline text-[#7d7d7d] mr-2" />
      <div>
        <p>2025-09-25</p>
        <p>11:30 AM</p>
      </div>
    </div>,
  ],
  [
    "Bilal Hassan",
    "Model Town, Lahore, Punjab",
    "22",
    "15",
    "5:20m",
    <div className="flex items-start">
      <FiClock size={16} className="inline text-[#7d7d7d] mr-2" />
      <div>
        <p>2025-09-26</p>
        <p>02:15 PM</p>
      </div>
    </div>,
  ],
  [
    "Ali Khan",
    "Faisalabad, Punjab",
    "30",
    "20",
    "7:10m",
    <div className="flex items-start">
      <FiClock size={16} className="inline text-[#7d7d7d] mr-2" />
      <div>
        <p>2025-09-27</p>
        <p>09:45 AM</p>
      </div>
    </div>,
  ],
  [
    "Sara Ahmed",
    "Karachi, Sindh",
    "25",
    "18",
    "4:55m",
    <div className="flex items-start">
      <FiClock size={16} className="inline text-[#7d7d7d] mr-2" />
      <div>
        <p>2025-09-28</p>
        <p>03:20 PM</p>
      </div>
    </div>,
  ],
  [
    "Hassan Raza",
    "Islamabad, Capital Territory",
    "28",
    "12",
    "6:30m",
    <div className="flex items-start">
      <FiClock size={16} className="inline text-[#7d7d7d] mr-2" />
      <div>
        <p>2025-09-29</p>
        <p>10:00 AM</p>
      </div>
    </div>,
  ],
];
interface ReportFormValues {
  region: string;
  startTime: string;
  endTime: string;
  area: string;
  selectMR: string;
  exportType: string;
  reports: string[];
}
const reportTitles = [
  "Doctor Coverage",
  "Call Reporting",
  "Requisition Report",
  "Product Performance",
  "Check-in/Check-out Logs",
  "MR Performance",
  "Route Planing & Geo-Tracking",
] as const;

const regionOptions = ["North Punjab", "Kashmir", "South Punjab", "Gilgit"];
const MrOptions = ["Bilal", "Salim", "Umair", "umer"];
const AreaOptions = ["Lahore", "Islamabad", "BahawalPur", "Karachi"];
const exportTypeOptions = ["Excel", "Pdf", "Both"];
export default function DataReporting() {
  const [openModel, setOpenModel] = useState(false);
  const formik = useFormik<ReportFormValues>({
    initialValues: {
      region: "",
      startTime: "",
      endTime: "",
      area: "",
      selectMR: "",
      exportType: "",
      reports: [],
    },
    validationSchema: reportSchema,
    onSubmit: () => {},
  });

  useEffect(() => {
    document.title = "MediRep | Data Reporting";
  }, []);
  return (
    <>
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap gap-4 justify-between items-start">
          <p className="text-heading font-medium text-[22px] sm:text-[24px]">
            Reports
          </p>
          <div className="flex flex-wrap gap-5 md:w-auto w-full">
            <button className="h-[55px] w-full md:w-[180px] bg-[#E5EBF7] rounded-[6px] gap-3 cursor-pointer flex justify-center items-center">
              <LuDownload size={20} className="text-primary" />{" "}
              <p className="text-primary text-base font-medium">Download</p>
            </button>{" "}
            <button
              onClick={() => {
                setOpenModel(true);
              }}
              className="h-[55px] w-full md:w-[200px]  bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
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
        <div className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(75.5vh-0px)] lg:h-[calc(64vh-0px)] h-auto ">
          <div className="flex justify-between items-center">
            <p className="text-[#7D7D7D] font-medium text-sm">
              {" "}
              MR Performance Table
            </p>
            <Pagination />
          </div>
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="scroll-smooth bg-white rounded-lg 2xl:h-[calc(68vh-0px)] xl:h-[calc(53vh-0px)] mt-4 overflow-y-auto scrollbar-none"
          >
            <CustomTable titles={titles} data={data} />
          </div>
        </div>
      </div>
      {openModel && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="bg-white rounded-xl xl:mx-0 mx-5 w-[1000px] max-h-[90vh] overflow-x-auto xl:p-6 p-4 shadow-xl relative"
          >
            <div className="flex items-center justify-between ">
              <p className="text-[24px] text-heading capitalize font-semibold">
                Select Report Type
              </p>
              <IoMdCloseCircle
                size={20}
                onClick={() => {
                  setOpenModel(false);
                }}
                className="cursor-pointer text-primary"
              />
            </div>
            <form onSubmit={formik.handleSubmit} className="mt-5">
              <div className="flex flex-wrap items-center gap-4">
                <div className="lg:w-[calc(50%-8px)] w-full">
                  <CustomSelect
                    options={regionOptions}
                    value={formik.values.region}
                    onChange={(val) => formik.setFieldValue("region", val)}
                    placeholder="Select Region"
                  />
                  {formik.touched.region && formik.errors.region && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.region}
                    </p>
                  )}
                </div>
                <div className="lg:w-[calc(50%-8px)] w-full">
                  <CustomTimePicker
                    value={formik.values.startTime}
                    onChange={(val) => formik.setFieldValue("startTime", val)}
                    placeholder="Select Start Time"
                  />
                  {formik.touched.startTime && formik.errors.startTime && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.startTime}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="lg:w-[calc(50%-8px)] w-full">
                  <CustomSelect
                    options={AreaOptions}
                    value={formik.values.area}
                    onChange={(val) => formik.setFieldValue("area", val)}
                    placeholder="Select Area"
                  />
                  {formik.touched.area && formik.errors.area && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.area}
                    </p>
                  )}
                </div>
                <div className="lg:w-[calc(50%-8px)] w-full">
                  <CustomTimePicker
                    value={formik.values.endTime}
                    onChange={(val) => formik.setFieldValue("endTime", val)}
                    placeholder="Select End Time"
                  />
                  {formik.touched.endTime && formik.errors.endTime && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.endTime}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="lg:w-[calc(50%-8px)] w-full">
                  <CustomSelect
                    options={MrOptions}
                    value={formik.values.selectMR}
                    onChange={(val) => formik.setFieldValue("selectMR", val)}
                    placeholder="Select MR"
                  />
                  {formik.touched.selectMR && formik.errors.selectMR && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.selectMR}
                    </p>
                  )}
                </div>
                <div className="lg:w-[calc(50%-8px)] w-full">
                  <CustomSelect
                    options={exportTypeOptions}
                    value={formik.values.exportType}
                    onChange={(val) => formik.setFieldValue("exportType", val)}
                    placeholder="Select Export Type"
                  />
                  {formik.touched.exportType && formik.errors.exportType && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.exportType}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap justify-start gap-4 mt-5">
                {reportTitles.map((title, index) => (
                  <label
                    key={index}
                    className="flex items-center space-x-2 lg:w-[23%] sm:w-[45%] mt-3"
                  >
                    <Checkbox
                      className="[&_.ant-checkbox-inner]:border-primary [&_.ant-checkbox-checked_.ant-checkbox-inner]:bg-primary"
                      value={title}
                      checked={formik.values.reports.includes(title)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          formik.setFieldValue("reports", [
                            ...formik.values.reports,
                            title,
                          ]);
                        } else {
                          formik.setFieldValue(
                            "reports",
                            formik.values.reports.filter(
                              (r: string) => r !== title
                            )
                          );
                        }
                      }}
                    >
                      <span className="text-[#7D7D7D] text-sm">{title}</span>
                    </Checkbox>
                  </label>
                ))}
              </div>
              {formik.touched.reports && formik.errors.reports && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.reports}
                </p>
              )}
              <div className="flex justify-end mt-5">
                <button
                  type="submit"
                  className="h-[55px] w-full lg:w-[200px] text-white bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
                >
                  Generate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
