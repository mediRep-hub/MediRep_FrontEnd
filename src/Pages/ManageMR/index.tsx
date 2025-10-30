import { useEffect, useState } from "react";
import CustomTable from "../../Components/CustomTable";
import { MdAdd, MdDeleteOutline } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import CustomInput from "../../Components/CustomInput";
import ImagePicker from "../../Components/ImagePicker";
import CustomSelect from "../../Components/Select";
import { useFormik } from "formik";
import { MRSchema } from "../../utils/validation";
import { addMR, deleteMR, getAllMR, updateMR } from "../../api/mrServices";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { notifyError, notifySuccess } from "../../Components/Toast";
import { TbEdit } from "react-icons/tb";

import { RiAlertFill } from "react-icons/ri";
import { FiEye, FiEyeOff } from "react-icons/fi";

const titles = [
  "Mr ID",
  "MR Name",
  "Phone Number",
  "Area",
  "Target Achieved",
  "Reporting Manager",
  "Actions",
];

const StrategyList = ["Sindh", "North Punjab", "Kashmir", "South Punjab"];
const regionOptions = ["Sindh", "North Punjab", "Kashmir", "South Punjab"];
const areaOptions = ["Lahore", "Islamabad", "Bahawalpur ", "Karachi"];
export default function ManageMR() {
  const [deleteID, setdeleteID] = useState<any>(null);
  const [isEdit, setEdit] = useState<any>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [createMR, setCreateMR] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordConfirmVisible, setPasswordonfirmVisible] = useState(false);
  const { data, refetch } = useQuery({
    queryKey: ["AllMR"],
    queryFn: () => getAllMR(),
    staleTime: 5 * 60 * 1000,
  });
  let AllMR = data?.data;
  let tableData: any = [];
  AllMR?.map((v: any, ind: any) => {
    tableData.push([
      v?.mrId,
      v?.mrName,
      v?.phoneNo,
      v?.area,
      v?.experience,
      v?.experience,
      <div className="flex items-center gap-2">
        <TbEdit
          onClick={() => {
            setdeleteID(v?._id);
            setEdit(true);
            setCreateMR(true);
            setEditingProduct(v);
          }}
          size={18}
          className="text-primary cursor-pointer"
        />
        <MdDeleteOutline
          onClick={() => {
            setdeleteID(v?._id);
            setDeleteConfirmation(true);
          }}
          size={18}
          className="text-red-600 cursor-pointer"
        />
      </div>,
    ]);
  });

  useEffect(() => {
    document.title = "MediRep | Manage MR";
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      mrName: editingProduct?.mrName || "",
      phoneNo: editingProduct?.phoneNo || "",
      region: editingProduct?.region || "",
      area: editingProduct?.area || "",
      strategy: editingProduct?.strategy || "",
      image: editingProduct?.image || "",
      password: editingProduct?.password || "",
      confirmPassword: editingProduct?.confirmPassword || "",
    },
    validationSchema: MRSchema,
    onSubmit: (values) => {
      setLoading(true);
      if (editingProduct) {
        updateMR(editingProduct._id, values)
          .then(() => {
            notifySuccess("MR updated successfully");
            setCreateMR(false);
            setEditingProduct(null);
            formik.resetForm();
            refetch();
          })
          .catch((error) => {
            console.error(error);
            notifyError("Failed to update MR.");
          })
          .finally(() => setLoading(false));
      } else {
        addMR(values)
          .then((res) => {
            console.log("✅ MR added successfully:", res.data);
            notifySuccess("MR added successfully!");
            setCreateMR(false);
            formik.resetForm();
            refetch();
          })
          .catch((error) => {
            console.error("❌ Error creating MR:", error);
            notifyError("Failed to add MR. Please try again.");
          })
          .finally(() => setLoading(false));
      }
    },
  });
  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 24, color: "white" }} spin />
  );
  const handleDelete = () => {
    deleteMR(deleteID)
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
            Manage MR
          </p>
          <button
            onClick={() => {
              setCreateMR(true);
            }}
            className="h-[55px] w-full md:w-[180px] bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
          >
            <MdAdd size={20} color="#fff" />{" "}
            <p className="text-white text-base font-medium">Create MR</p>
          </button>
        </div>
        <div className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(90vh-137px)] xl:h-[calc(90vh-169px)] h-auto ">
          <p className="text-[#7D7D7D] font-medium text-sm">MR List</p>
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(85vh-157px)] xl:h-[calc(65vh-79px)] mt-4 overflow-y-auto scrollbar-none"
          >
            <CustomTable titles={titles} data={tableData} />
          </div>
        </div>
      </div>

      {createMR && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="bg-white rounded-xl xl:mx-0 mx-5 w-[1000px] h-auto overflow-x-auto xl:p-6 p-4 shadow-xl relative"
          >
            <div className="flex items-center justify-between ">
              <p className="text-[24px] text-heading capitalize font-medium">
                {isEdit ? "Update MR" : "Create MR"}
              </p>
              <IoMdCloseCircle
                size={20}
                onClick={() => setCreateMR(false)}
                className="cursor-pointer text-primary"
              />
            </div>
            <p className="text-base mt-1 font-normal text-[#979797]">
              {isEdit ? "Update" : "Enter"} MR data
            </p>
            <p className="text-base font-normal mt-4 text-heading">
              MR Details
            </p>

            <form onSubmit={formik.handleSubmit}>
              <div className="flex flex-wrap  gap-8">
                <div className="md:w-[calc(50%-16px)] w-full">
                  <div className="mt-3">
                    <CustomInput
                      label="MR Name"
                      placeholder="MR Name"
                      value={formik.values.mrName}
                      onChange={(e) =>
                        formik.setFieldValue("mrName", e.target.value)
                      }
                    />
                    {formik.touched.mrName && formik.errors.mrName && (
                      <div className="text-red-500 text-xs">
                        *
                        {typeof formik.errors.mrName === "string"
                          ? formik.errors.mrName
                          : ""}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <CustomInput
                      label="Phone Number"
                      placeholder="Phone Number"
                      value={formik.values.phoneNo}
                      onChange={(e) =>
                        formik.setFieldValue("phoneNo", e.target.value)
                      }
                    />

                    {formik.touched.phoneNo && formik.errors.phoneNo && (
                      <div className="text-red-500 text-xs">
                        *
                        {typeof formik.errors.phoneNo === "string"
                          ? formik.errors.phoneNo
                          : ""}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <CustomSelect
                      options={regionOptions}
                      value={formik.values.region}
                      onChange={(val) => formik.setFieldValue("region", val)}
                      placeholder="Region"
                    />
                    {formik.touched.region && formik.errors.region && (
                      <div className="text-red-500 text-xs">
                        *
                        {typeof formik.errors.region === "string"
                          ? formik.errors.region
                          : ""}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <CustomSelect
                      options={areaOptions}
                      value={formik.values.area}
                      onChange={(val) => formik.setFieldValue("area", val)}
                      placeholder="Area"
                    />
                    {formik.touched.area && formik.errors.area && (
                      <div className="text-red-500 text-xs">
                        *
                        {typeof formik.errors.area === "string"
                          ? formik.errors.area
                          : ""}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <CustomSelect
                      options={StrategyList}
                      value={formik.values.strategy}
                      onChange={(val) => formik.setFieldValue("strategy", val)}
                      placeholder="Select Strategy"
                    />

                    {formik.touched.strategy && formik.errors.strategy && (
                      <div className="text-red-500 text-xs">
                        *
                        {typeof formik.errors.strategy === "string"
                          ? formik.errors.strategy
                          : ""}
                      </div>
                    )}
                  </div>{" "}
                </div>
                <div className="md:w-[calc(50%-16px)] w-full">
                  <div className="mt-3">
                    <div className="relative w-full">
                      <label className="absolute -top-2 left-5 bg-white px-1 text-xs text-gray-500">
                        Password
                      </label>
                      <input
                        id="password"
                        name="password"
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        className="rounded-md w-full h-14 px-3 py-2 text-sm outline-none border-primary border-[0.5px]"
                      />
                      <span
                        className="absolute right-4 top-5 cursor-pointer text-[#7D7D7D]"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                      >
                        {passwordVisible ? (
                          <FiEye
                            className="text-primary"
                            style={{ fontSize: "20px" }}
                          />
                        ) : (
                          <FiEyeOff style={{ fontSize: "20px" }} />
                        )}
                      </span>
                    </div>
                    {formik.touched.password && formik.errors.password && (
                      <div className="text-red-500 text-xs">
                        *
                        {typeof formik.errors.password === "string"
                          ? formik.errors.password
                          : ""}
                      </div>
                    )}
                  </div>{" "}
                  <div className="mt-3">
                    <div className="relative w-full">
                      <label className="absolute -top-2 left-5 bg-white px-1 text-xs text-gray-500">
                        Confirm Password
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={passwordConfirmVisible ? "text" : "password"}
                        placeholder="Confirm Password"
                        onChange={formik.handleChange}
                        value={formik.values.confirmPassword}
                        className="rounded-md w-full h-14 px-3 py-2 text-sm outline-none border-primary border-[0.5px]"
                      />
                      <span
                        className="absolute right-4 top-5 cursor-pointer text-[#7D7D7D]"
                        onClick={() =>
                          setPasswordonfirmVisible(!passwordConfirmVisible)
                        }
                      >
                        {passwordConfirmVisible ? (
                          <FiEye
                            className="text-primary"
                            style={{ fontSize: "20px" }}
                          />
                        ) : (
                          <FiEyeOff style={{ fontSize: "20px" }} />
                        )}
                      </span>
                    </div>
                    {formik.touched.confirmPassword &&
                      formik.errors.confirmPassword && (
                        <div className="text-red-500 text-xs">
                          *
                          {typeof formik.errors.confirmPassword === "string"
                            ? formik.errors.confirmPassword
                            : ""}
                        </div>
                      )}
                  </div>
                  <div className="mt-3">
                    <ImagePicker
                      label="Upload Image"
                      placeholder="Upload Image Here..."
                      fileType="Manage MR"
                      type="image"
                      value={formik.values.image}
                      onChange={(val) => formik.setFieldValue("image", val)}
                    />{" "}
                    {formik.touched.image && formik.errors.image && (
                      <div className="text-red-500 text-xs">
                        *
                        {typeof formik.errors.image === "string"
                          ? formik.errors.image
                          : ""}
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
                  {isLoading ? (
                    <Spin indicator={antIcon} />
                  ) : isEdit ? (
                    "Update MR"
                  ) : (
                    "Create MR"
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
                Are you sure you want to delete this <strong>MR</strong>{" "}
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
