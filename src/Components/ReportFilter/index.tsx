import { useState, useEffect } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { Checkbox } from "antd";
import { useFormik } from "formik";
import CustomSelect from "../../Components/Select";
import CustomTimePicker from "../../Components/TimeRangePicker";

export default function ReportFilterModalStatic({ close }: any) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const regionOptions = ["North", "South", "East", "West"];
  const areaOptions = ["Area 1", "Area 2", "Area 3"];
  const mrOptions = ["MR Umair", "MR Ali", "MR Sara"];
  const exportTypeOptions = ["Excel", "PDF"];
  const reportTitles = [
    "Secondary Sale Report",
    "Distributor Stock Report",
    "MR Performance Report",
    "Monthly Summary",
    "Daily Sales Report",
  ];

  const formik = useFormik({
    initialValues: {
      region: "",
      startTime: "",
      area: "",
      endTime: "",
      selectMR: "",
      exportType: "",
      reports: [] as string[],
    },
    onSubmit: (values) => {
      console.log("Generated Report with values:", values);
      alert("Check console for submitted values!");
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-end items-center z-50">
      <div
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        className={`bg-white rounded-t-xl rounded-b-xl md:rounded-tl-xl md:rounded-bl-xl xl:mx-0 mx-5 w-[500px] h-[90vh] md:h-[100vh] overflow-y-auto xl:p-6 p-4 shadow-xl relative
          transform transition-transform duration-500 ease-in-out
          ${animate ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between">
          <p className="text-[24px] text-heading capitalize font-semibold">
            Select Report Type
          </p>
          <IoMdCloseCircle
            size={24}
            onClick={close}
            className="cursor-pointer text-primary"
          />
        </div>
        <form onSubmit={formik.handleSubmit} className="mt-5">
          <div className="mt-3">
            <CustomSelect
              options={regionOptions}
              value={formik.values.region}
              onChange={(val) => formik.setFieldValue("region", val)}
              placeholder="Select Region"
            />
          </div>
          <div className="mt-3">
            <CustomTimePicker
              value={formik.values.startTime}
              onChange={(val) => formik.setFieldValue("startTime", val)}
              placeholder="Select Start Time"
            />
          </div>

          <div className="mt-3">
            <CustomSelect
              options={areaOptions}
              value={formik.values.area}
              onChange={(val) => formik.setFieldValue("area", val)}
              placeholder="Select Area"
            />
          </div>

          <div className="mt-3">
            <CustomTimePicker
              value={formik.values.endTime}
              onChange={(val) => formik.setFieldValue("endTime", val)}
              placeholder="Select End Time"
            />
          </div>

          <div className="mt-3">
            <CustomSelect
              options={mrOptions}
              value={formik.values.selectMR}
              onChange={(val) => formik.setFieldValue("selectMR", val)}
              placeholder="Select MR"
            />
          </div>

          <div className="mt-3">
            <CustomSelect
              options={exportTypeOptions}
              value={formik.values.exportType}
              onChange={(val) => formik.setFieldValue("exportType", val)}
              placeholder="Select Export Type"
            />
          </div>

          <div className="flex flex-wrap justify-start gap-4 mt-5">
            {reportTitles.map((title, index) => (
              <label
                key={index}
                className="flex items-center space-x-2 lg:w-[45%] sm:w-[45%] mt-3"
              >
                <Checkbox
                  className="[&.ant-checkbox-inner]:border-primary [&.ant-checkbox-checked_.ant-checkbox-inner]:bg-primary"
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
                        formik.values.reports.filter((r) => r !== title),
                      );
                    }
                  }}
                >
                  <span className="text-[#7D7D7D] text-sm">{title}</span>
                </Checkbox>
              </label>
            ))}
          </div>
          <div className="flex justify-end mt-5">
            <button
              type="submit"
              className="h-[55px] w-full lg:w-[200px] text-white bg-primary rounded-[6px] flex justify-center items-center"
            >
              Generate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
