import CustomTable from "../../Components/CustomTable";
import { useEffect, useState } from "react";
import { MdAdd, MdDeleteOutline } from "react-icons/md";
import { PiStrategyDuotone } from "react-icons/pi";
import { IoMdCloseCircle } from "react-icons/io";
import CustomInput from "../../Components/CustomInput";
import CustomSelect from "../../Components/Select";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { useFormik } from "formik";
import { StrategySchema } from "../../utils/validation";
import MultiSelect from "../../Components/MultiSelect";
import { useQuery } from "@tanstack/react-query";
import { getAllDoctors } from "../../api/doctorServices";
import { getAllMR } from "../../api/mrServices";
import {
  addStrategy,
  deleteStrategy,
  getAllStrategy,
  updateStrategy,
} from "../../api/strategyServices";
import { TbEdit } from "react-icons/tb";
import { RiAlertFill } from "react-icons/ri";
import { notifyError, notifySuccess } from "../../Components/Toast";
import { Spin } from "antd";
import { Loading3QuartersOutlined } from "@ant-design/icons";

const titles = [
  "Strategy Name",
  "Route Status",
  "Active Requisition",
  "Visit Day",
  "Doctors List",
  "Actions",
];

const selectRegionOptions = [
  "North Punjab",
  "Kashmir",
  "South Punjab",
  "Gilgit",
];
const selectDaysOptions = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const selectRouteOptions = ["Active", "Planning", "In-active"];
const cityOptions = ["Lahore", "Islamabad", "BahawalPur", "Karachi"];

