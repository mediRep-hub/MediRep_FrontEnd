import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import CustomTable from "../../Components/CustomTable";
import { useQuery } from "@tanstack/react-query";
import {
  approvePayroll,
  generatePayroll,
  getAllPayrolls,
  updatePayroll,
} from "../../api/payrollsServices";
import { IoMdCloseCircle } from "react-icons/io";
import CustomInput from "../../Components/CustomInput";
import { notifyError, notifySuccess } from "../../Components/Toast";
import { useFormik } from "formik";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import SearchById from "../../Components/SearchBar/searchById";
import SearchByName from "../../Components/SearchBar/searchByName";
import { useDebounce } from "../../Components/Debounce";
import type { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { MonthYearPicker } from "../../Components/FilterMonthYear";
import { useSelector } from "react-redux";
import CustomSelect from "../../Components/Select";
import { payrollSchema } from "../../utils/validation";

const tableHeaders = [
  "Employee ID",
  "Employee Name",
  "Position",
  "Present Days",
  "Gross Salary",
  "Net Pay",
  "Approved By",
  "Payroll Status",
  "Action",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export default function Payroll() {
  const navigate = useNavigate();
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [editing, setEditing] = useState<any>(null);
  const [openModel, setOpenModel] = useState(false);
  const [isloading, setLoading] = useState(false);
  const { user } = useSelector((state: any) => {
    return state.user;
  });
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const debouncedSearchId = useDebounce(searchId, 500);
  const debouncedSearchName = useDebounce(searchName, 500);
  const currentMonth = months[new Date().getMonth()];
  const currentYear = new Date().getFullYear();

  const [selectedMonthYear, setSelectedMonthYear] = useState({
    month: currentMonth,
    year: currentYear,
  });

  const { data, refetch, isFetching } = useQuery<AxiosResponse<any>>({
    queryKey: [
      "Payrolls",
      debouncedSearchId,
      debouncedSearchName,
      selectedMonthYear,
    ],
    queryFn: () =>
      getAllPayrolls(
        debouncedSearchId,
        debouncedSearchName,
        selectedMonthYear.month,
        selectedMonthYear.year
      ),
    placeholderData: (previousData) => previousData,
  });

  const handleApprove = (rowData: any) => {
    if (rowData?.payrollStatus === "Approved") {
      notifyError("Payroll is already approved.");
      return;
    }

    const approverName = user?.name || "Admin";

    approvePayroll(rowData._id, { approvedBy: approverName })
      .then(() => {
        notifySuccess("Payroll approved successfully");
        refetch();
      })
      .catch((error) => {
        console.error(error);
        notifyError("Failed to approve payroll.");
      });
  };

  const handleGoToDetails = (row: any[]) => {
    const rowData = data?.data?.find((v: any) => v.employeeId === row[0]);

    if (rowData) {
      navigate("/payroll/payrollDetails", {
        state: { rowData },
      });
    }
  };
  const tableData =
    data?.data?.map((v: any) => [
      v.employeeId,
      v.employeeName,
      v.position || "-",
      v.presentDays,
      v.grossSalary,
      v.netPay,
      v?.approvedBy,
      <span
        key={v._id + "-status"}
        className={`px-3 py-0.5 rounded-sm font-medium text-sm border ${
          v.payrollStatus === "Pending"
            ? "text-[#0755E9] border-[#0755E9]"
            : v.payrollStatus === "Approved"
            ? "text-green-600 border-green-600"
            : "text-gray-600 border-gray-400"
        }`}
      >
        {v.payrollStatus}
      </span>,
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="relative"
      >
        <Icon
          icon="ph:dots-three-outline-vertical-duotone"
          className="text-2xl text-[#0755E9] cursor-pointer"
          onClick={() => setOpenActionId(openActionId === v._id ? null : v._id)}
        />

        {openActionId === v._id && (
          <div className="absolute right-0 z-50 w-40 mt-2 bg-white rounded-lg shadow-lg">
            <button
              disabled={v.payrollStatus == "Approved"}
              onClick={() => {
                setEditing(v);
                setOpenModel(true);
                setOpenActionId(null);
              }}
              className="px-4 py-2 w-full text-sm hover:bg-[#E5EBF7] cursor-pointer flex items-center gap-2 disabled:text-[#7d7d7d]/48"
            >
              Edit
            </button>
            <button
              disabled={v.payrollStatus == "Approved"}
              onClick={() => {
                handleApprove(v);
                setOpenActionId(null);
              }}
              className="px-4 py-2 w-full text-sm hover:bg-[#E5EBF7] cursor-pointer flex items-center gap-2 disabled:text-[#7d7d7d]/48"
            >
              Approved
            </button>{" "}
          </div>
        )}
      </div>,
    ]) || [];

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      employeeId: editing?.employeeId || "",
      employeeName: editing?.employeeName || "",
      position: editing?.position || "",
      month: editing?.month || "",
      year: editing?.year || "",
      totalWorkingDays: editing?.totalWorkingDays || "",
      presentDays: editing?.presentDays || 0,
      approvedLeaves: editing?.approvedLeaves || 0,
      basicSalary: editing?.basicSalary || 0,
      allowances: {
        medical: editing?.allowances?.medical || 0,
        transport: editing?.allowances?.transport || 0,
        others: editing?.allowances?.others || 0,
      },
      deductions: {
        pf: editing?.deductions?.pf || 0,
        loan: editing?.deductions?.loan || 0,
        advanceSalary: editing?.deductions?.advanceSalary || 0,
        tax: editing?.deductions?.tax || 0,
        others: editing?.deductions?.others || 0,
      },
    },
    validationSchema: payrollSchema,
    onSubmit: (values) => {
      setLoading(true);
      if (editing) {
        updatePayroll(editing._id, values)
          .then(() => {
            notifySuccess("Payroll updated successfully");
            setOpenModel(false);
            setEditing(null);
            formik.resetForm();
            refetch();
          })
          .catch((error) => {
            console.error(error);
            notifyError("Failed to update Payroll.");
          })
          .finally(() => setLoading(false));
      } else {
        generatePayroll(values)
          .then(() => {
            notifySuccess("Payroll generated successfully");
            setOpenModel(false);
            formik.resetForm();
            refetch();
          })
          .catch((error) => {
            console.error(error);
            notifyError("Failed to generate payroll.");
          })
          .finally(() => setLoading(false));
      }
    },
  });
  useEffect(() => {
    document.title = "HR-Management | Payroll";
  }, []);
  return (
    <>
      <div className="bg-[#F7F7F7] md:h-[calc(100vh-129px)] h-auto rounded-xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-5 lg:flex-nowrap">
          <div>
            <MonthYearPicker
              value={selectedMonthYear}
              onChange={(val) => setSelectedMonthYear(val)}
            />{" "}
          </div>
          <div className="flex flex-wrap items-center w-full gap-5 md:gap-4 md:w-auto">
            <div className="flex flex-wrap items-center gap-2 md:flex-nowrap">
              <div className="w-full md:w-62 lg:w-60 xl:w-70 2xl:w-70">
                <SearchById value={searchId} onChange={setSearchId} />
              </div>
              <div className="w-full md:w-62 lg:w-60 xl:w-70 2xl:w-70">
                <SearchByName value={searchName} onChange={setSearchName} />
              </div>
            </div>
            <button
              onClick={() => {
                setOpenModel(true);
                setEditing(null);
              }}
              className="h-10 w-full md:w-[180px] bg-[#0755E9] rounded-md gap-3 cursor-pointer flex justify-center items-center"
            >
              <Icon
                icon="mingcute:add-fill"
                height="20"
                width="20"
                color="#fff"
              />
              <p className="text-base font-medium text-white">Add Payroll</p>
            </button>
          </div>
        </div>
        <div className="bg-[#E5EBF7] mt-4 p-4 rounded-xl h-auto">
          <div
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(76vh-0px)] xl:h-[calc(61vh-0px)]  overflow-y-auto scrollbar-none"
          >
            <CustomTable
              titles={tableHeaders}
              data={tableData}
              isFetching={isFetching}
              handleGoToDetail={handleGoToDetails}
            />
          </div>
        </div>
      </div>

      {openModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="relative p-6 bg-white mx-3 rounded-xl w-[1000px] max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between mb-4">
              <p className="text-xl font-medium">
                {editing ? "Update Payroll" : "Add Payroll"}
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
                      label="Employee ID"
                      placeholder="Enter Employee ID"
                      name="employeeId"
                      value={formik.values.employeeId}
                      onChange={formik.handleChange}
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
                    <CustomInput
                      label="Employee Name"
                      placeholder="Enter Employee Name"
                      name="employeeName"
                      value={formik.values.employeeName}
                      onChange={formik.handleChange}
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
                    <CustomInput
                      label="Position"
                      placeholder="Enter Position"
                      name="position"
                      value={formik.values.position}
                      onChange={formik.handleChange}
                    />{" "}
                    {formik.touched.position &&
                      formik.errors.position &&
                      typeof formik.errors.position === "string" && (
                        <div className="text-xs text-red-500">
                          * {formik.errors.position}
                        </div>
                      )}
                  </div>
                  <div>
                    {" "}
                    <CustomSelect
                      options={months}
                      placeholder="Enter Month"
                      value={formik.values.month}
                      onChange={(val) => formik.setFieldValue("month", val)}
                    />{" "}
                    {formik.touched.month &&
                      formik.errors.month &&
                      typeof formik.errors.month === "string" && (
                        <div className="text-xs text-red-500">
                          * {formik.errors.month}
                        </div>
                      )}
                  </div>
                  <div>
                    {" "}
                    <CustomInput
                      label="Enter Year"
                      placeholder="Enter Year"
                      name="year"
                      value={formik.values.year}
                      onChange={formik.handleChange}
                    />{" "}
                    {formik.touched.year &&
                      formik.errors.year &&
                      typeof formik.errors.year === "string" && (
                        <div className="text-xs text-red-500">
                          * {formik.errors.year}
                        </div>
                      )}
                  </div>{" "}
                  <div>
                    {" "}
                    <CustomInput
                      label="Working Days"
                      placeholder="Enter Working Days"
                      name="totalWorkingDays"
                      value={formik.values.totalWorkingDays}
                      onChange={formik.handleChange}
                    />{" "}
                    {formik.touched.totalWorkingDays &&
                      formik.errors.totalWorkingDays &&
                      typeof formik.errors.totalWorkingDays === "string" && (
                        <div className="text-xs text-red-500">
                          * {formik.errors.totalWorkingDays}
                        </div>
                      )}
                  </div>
                  <div>
                    {" "}
                    <CustomInput
                      label="Present Days"
                      placeholder="Enter Present Days"
                      name="presentDays"
                      value={formik.values.presentDays}
                      onChange={formik.handleChange}
                    />{" "}
                    {formik.touched.presentDays &&
                      formik.errors.presentDays &&
                      typeof formik.errors.presentDays === "string" && (
                        <div className="text-xs text-red-500">
                          * {formik.errors.presentDays}
                        </div>
                      )}
                  </div>
                  <div>
                    {" "}
                    <CustomInput
                      label="Approved Leaves"
                      placeholder="Enter Approved Leaves"
                      name="approvedLeaves"
                      value={formik.values.approvedLeaves}
                      onChange={formik.handleChange}
                    />{" "}
                    {formik.touched.approvedLeaves &&
                      formik.errors.approvedLeaves &&
                      typeof formik.errors.approvedLeaves === "string" && (
                        <div className="text-xs text-red-500">
                          * {formik.errors.approvedLeaves}
                        </div>
                      )}
                  </div>
                  <div>
                    {" "}
                    <CustomInput
                      label="Basic Salary"
                      placeholder="Enter Basic Salary"
                      name="basicSalary"
                      value={formik.values.basicSalary}
                      onChange={formik.handleChange}
                    />{" "}
                    {formik.touched.basicSalary &&
                      formik.errors.basicSalary &&
                      typeof formik.errors.basicSalary === "string" && (
                        <div className="text-xs text-red-500">
                          * {formik.errors.basicSalary}
                        </div>
                      )}
                  </div>
                </div>

                <div className="flex-1 space-y-4 min-w-70">
                  <h3 className="text-lg font-semibold">Allowances</h3>
                  {Object.keys(formik.values.allowances).map((key) => (
                    <CustomInput
                      key={key}
                      label={key.charAt(0).toUpperCase() + key.slice(1)}
                      placeholder={`Enter ${key}`}
                      name={`allowances.${key}`}
                      value={
                        formik.values.allowances[
                          key as keyof typeof formik.values.allowances
                        ]
                      }
                      onChange={formik.handleChange}
                    />
                  ))}

                  <h3 className="mt-4 text-lg font-semibold">Deductions</h3>
                  {Object.keys(formik.values.deductions).map((key) => (
                    <CustomInput
                      key={key}
                      label={key.charAt(0).toUpperCase() + key.slice(1)}
                      placeholder={`Enter ${key}`}
                      name={`deductions.${key}`}
                      value={
                        formik.values.deductions[
                          key as keyof typeof formik.values.deductions
                        ]
                      }
                      onChange={formik.handleChange}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end mt-5">
                <button
                  type="submit"
                  className="h-10 w-full md:w-45 bg-[#0755E9] rounded-md gap-3 cursor-pointer flex justify-center items-center text-white font-medium"
                >
                  {isloading ? (
                    <Spin
                      indicator={
                        <Loading3QuartersOutlined
                          style={{ fontSize: 24, color: "white" }}
                          spin
                        />
                      }
                    />
                  ) : editing ? (
                    "Update Payroll"
                  ) : (
                    "Generate Payroll"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
