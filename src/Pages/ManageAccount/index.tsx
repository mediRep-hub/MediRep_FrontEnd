import { useEffect, useState } from "react";
import { MdAdd, MdDeleteOutline } from "react-icons/md";
import { RiAlertFill } from "react-icons/ri";
import CustomTable from "../../Components/CustomTable";
import { IoMdCloseCircle } from "react-icons/io";
import CustomInput from "../../Components/CustomInput";
import CustomSelect from "../../Components/Select";
import ImagePicker from "../../Components/ImagePicker";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { TbEdit } from "react-icons/tb";

import { FiEye, FiEyeOff } from "react-icons/fi";
import { notifyError, notifySuccess } from "../../Components/Toast";
import { useFormik } from "formik";
import { AccountSchema } from "../../utils/validation";
import { useQuery } from "@tanstack/react-query";
import {
  addAccount,
  deleteAccount,
  getAllAccounts,
  updateAccount,
} from "../../api/adminServices";

const titles = [
  "ID",
  "Name",
  "Email",
  "Division",
  "Position",
  "Region",
  "Action",
];
const Divisionlist = ["Sales", "Marketing"];
const Positionlist = [
  "Director Sales",
  "National Sales Manger (NSM)",
  "Regional Sales Manager (RSM)",
  "Area Sales Manager (ASM)",
  "MedicalRep(MR)",
];
const Arealist = ["Lahore", "Islamabad", "Bahawalpur", "Karachi"];
const StrategyList = ["Canal Road", "Riwind Road", "Multan Road", "Gt Road"];
const RegionList = ["Sindh", "North Punjab", "Kashmir", "South Punjab"];

