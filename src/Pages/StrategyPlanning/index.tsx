import { GoGoal } from "react-icons/go";
import CustomTable from "../../Components/CustomTable";
import { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import { Dayjs } from "dayjs";
import { PiStrategyDuotone } from "react-icons/pi";
import { BiMessageDetail } from "react-icons/bi";
import { IoMdCloseCircle } from "react-icons/io";
import CustomInput from "../../Components/CustomInput";
import CustomSelect from "../../Components/Select";
import { HiOutlineLocationMarker } from "react-icons/hi";
import CustomTextarea from "../../Components/CustomTextaera";
import MultiSelect from "../../Components/MultiSelect";
import MultiDatePicker from "../../Components/MultiDatePicker";
import { useFormik } from "formik";
import { StrategySchema } from "../../utils/validation";

const titles = ["Strategy Name", "Product", "Status", "Goals", "Doctors List"];
const data = [
  [
    <>
      <div className="flex gap-2">
        <PiStrategyDuotone size={16} className="inline text-[#7d7d7d]" />
        <div>
          <p>Shalimar Road</p>
          <div className="flex items-center gap-7">
            <p className="w-[100px]">MR: Zain Hassan</p>
            <div className="flex items-center gap-3">
              <HiOutlineLocationMarker
                size={16}
                color="#7d7d7d"
                className="inline"
              />
              <p>Punjab</p>
            </div>
            <p>45-Doctors</p>
          </div>
        </div>
      </div>
    </>,
    "Naunehal Baby Soap - 100 gm",
    <div className="p-1 bg-[#008000] rounded-sm w-max">
      <p className="text-white leading-[100%]">View</p>
    </div>,
    <>
      <GoGoal size={16} className="inline text-[#7d7d7d] mr-2" /> 80%{" "}
      <span className="text-[10px]">Achieved</span>
    </>,
    <>
      <BiMessageDetail size={16} className="inline text-[#7d7d7d] mr-2" />
      View
    </>,
  ],
  [
    <>
      <div className="flex gap-2">
        <PiStrategyDuotone size={16} className="inline text-[#7d7d7d]" />
        <div>
          <p>Canal Road</p>
          <div className="flex items-center gap-7">
            <p className="w-[100px]">MR: Ali Raza</p>
            <div className="flex items-center gap-3">
              <HiOutlineLocationMarker
                size={16}
                color="#7d7d7d"
                className="inline"
              />
              <p>Sindh</p>
            </div>
            <p>30-Doctors</p>
          </div>
        </div>
      </div>
    </>,
    "Paracetamol Syrup - 120 ml",
    <div className="p-1 bg-[#FFA500] rounded-sm w-max">
      <p className="text-white leading-[100%]">Planing</p>
    </div>,
    <>
      <GoGoal size={16} className="inline text-[#7d7d7d] mr-2" /> 65%{" "}
      <span className="text-[10px]">Achieved</span>
    </>,
    <>
      <BiMessageDetail size={16} className="inline text-[#7d7d7d] mr-2" />
      View
    </>,
  ],
  [
    <>
      <div className="flex gap-2">
        <PiStrategyDuotone size={16} className="inline text-[#7d7d7d]" />
        <div>
          <p>Shalimar Road</p>
          <div className="flex items-center gap-7">
            <p className="w-[100px]">MR: Sana Iqbal</p>
            <div className="flex items-center gap-3">
              <HiOutlineLocationMarker
                size={16}
                color="#7d7d7d"
                className="inline"
              />
              <p>KPK</p>
            </div>
            <p>28-Doctors</p>
          </div>
        </div>
      </div>
    </>,
    "Skin Care Lotion - 200 ml",
    <div className="p-1 bg-primary rounded-sm w-max">
      <p className="text-white leading-[100%]">Scheduled</p>
    </div>,
    <>
      <GoGoal size={16} className="inline text-[#7d7d7d] mr-2" /> 25%{" "}
      <span className="text-[10px]">Achieved</span>
    </>,
    <>
      <BiMessageDetail size={16} className="inline text-[#7d7d7d] mr-2" />
      View
    </>,
  ],
  [
    <>
      <div className="flex gap-2">
        <PiStrategyDuotone size={16} className="inline text-[#7d7d7d]" />
        <div>
          <p>Airport Road</p>
          <div className="flex items-center gap-7">
            <p className="w-[100px]">MR: Bilal Khan</p>
            <div className="flex items-center gap-3">
              <HiOutlineLocationMarker
                size={16}
                color="#7d7d7d"
                className="inline"
              />
              <p>Balochistan</p>
            </div>
            <p>18-Doctors</p>
          </div>
        </div>
      </div>
    </>,
    "Calcium Tablets - 500 mg",
    <div className="p-1 bg-[#008000] rounded-sm w-max">
      <p className="text-white leading-[100%]">Active</p>
    </div>,
    <>
      <GoGoal size={16} className="inline text-[#7d7d7d] mr-2" /> 92%{" "}
      <span className="text-[10px]">Achieved</span>
    </>,
    <>
      <BiMessageDetail size={16} className="inline text-[#7d7d7d] mr-2" />
      View
    </>,
  ],
  [
    <>
      <div className="flex gap-2">
        <PiStrategyDuotone size={16} className="inline text-[#7d7d7d]" />
        <div>
          <p>Riwind Road</p>
          <div className="flex items-center gap-7">
            <p className="w-[100px]">MR: Hina Ahmed</p>
            <div className="flex items-center gap-3">
              <HiOutlineLocationMarker
                size={16}
                color="#7d7d7d"
                className="inline"
              />
              <p>Punjab</p>
            </div>
            <p>40-Doctors</p>
          </div>
        </div>
      </div>
    </>,
    "Vitamin C Sachets - 1 gm",
    <div className="p-1 bg-[#FFA500] rounded-sm w-max">
      <p className="text-white leading-[100%]">Planing</p>
    </div>,
    <>
      <GoGoal size={16} className="inline text-[#7d7d7d] mr-2" /> 55%{" "}
      <span className="text-[10px]">Achieved</span>
    </>,
    <>
      <BiMessageDetail size={16} className="inline text-[#7d7d7d] mr-2" />
      View
    </>,
  ],
  [
    <>
      <div className="flex gap-2">
        <PiStrategyDuotone size={16} className="inline text-[#7d7d7d]" />
        <div>
          <p>Canal Road </p>
          <div className="flex items-center gap-7">
            <p className="w-[100px]">MR: Asif Malik</p>
            <div className="flex items-center gap-3">
              <HiOutlineLocationMarker
                size={16}
                color="#7d7d7d"
                className="inline"
              />
              <p>Sindh</p>
            </div>
            <p>32-Doctors</p>
          </div>
        </div>
      </div>
    </>,
    "Neurotonic Syrup - 60 ml",
    <div className="p-1 bg-primary rounded-sm w-max">
      <p className="text-white leading-[100%]">Scheduled</p>
    </div>,
    <>
      <GoGoal size={16} className="inline text-[#7d7d7d] mr-2" /> 15%{" "}
      <span className="text-[10px]">Achieved</span>
    </>,
    <>
      <BiMessageDetail size={16} className="inline text-[#7d7d7d] mr-2" />
      View
    </>,
  ],
];
const doctorOPtions = ["Dr. Hussain", "Dr. Salim", "Dr. ali", "Dr. umer"];

const assignToMROptions = ["MR 1", "MR 2", "MR 3"];
const selectRegionOptions = ["Region 1", "Region 2", "Region 3"];
const selectProductOptions = ["Product A", "Product B", "Product C"];
const cityOptions = ["Product A", "Product B", "Product C"];

export default function StrategyPlanning() {
  const [addStrategy, setAddStrategy] = useState(false);
  useEffect(() => {
    document.title = "MediRep | Strategy & Planning";
  }, []);

  const formik = useFormik({
    initialValues: {
      region: "",
      area: "",
      strategyName: "",
      route: "",
      day: "",
      mrName: "",
      doctorName: "",
    },
    validationSchema: StrategySchema,
    onSubmit: (values) => {
      setAddStrategy(false);
    },
  });
  return (
    <>
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <p className="text-heading font-medium text-[22px] sm:text-[24px]">
            Strategy & Planning
          </p>
          <button
            onClick={() => {
              setAddStrategy(true);
            }}
            className="h-[55px] w-full md:w-[200px] bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
          >
            <MdAdd size={20} color="#fff" />{" "}
            <p className="text-white text-base font-medium">
              Create Strategies
            </p>
          </button>
        </div>
        <div className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(90vh-137px)] xl:h-[calc(90vh-169px)] h-auto ">
          <p className="text-[#7D7D7D] font-medium text-sm">
            Recent MR Strategies
          </p>
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(85vh-157px)] xl:h-[calc(65vh-79px)]  mt-4 overflow-y-auto scrollbar-none"
          >
            <CustomTable titles={titles} data={data} />
          </div>
        </div>
      </div>
      {addStrategy && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="bg-white rounded-xl xl:mx-0 mx-5 w-[1000px] md:h-auto h-[90vh] overflow-x-auto xl:p-6 p-4 shadow-xl relative"
          >
            <div className="flex items-center justify-between ">
              <p className="text-[24px] text-heading capitalize font-medium">
                Create Strategy
              </p>
              <IoMdCloseCircle
                size={20}
                onClick={() => {
                  setAddStrategy(false);
                }}
                className="cursor-pointer text-primary"
              />
            </div>
            <p className="text-base font-normal text-[#979797]">
              Define targeted visit strategies for your medical representatives
            </p>
            <form onSubmit={formik.handleSubmit}>
              <div className="flex flex-wrap mt-5 gap-8">
                <div className="md:w-[calc(50%-16px)] w-full">
                  <p className="text-base font-normal text-heading">
                    Strategy Details
                  </p>
                  <div className="mt-3">
                    <CustomSelect
                      options={selectRegionOptions}
                      value={formik.values.region}
                      onChange={(val) => formik.setFieldValue("region", val)}
                      placeholder="Region"
                    />
                    {formik.touched.region && formik.errors.region && (
                      <div className="text-red-500 text-xs">
                        *{formik.errors.region}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <CustomSelect
                      options={cityOptions}
                      value={formik.values.area}
                      onChange={(val) => formik.setFieldValue("area", val)}
                      placeholder="Area"
                    />
                    {formik.touched.area && formik.errors.area && (
                      <div className="text-red-500 text-xs">
                        *{formik.errors.area}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <CustomInput
                      label="Strategy Name"
                      name="strategyName"
                      placeholder="e.g, Cardiology Focus"
                      value={formik.values.strategyName}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.strategyName &&
                      formik.errors.strategyName && (
                        <div className="text-red-500 text-xs">
                          *{formik.errors.strategyName}
                        </div>
                      )}
                  </div>
                  <div className="mt-3">
                    <CustomSelect
                      options={selectProductOptions}
                      value={formik.values.route}
                      onChange={(val) => formik.setFieldValue("route", val)}
                      placeholder="Route Status"
                    />
                    {formik.touched.route && formik.errors.route && (
                      <div className="text-red-500 text-xs">
                        *{formik.errors.route}
                      </div>
                    )}
                  </div>
                </div>
                <div className="md:w-[calc(50%-16px)] w-full">
                  <p className="text-base font-normal text-heading">
                    Set Doctors
                  </p>
                  <div className="mt-3">
                    <CustomSelect
                      options={selectProductOptions}
                      value={formik.values.day}
                      onChange={(val) => formik.setFieldValue("day", val)}
                      placeholder="Select Day"
                    />
                    {formik.touched.day && formik.errors.day && (
                      <div className="text-red-500 text-xs">
                        *{formik.errors.day}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <CustomSelect
                      options={assignToMROptions}
                      value={formik.values.mrName}
                      onChange={(val) => formik.setFieldValue("mrName", val)}
                      placeholder="Select MR"
                    />
                    {formik.touched.mrName && formik.errors.mrName && (
                      <div className="text-red-500 text-xs">
                        *{formik.errors.mrName}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <CustomSelect
                      options={doctorOPtions}
                      value={formik.values.doctorName}
                      onChange={(val) =>
                        formik.setFieldValue("doctorName", val)
                      }
                      placeholder="Select Doctor"
                    />
                    {formik.touched.doctorName && formik.errors.doctorName && (
                      <div className="text-red-500 text-xs">
                        *{formik.errors.doctorName}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-5">
                <button
                  type="submit"
                  className="h-[55px] md:w-[200px] w-full bg-primary text-white rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
                >
                  Create Strategy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
