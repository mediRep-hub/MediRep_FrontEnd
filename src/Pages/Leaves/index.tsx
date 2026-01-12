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
  "Leave Type",
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
    document.title = "MediRep | Leaves";
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
          <div className="absolute right-0 z-50 w-40 mt-2 bg-white rounded-lg shadow-lg">
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
            className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(76vh-0px)] xl:h-[calc(61vh-0px)]  overflow-y-auto scrollbar-none"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="relative p-6 bg-white rounded-xl mx-3 w-[1000px] max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between mb-4">
              <p className="text-xl font-medium">
                {editing ? "Update Leaves" : "Add Leaves"}
              </p>
              <IoMdCloseCircle
                size={22}
                onClick={() => setOpenModel(false)}
                className="cursor-pointer text-[#0755E9]"
              />
            </div>
            <form onSubmit={formik.handleSubmit} className="space-y-6">
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
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  disabled={isloading}
                  className="h-10 md:w-48 w-full cursor-pointer bg-[#0755E9] text-white rounded-md flex justify-center items-center gap-2"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="relative h-auto p-6 mx-3 overflow-x-auto bg-white shadow-xl rounded-xl w-[500px]">
            <RiAlertFill className="text-[120px] text-yellow-500 text-center mx-auto mb-2" />
            <div className="text-center">
              <h2 className="mt-5 text-xl font-semibold text-primary">
                Confirm Delete
              </h2>
              <p className="mb-6">
                Are you sure you want to delete this <strong>Leave</strong>?
              </p>
            </div>
            <div className="flex justify-between gap-4 mt-5">
              <button
                onClick={() => setDeleteConfirmation(false)}
                className="py-2 bg-gray-200 rounded cursor-pointer px-7 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-7 py-2 bg-[#E90761] cursor-pointer text-white rounded"
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

  const { user } = useSelector((state: any) => state.user);

  const openConfirm = (status: "Approved" | "Rejected") => {
    setPendingStatus(status);
    setConfirmOpen(true);
    setOpen(false);
  };

  const handleConfirm = () => {
    if (!pendingStatus) return;

    const approvedBy = user?.employeeId;
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
      {/* STATUS DROPDOWN */}
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