export default function ManageAccount() {
  const [isEdit, setEdit] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);
  const [selectTab, setSelectTab] = useState("sales");
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordConfirmVisible, setPasswordonfirmVisible] = useState(false);
  const [isloadingDelete, setLoadingDelete] = useState(false);
  const { data, refetch } = useQuery({
    queryKey: ["AllAccount"],
    queryFn: () => getAllAccounts(),
    staleTime: 5 * 60 * 1000,
  });
  const AllAccounts = data?.data?.admins || [];
  let tableData: any = [];
  if (Array.isArray(AllAccounts)) {
    AllAccounts.forEach((v: any) => {
      if (v?.division === "Sales") {
        tableData.push([
          v?.adminId,
          v?.name,
          v?.email,
          v?.division,
          v?.position,
          v?.region,
          <div className="flex items-center gap-2" key={v._id}>
            <TbEdit
              onClick={() => {
                setEdit(true);
                setEditingAccount(v);
                setCreateAccount(true);
              }}
              size={18}
              className="text-primary cursor-pointer"
            />
            <MdDeleteOutline
              onClick={() => {
                setDeleteConfirmation(true);
                setEditingAccount(v);
              }}
              size={18}
              className="text-red-600 cursor-pointer"
            />
          </div>,
        ]);
      }
    });
  }
  let tableDatamark: any = [];
  if (Array.isArray(AllAccounts)) {
    AllAccounts.forEach((v: any) => {
      if (v?.division === "Marketing") {
        tableDatamark.push([
          v?.adminId,
          v?.name,
          v?.email,
          v?.division,
          v?.position,
          v?.region,
          <div className="flex items-center gap-2" key={v._id}>
            <TbEdit
              onClick={() => {
                setEdit(true);
                setEditingAccount(v);
                setCreateAccount(true);
              }}
              size={18}
              className="text-primary cursor-pointer"
            />
            <MdDeleteOutline
              onClick={() => {
                setDeleteConfirmation(true);
                setEditingAccount(v);
              }}
              size={18}
              className="text-red-600 cursor-pointer"
            />
          </div>,
        ]);
      }
    });
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: editingAccount?.name || "",
      phoneNumber: editingAccount?.phoneNumber || "",
      email: editingAccount?.email || "",
      password: "",
      confirmPassword: "",
      image: editingAccount?.image || "",
      division: editingAccount?.division || "",
      area: editingAccount?.area || "",
      region: editingAccount?.region || "",
      strategy: editingAccount?.strategy || "",
      position: editingAccount?.position || "",
    },
    validationSchema: AccountSchema(isEdit),
    onSubmit: (values) => {
      setLoading(true);
      if (editingAccount) {
        updateAccount(editingAccount._id, values)
          .then(() => {
            notifySuccess("Account updated successfully");
            setCreateAccount(false);
            setEditingAccount(null);
            formik.resetForm();
            refetch();
          })
          .catch((error) => {
            console.error(error);
            notifyError("Failed to update Account.");
          })
          .finally(() => setLoading(false));
      } else {
        addAccount(values)
          .then((res) => {
            console.log("✅ Account added successfully:", res.data);
            notifySuccess("Account added successfully!");
            setCreateAccount(false);
            formik.resetForm();
            refetch();
          })
          .catch((error) => {
            console.error("❌ Error creating Account:", error);
            notifyError("Failed to add Account. Please try again.");
          })
          .finally(() => setLoading(false));
      }
    },
  });
  const handleDelete = () => {
    setLoadingDelete(true);
    deleteAccount(editingAccount?._id)
      .then(() => {
        notifySuccess("Account deleted successfully");
        setDeleteConfirmation(false);
        refetch();
      })
      .catch((error) => {
        console.error("Failed to delete Account:", error);
        notifyError("Failed to delete Account. Please try again.");
      })
      .finally(() => {
        setLoadingDelete(false);
      });
  };
  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 24, color: "white" }} spin />
  );
  useEffect(() => {
    document.title = "MediRep | Manage Account";
  }, []);
  return (
    <div>
      {" "}
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap gap-4 justify-between">
          <p className="text-heading font-medium text-[22px] sm:text-[24px]">
            Manage Account
          </p>
          <button
            onClick={() => {
              setCreateAccount(true);
              setEditingAccount(null);
              setEdit(false);
            }}
            className="h-[55px] w-full md:w-[180px] bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
          >
            <MdAdd size={20} color="#fff" />{" "}
            <p className="text-white text-base font-medium">Create Account</p>
          </button>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            className={`w-[120px] h-12 rounded-t-lg ${
              selectTab === "sales" ? "bg-[#E5EBF7]" : "bg-white"
            }`}
            onClick={() => {
              setSelectTab("sales");
            }}
          >
            Sales
          </button>
          <button
            className={`w-[120px] h-12 rounded-t-lg ${
              selectTab === "marketing" ? "bg-[#E5EBF7]" : "bg-white"
            }`}
            onClick={() => {
              setSelectTab("marketing");
            }}
          >
            Marketing
          </button>
        </div>
        <div className="bg-[#E5EBF7] rounded-tl-none  rounded-[12px] p-4 2xl:h-[calc(85vh-120px)] xl:h-[calc(90vh-208px)] h-auto ">
          <p className="text-[#7D7D7D] font-medium text-sm">Accounts</p>
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(80vh-135px)] xl:h-[calc(70vh-134px)] mt-4 overflow-y-auto scrollbar-none"
          >
            {selectTab === "sales" ? (
              <CustomTable titles={titles} data={tableData} />
            ) : (
              <CustomTable titles={titles} data={tableDatamark} />
            )}
          </div>
        </div>
      </div>
      {createAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="bg-white rounded-xl xl:mx-0 mx-5 w-[1000px] max-h-[90vh] overflow-x-auto xl:p-6 p-4 shadow-xl relative"
          >
            <div className="flex items-center justify-between ">
              <p className="text-[24px] text-heading capitalize font-medium">
                {isEdit === false ? "Add Account" : "Update Account"}
              </p>
              <IoMdCloseCircle
                size={20}
                onClick={() => setCreateAccount(false)}
                className="cursor-pointer text-primary"
              />
            </div>
            <p className="text-base mt-1 font-normal text-[#979797]">
              {isEdit === false ? "Add Account" : "Update Account"}
            </p>
            <form className="mt-5" onSubmit={formik.handleSubmit}>
              <div className="flex flex-wrap  gap-8">
                <div className="md:w-[calc(50%-16px)] w-full">
                  <div className="mt-3">
                    <CustomInput
                      name="name"
                      value={formik.values.name}
                      label="Name"
                      placeholder="Paul Walker"
                      onChange={formik.handleChange}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <div className="text-red-500 text-xs">
                        *
                        {typeof formik.errors.name === "string"
                          ? formik.errors.name
                          : ""}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <CustomInput
                      name="phoneNumber"
                      label="Phone Number"
                      value={formik.values.phoneNumber}
                      placeholder="e.g, +92-321-123-4567"
                      onChange={formik.handleChange}
                    />
                    {formik.touched.phoneNumber &&
                      formik.errors.phoneNumber && (
                        <div className="text-red-500 text-xs">
                          *
                          {typeof formik.errors.phoneNumber === "string"
                            ? formik.errors.phoneNumber
                            : ""}
                        </div>
                      )}
                  </div>
                  <div className="mt-3">
                    <CustomInput
                      name="email"
                      label="Email"
                      placeholder="Enter email here"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="text-red-500 text-xs">
                        *
                        {typeof formik.errors.email === "string"
                          ? formik.errors.email
                          : ""}
                      </div>
                    )}
                  </div>
                  {isEdit === false && (
                    <>
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
                      </div>
                      <div className="mt-3">
                        <div className="relative w-full">
                          <label className="absolute -top-2 left-5 bg-white px-1 text-xs text-gray-500">
                            Confirm Password
                          </label>
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={
                              passwordConfirmVisible
                                ? "text"
                                : "Confirm Password"
                            }
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
                        </div>{" "}
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
                    </>
                  )}
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
                <div className="md:w-[calc(50%-16px)] w-full">
                  <div className="mt-3">
                    <CustomSelect
                      options={Divisionlist}
                      placeholder="Division"
                      onChange={(val) => formik.setFieldValue("division", val)}
                      value={formik.values.division}
                    />
                    {formik.touched.division && formik.errors.division && (
                      <div className="text-red-500 text-xs">
                        *
                        {typeof formik.errors.division === "string"
                          ? formik.errors.division
                          : ""}
                      </div>
                    )}
                  </div>{" "}
                  <div className="mt-3">
                    <CustomSelect
                      value={formik.values.area}
                      options={Arealist}
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
                    )}{" "}
                  </div>{" "}
                  <div className="mt-3">
                    <CustomSelect
                      value={formik.values.region}
                      options={RegionList}
                      placeholder="Region"
                      onChange={(val) => formik.setFieldValue("region", val)}
                    />
                    {formik.touched.region && formik.errors.region && (
                      <div className="text-red-500 text-xs">
                        *
                        {typeof formik.errors.region === "string"
                          ? formik.errors.region
                          : ""}
                      </div>
                    )}
                  </div>{" "}
                  <div className="mt-3">
                    <CustomSelect
                      value={formik.values.strategy}
                      options={StrategyList}
                      onChange={(val) => formik.setFieldValue("strategy", val)}
                      placeholder="Select Strategy"
                    />{" "}
                    {formik.touched.strategy && formik.errors.strategy && (
                      <div className="text-red-500 text-xs">
                        *
                        {typeof formik.errors.strategy === "string"
                          ? formik.errors.strategy
                          : ""}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <CustomSelect
                      value={formik.values.position}
                      options={Positionlist}
                      placeholder="Position"
                      onChange={(val) => formik.setFieldValue("position", val)}
                    />{" "}
                    {formik.touched.position && formik.errors.position && (
                      <div className="text-red-500 text-xs">
                        *
                        {typeof formik.errors.position === "string"
                          ? formik.errors.position
                          : ""}
                      </div>
                    )}
                  </div>{" "}
                </div>
              </div>
              <div className="flex justify-end mt-5">
                <button
                  type="submit"
                  className="h-[55px] md:w-[200px] w-full bg-primary text-white rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
                >
                  {isLoading ? (
                    <Spin indicator={antIcon} />
                  ) : isEdit === false ? (
                    "Create Account"
                  ) : (
                    "Update Account"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl xl:mx-0 mx-5 w-[500px] h-auto overflow-x-auto xl:p-6 p-4 shadow-xl relative">
            <RiAlertFill className="text-[120px] text-yellow-500 text-center mx-auto mb-2" />
            <div className="text-center">
              <h2 className="text-xl font-semibold text-primary mt-5">
                Confirm Delete
              </h2>
              <p className="mb-6">
                Are you sure you want to delete this <strong>Account</strong>{" "}
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
                {isloadingDelete ? <Spin indicator={antIcon} /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
