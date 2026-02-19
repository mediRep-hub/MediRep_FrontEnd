import CustomTable from "../../Components/CustomTable";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  applyLeave,
  deleteLeave,
  getAllLeaves,
  updateLeave,
  updateLeavesStatus,
} from "../../api/leaveServices";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { notifyError, notifySuccess } from "../../Components/Toast";
import { useSelector } from "react-redux";
import SearchById from "../../Components/SearchBar/searchById";
import SearchByName from "../../Components/SearchBar/searchByName";
import { useDebounce } from "../../Components/Debounce";
import type { AxiosResponse } from "axios";
import { IoMdCloseCircle } from "react-icons/io";
import CustomInput from "../../Components/CustomInput";
import DatePicker from "../../Components/DatePicker";
import CustomSelect from "../../Components/Select";
import { Spin } from "antd";
import { RiAlertFill } from "react-icons/ri";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { useFormik } from "formik";
import Dummay from "../../assets/Holiday SVG.png";
import { LeaveSchema } from "../../utils/validation";

const titles = [
  "Employee Id",
  "Employee Name",
  "Leave Tye",
  "From",
  "To",
  "Duration",
  "Approved By",
  "Status",
  "Action",
];
const leaveOptions = [
  "Casual Leave",
  "Sick Leave",
  "Annual Leave",
  "Maternity Leave",
  "Paternity Leave",
];
export default function Leaves() {
  useEffect(() => {
    document.title = "HR-Management | Leaves";
  }, []);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const debouncedSearchId = useDebounce(searchId, 500);
  const debouncedSearchName = useDebounce(searchName, 500);

  const [editing, setEditing] = useState<any>(null);
  const [openModel, setOpenModel] = useState(false);
  const [isloading, setLoading] = useState(false);
  const [isloadingDelete, setLoadingDelete] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const searchValue = debouncedSearchId || debouncedSearchName;

  const { data, refetch, isFetching } = useQuery<AxiosResponse<any>>({
    queryKey: ["Leaves", searchValue],
    queryFn: () => getAllLeaves(searchValue),
    placeholderData: (previousData) => previousData,
  });
  const tableData =
    data?.data?.map((v: any) => [
      v.employeeId,
      v.employeeName,
      v.leaveType,
      v.startDate ? dayjs(v.startDate).format("YYYY-MM-DD") : "--",
      v.endDate ? dayjs(v.endDate).format("YYYY-MM-DD") : "--",
      v.startDate && v.endDate
        ? `${dayjs(v.endDate).diff(dayjs(v.startDate), "day") + 1} days`
        : "--",
      v?.approvedBy || "Not Approved",
      <StatusDropdown
        key={v._id}
        initialValue={v.status || "Pending"}
        order={v}
        onStatusChange={async (orderId, status, approvedBy) => {
          try {
            await updateLeavesStatus(orderId, { status, approvedBy });
            notifySuccess("Status Updated Successfully");
            refetch();
          } catch (error: any) {
            notifyError("Failed to update status: " + error.message);
          }
        }}
      />,
      <div className="relative">
        <Icon
          icon="ph:dots-three-outline-vertical-duotone"
          className="text-2xl text-[#0755E9] cursor-pointer"
          onClick={() => setOpenActionId(openActionId === v._id ? null : v._id)}
        />

        {openActionId === v._id && (
          <div className="absolute right-0 z-50 w-[160px] mt-2 bg-white rounded-lg shadow-lg">
            <button
              disabled={v.status === "Approved" || v.status === "Rejected"}
              onClick={() => {
                setEditing(v);
                setOpenModel(true);
                setOpenActionId(null);
              }}
              className="px-4 py-2 text-sm w-full hover:bg-[#E5EBF7] cursor-pointer flex items-center gap-2 disabled:text-[#7d7d7d]/48"
            >
              Edit
            </button>

            <button
              disabled={v.status === "Approved" || v.status === "Rejected"}
              onClick={() => {
                setDeleteConfirmation(true);
                setEditing(v);
              }}
              className="px-4 py-2 text-sm w-full hover:bg-[#E5EBF7] cursor-pointer flex items-center gap-2 disabled:text-[#7d7d7d]/48"
            >
              Delete
            </button>
          </div>
        )}
      </div>,
    ]) || [];
  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 24, color: "white" }} spin />
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      employeeId: editing?.employeeId || "",
      employeeName: editing?.employeeName || "",
      leaveType: editing?.leaveType || "",
      startDate: editing?.startDate ? dayjs(editing.startDate) : null,
      endDate: editing?.endDate ? dayjs(editing.endDate) : null,
      reason: editing?.reason || "",
    },
    validationSchema: LeaveSchema,
    onSubmit: (values) => {
      setLoading(true);

      const payload = {
        ...values,
        startDate: values.startDate?.toISOString(),
        endDate: values.endDate?.toISOString(),
      };

      if (editing) {
        updateLeave(editing._id, payload)
          .then(() => {
            notifySuccess("Leaves updated successfully");
            setOpenModel(false);
            setEditing(null);
            formik.resetForm();
            refetch();
          })
          .catch(() => notifyError("Failed to update Leaves."))
          .finally(() => setLoading(false));
      } else {
        applyLeave(payload)
          .then(() => {
            notifySuccess("Leaves added successfully");
            setOpenModel(false);
            formik.resetForm();
            refetch();
          })
          .catch((error: any) => {
            const message =
              error?.response?.data?.message || "Failed to add Leaves.";
            notifyError(message);
          })
          .finally(() => setLoading(false));
      }
    },
  });
  const handleDelete = () => {
    if (!editing?._id) return;
    setLoadingDelete(true);
    deleteLeave(editing._id)
      .then(() => {
        notifySuccess("Leaves deleted successfully");
        setDeleteConfirmation(false);
        setEditing(null);
        refetch();
      })
      .catch((error) => {
        console.error("Failed to delete Leaves:", error);
        const message =
          error.response?.data?.message ||
          "Failed to delete Leaves. Please try again.";

        notifyError(message);
      })
      .finally(() => {
        setLoadingDelete(false);
        setLoading(false);
      });
  };
  return (
    <>
      <div className="bg-[#F7F7F7] md:h-[calc(100vh-129px)] h-auto rounded-xl p-4">
        <div className="flex flex-wrap items-center justify-end gap-5 md:gap-4">
          <div className="flex flex-wrap items-center gap-3 md:flex-nowrap">
            <SearchById value={searchId} onChange={setSearchId} />
            <SearchByName value={searchName} onChange={setSearchName} />
          </div>
          <button
            onClick={() => {
              setEditing(null);
              setOpenModel(true);
            }}
            className="h-10 w-full md:w-[180px] bg-[#0755E9] rounded-md gap-3 cursor-pointer flex justify-center items-center"
          >
            <Icon
              icon="mingcute:add-fill"
              height="20"
              width="20"
              color="#fff"
            />
            <p className="text-base font-medium text-white">Add Leave</p>
          </button>
        </div>
        <div className="bg-[#E5EBF7] mt-4 p-4 rounded-xl h-auto">
          <div
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(74vh-0px)] xl:h-[calc(62.4vh-0px)]  overflow-y-auto scrollbar-none"
          >
            {" "}
            <CustomTable
              titles={titles}
              data={tableData}
              isFetching={isFetching}
            />
          </div>
        </div>
      </div>
      {openModel && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="bg-white rounded-xl xl:mx-0 mx-5 w-[1000px] max-h-[90vh] overflow-x-auto  shadow-xl relative"
          >
            <div className="flex items-center justify-between bg-[#E5EBF7] xl:px-6 px-4 py-4">
              <p className="text-xl font-medium">
                {editing ? "Update Leaves" : "Add Leaves"}
              </p>
              <div className="h-[35px] group w-[35px] p-2 rounded-full  hover:shadow-[rgba(99,99,99,0.25)_0px_4px_12px_2px] flex items-center justify-center">
                <div className="group-hover:bg-white">
                  <IoMdCloseCircle
                    size={24}
                    onClick={() => setOpenModel(false)}
                    className="cursor-pointer text-primary"
                  />
                </div>
              </div>
            </div>
            <form
              className="xl:p-6 p-4 space-y-6"
              onSubmit={formik.handleSubmit}
            >
              <div className="flex flex-wrap gap-6">
                <div className="flex-1 space-y-4 min-w-70">
                  <div>
                    <CustomInput
                      label="Employee Id"
                      placeholder="Enter Employee Id"
                      value={formik.values.employeeId}
                      onChange={formik.handleChange}
                      name="employeeId"
                    />{" "}
                    {formik.touched.employeeId &&
                      formik.errors.employeeId &&
                      typeof formik.errors.employeeId === "string" && (
                        <div className="text-xs text-red-500">
                          * {formik.errors.employeeId}
                        </div>
                      )}
                  </div>
                  <div>
                    {" "}
                    <CustomInput
                      label="Employee Name"
                      placeholder="Enter name"
                      value={formik.values.employeeName}
                      onChange={formik.handleChange}
                      name="employeeName"
                    />{" "}
                    {formik.touched.employeeName &&
                      formik.errors.employeeName &&
                      typeof formik.errors.employeeName === "string" && (
                        <div className="text-xs text-red-500">
                          * {formik.errors.employeeName}
                        </div>
                      )}
                  </div>
                  <div>
                    <CustomSelect
                      placeholder="Select Leave Type"
                      value={formik.values.leaveType}
                      options={leaveOptions}
                      onChange={(val) => formik.setFieldValue("leaveType", val)}
                    />
                    {formik.touched.leaveType &&
                      formik.errors.leaveType &&
                      typeof formik.errors.leaveType === "string" && (
                        <div className="text-xs text-red-500">
                          * {formik.errors.leaveType}
                        </div>
                      )}
                  </div>
                </div>
                <div className="flex-1 space-y-4 min-w-70">
                  <div>
                    <DatePicker
                      label="Start Date"
                      value={formik.values.startDate}
                      onChange={(date) =>
                        formik.setFieldValue("startDate", date)
                      }
                    />
                    {formik.touched.startDate &&
                      formik.errors.startDate &&
                      typeof formik.errors.startDate === "string" && (
                        <div className="text-xs text-red-500">
                          * {formik.errors.startDate}
                        </div>
                      )}
                  </div>

                  <div>
                    <DatePicker
                      label="End Date"
                      value={formik.values.endDate}
                      onChange={(date) => formik.setFieldValue("endDate", date)}
                    />
                    {formik.touched.endDate &&
                      formik.errors.endDate &&
                      typeof formik.errors.endDate === "string" && (
                        <div className="text-xs text-red-500">
                          * {formik.errors.endDate}
                        </div>
                      )}
                  </div>

                  <div>
                    {" "}
                    <CustomInput
                      label="Reason"
                      placeholder="Enter Reason"
                      value={formik.values.reason}
                      onChange={formik.handleChange}
                      name="reason"
                    />{" "}
                    {formik.touched.reason &&
                      formik.errors.reason &&
                      typeof formik.errors.reason === "string" && (
                        <div className="text-xs text-red-500">
                          * {formik.errors.reason}
                        </div>
                      )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-5 gap-4">
                <button
                  onClick={() => setOpenModel(false)}
                  className="h-[55px] md:w-[100px] w-full bg-[#F2FAFD] text-[#131313] rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isloading}
                  className="h-[55px]  md:w-[180px] w-full cursor-pointer bg-[#0755E9] text-white rounded-md flex justify-center items-center gap-2"
                >
                  {isloading ? (
                    <Spin indicator={antIcon} />
                  ) : editing ? (
                    "Update Leaves"
                  ) : (
                    "Add Leaves"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl xl:mx-0 mx-5 w-[500px] h-auto overflow-x-auto shadow-xl relative">
            <div className="bg-[#E90761]/10 p-4">
              <p className="text-base text-[#131313]">Delete Account</p>
            </div>

            <div className="flex justify-center my-6">
              <div className="flex justify-center items-center bg-[#E90761]/10 h-[120px] w-[120px] rounded-full">
                <div className="flex justify-center items-center  bg-[#E90761] h-[80px] w-[80px] rounded-full">
                  <Icon
                    icon="mingcute:delete-line"
                    className="text-4xl text-white"
                  />
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-base font-normal text-[#131313] mt-5">
                Are you sure to delete this account?
              </p>
              <p className="mb-6 text-[#7D7D7D]/40">
                Once you delete it will not restored
              </p>
            </div>
            <div className="flex mt-5 justify-end gap-4 p-4">
              <button
                onClick={() => setDeleteConfirmation(false)}
                className="px-7 h-[48px] py-2 font-medium bg-[#FDE6EF] rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-7 h-[48px] py-2 bg-[#E90761] font-medium text-white rounded-md"
              >
                {isloadingDelete ? <Spin indicator={antIcon} /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface StatusDropdownProps {
  initialValue: "Pending" | "Approved" | "Rejected";
  order: any;
  onStatusChange: (orderId: string, status: string, approvedBy: string) => void;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({
  initialValue,
  order,
  onStatusChange,
}) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<string>(initialValue);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<
    "Approved" | "Rejected" | null
  >(null);

  const { user } = useSelector((state: any) => {
    return state.user;
  });
  const openConfirm = (status: "Approved" | "Rejected") => {
    setPendingStatus(status);
    setConfirmOpen(true);
    setOpen(false);
  };

  const handleConfirm = () => {
    if (!pendingStatus) return;

    const approvedBy = user?.adminId;

    onStatusChange(order._id, pendingStatus, approvedBy);

    setStatus(pendingStatus);
    setConfirmOpen(false);
    setPendingStatus(null);
  };

  const statusStyles: { [key: string]: string } = {
    Approved: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
    Pending: "bg-yellow-100 text-yellow-800",
  };

  return (
    <>
      <div className="relative w-30">
        <div
          onClick={() => setOpen(!open)}
          className={`p-2 rounded cursor-pointer flex justify-between items-center ${statusStyles[status]}`}
        >
          {status}
          <Icon icon="formkit:down" height={18} width={18} />
        </div>

        {open && status === "Pending" && (
          <div className="absolute left-0 z-20 w-full mt-1 bg-white rounded drop-shadow-xl">
            <div
              onClick={() => openConfirm("Approved")}
              className="p-2 text-green-700 cursor-pointer hover:bg-gray-100"
            >
              Approve
            </div>
            <div
              onClick={() => openConfirm("Rejected")}
              className="p-2 text-red-700 cursor-pointer hover:bg-gray-100"
            >
              Reject
            </div>
          </div>
        )}
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#E5EBF7] mx-3 rounded-xl w-120">
            <div className="flex justify-between p-6">
              <p className="text-xl font-medium">Confirm {pendingStatus}</p>
              <IoMdCloseCircle
                size={22}
                onClick={() => setConfirmOpen(false)}
                className="cursor-pointer text-[#0755E9]"
              />
            </div>
            <div className="p-6 bg-white rounded-b-xl">
              <img src={Dummay} className="h-auto mx-auto mb-5 w-30" />

              <p className="text-[#131313] md:text-2xl text-base text-center">
                Are you sure to confirm the leaves?{" "}
              </p>
              <p className="text-[#7d7d7d] md:text-sm text-xs text-center">
                Once you confirm the approval it will not be revert
              </p>

              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={() => {
                    setConfirmOpen(false);
                    setPendingStatus(null);
                  }}
                  className="px-4 py-2 cursor-pointer bg-[#F2FAFD] rounded hover:bg-[#F2FAFD]"
                >
                  Cancel
                </button>

                <button
                  onClick={handleConfirm}
                  className={`px-4 py-2 rounded cursor-pointer text-white ${
                    pendingStatus === "Approved"
                      ? "bg-[#0755E9] hover:bg-[#0755E9]"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