export default function StrategyPlanning() {
  const [addStrategyModel, setAddStrategyModel] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [isloading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 24, color: "white" }} spin />
  );
  useEffect(() => {
    document.title = "MediRep | Strategy & Planning";
  }, []);
  const { data: doctorss } = useQuery({
    queryKey: ["AllDoctors"],
    queryFn: () => getAllDoctors(),
    staleTime: 5 * 60 * 1000,
  });
  const { data: allMr } = useQuery({
    queryKey: ["AllMR"],
    queryFn: () => getAllMR(),
    staleTime: 5 * 60 * 1000,
  });
  let AllMR = allMr?.data;
  const { data: allStraties, refetch } = useQuery({
    queryKey: ["AllStrategy"],
    queryFn: () => getAllStrategy(),
    staleTime: 5 * 60 * 1000,
  });
  let AllStrategy = allStraties?.data?.data;
  let tableData: any = [];
  AllStrategy?.map((v: any) => {
    tableData.push([
      <>
        <div className="flex gap-2">
          <PiStrategyDuotone size={16} className="inline text-[#7d7d7d]" />
          <div>
            <p>{v?.strategyName}</p>
            <div className="flex items-center gap-7">
              <p className="w-[100px]">MR: {v?.mrName}</p>
              <div className="flex items-center gap-3">
                <HiOutlineLocationMarker
                  size={16}
                  color="#7d7d7d"
                  className="inline"
                />
                <p>{v?.region}</p>
              </div>
              <p>45-Doctors</p>
            </div>
          </div>
        </div>
      </>,
      v?.route,
      v?.activeRequisition,
      v?.day,
      <div className="flex gap-3 items-center">
        <p className="text-xs font-normal text-[#131313]">View</p>
      </div>,
      <div className="flex items-center gap-2">
        <TbEdit
          size={18}
          className="text-primary cursor-pointer"
          onClick={() => {
            setAddStrategyModel(true);
            setEditingProduct(v);
          }}
        />
        <MdDeleteOutline
          onClick={() => {
            setDeleteConfirmation(true);
            setEditingProduct(v);
          }}
          size={18}
          className="text-red-600 cursor-pointer"
        />
      </div>,
    ]);
  });

  const AllDOctors = doctorss?.data;
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      region: editingProduct?.region || "",
      area: editingProduct?.area || "",
      strategyName: editingProduct?.strategyName || "",
      route: editingProduct?.route || "",
      day: editingProduct?.day || "",
      mrName: editingProduct?.mrName || "",
      doctorList: editingProduct?.doctorList || [],
    },
    validationSchema: StrategySchema,
    onSubmit: (values) => {
      setLoading(true);
      if (editingProduct) {
        updateStrategy(editingProduct._id, values)
          .then(() => {
            notifySuccess("Product updated successfully");
            addStrategy(false);
            setEditingProduct(null);
            formik.resetForm();
            refetch();
          })
          .catch((error) => {
            console.error(error);
            notifyError("Failed to update Strategy.");
          })
          .finally(() => setLoading(false));
      } else {
        addStrategy(values)
          .then(() => {
            notifySuccess("Strategy added successfully");
            setAddStrategyModel(false);
            formik.resetForm();
            refetch();
          })
          .catch((error) => {
            console.error(error);
            notifyError("Failed to add Strategy.");
          })
          .finally(() => setLoading(false));
      }
    },
  });
  const handleDelete = () => {
    deleteStrategy(editingProduct._id)
      .then(() => {
        notifySuccess("Product deleted successfully");
        setDeleteConfirmation(false);
        refetch();
      })
      .catch((error) => {
        console.error("Failed to delete product:", error);
        notifyError("Failed to delete product. Please try again.");
      });
  };
  return (
    <>
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <p className="text-heading font-medium text-[22px] sm:text-[24px]">
            Strategy & Planning
          </p>
          <button
            onClick={() => {
              setAddStrategyModel(true);
              setEditingProduct(null);
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
            <CustomTable titles={titles} data={tableData} />
          </div>
        </div>
      </div>
      {addStrategyModel && (
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
                {editingProduct === null
                  ? "Create Strategy"
                  : "Update  Strategy"}
              </p>
              <IoMdCloseCircle
                size={20}
                onClick={() => {
                  setAddStrategyModel(false);
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
                        *{String(formik.errors.region)}
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
                        *{String(formik.errors.area)}
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
                          *{String(formik.errors.strategyName)}
                        </div>
                      )}
                  </div>
                  <div className="mt-3">
                    <CustomSelect
                      options={selectRouteOptions}
                      value={formik.values.route}
                      onChange={(val) => formik.setFieldValue("route", val)}
                      placeholder="Route Status"
                    />
                    {formik.touched.route && formik.errors.route && (
                      <div className="text-red-500 text-xs">
                        *{String(formik.errors.route)}
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
                      options={selectDaysOptions}
                      value={formik.values.day}
                      onChange={(val) => formik.setFieldValue("day", val)}
                      placeholder="Select Day"
                    />
                    {formik.touched.day && formik.errors.day && (
                      <div className="text-red-500 text-xs">
                        *{String(formik.errors.day)}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <CustomSelect
                      options={AllMR?.map((doc: any) => doc.mrName) || []}
                      value={formik.values.mrName}
                      onChange={(val) => formik.setFieldValue("mrName", val)}
                      placeholder="Select MR"
                    />
                    {formik.touched.mrName && formik.errors.mrName && (
                      <div className="text-red-500 text-xs">
                        *{String(formik.errors.mrName)}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <MultiSelect
                      options={
                        AllDOctors?.data?.map((doc: any) => doc.name) || []
                      }
                      value={formik.values.doctorList}
                      onChange={(val) =>
                        formik.setFieldValue("doctorList", val)
                      }
                      placeholder="Select Doctor"
                    />
                    {formik.touched.doctorList && formik.errors.doctorList && (
                      <div className="text-red-500 text-xs">
                        *{String(formik.errors.doctorList)}
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
                  {isloading ? (
                    <Spin indicator={antIcon} />
                  ) : editingProduct === null ? (
                    "Create Strategy"
                  ) : (
                    "Update Strategy"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl xl:mx-0 mx-5 w-[500px] xl:h-auto h-[90vh] overflow-x-auto xl:p-6 p-4 shadow-xl relative">
            <RiAlertFill className="text-[120px] text-yellow-500 text-center mx-auto mb-2" />
            <div className="text-center">
              <h2 className="text-xl font-semibold text-primary mt-5">
                Confirm Delete
              </h2>
              <p className="mb-6">
                Are you sure you want to delete this <strong>Product</strong>
              </p>
            </div>
            <div className="flex mt-5 justify-between gap-4">
              <button
                onClick={() => {
                  setDeleteConfirmation(false);
                }}
                className="px-7 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-7 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
