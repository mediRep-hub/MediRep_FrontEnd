import { FaArrowLeft, FaCheck, FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { notifyError, notifySuccess } from "../../Components/Toast";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { updatePassword } from "../../api/adminServices";

interface EmployeeData {
  _id: string;
  employeeId: string;
  image: string;
  name: string;
  DOB: string;
  gender: string;
  phoneNumber: string;
  email: string;
  position: string;
  employeeStatus: string;
  employeeType: string;
  joiningDate: string;
  department: string;
  salaryStructure: {
    basic: number;
    gross: number;
    tax: number;
    incentive: {
      flue: number;
      medical: number;
      others: number;
    };
  };
  loanPF: {
    loan: number;
    pf: number;
  };
  leaveEntitlements?: {
    annualLeave?: { total: number; consumed: number };
    casualLeave?: { total: number; consumed: number };
    maternityLeave?: { total: number; consumed: number };
    paternityLeave?: { total: number; consumed: number };
    sickLeave?: { total: number; consumed: number };
  };
}

export default function EmployeeDetails() {
  useEffect(() => {
    document.title = "HR-Management | Employees Details";
  }, []);
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { rowData } = (location.state as { rowData: EmployeeData }) || {};

  if (!rowData) {
    // Data not yet available, or page accessed directly
    return <p>Loading employee data...</p>;
  }

  const navigate = useNavigate();

  const handleUpdatePassword = async () => {
    setLoading(true);
    try {
      await updatePassword(rowData._id, { password });
      notifySuccess("Password updated successfully!");
      setPassword("");
    } catch (err: any) {
      console.error(err);
      notifyError(err?.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const leaveEntitlements = rowData.leaveEntitlements || {
    annualLeave: { consumed: 0, total: 0 },
    casualLeave: { consumed: 0, total: 0 },
    maternityLeave: { consumed: 0, total: 0 },
    paternityLeave: { consumed: 0, total: 0 },
    sickLeave: { consumed: 0, total: 0 },
  };
  type LeaveType =
    | "annualLeave"
    | "casualLeave"
    | "maternityLeave"
    | "paternityLeave"
    | "sickLeave";

  const leaveTypes: {
    label: string;
    type: LeaveType;
    bgColor: string;
    iconColor: string;
  }[] = [
    {
      label: "Annual Leaves",
      type: "annualLeave",
      bgColor: "#FDECEC",
      iconColor: "#E53935",
    },
    {
      label: "Sick Leaves",
      type: "sickLeave",
      bgColor: "#FDECEC",
      iconColor: "#E53935",
    },
    {
      label: "Casual Leaves",
      type: "casualLeave",
      bgColor: "#FDECEC",
      iconColor: "#E53935",
    },
    {
      label: "Maternity Leaves",
      type: "maternityLeave",
      bgColor: "#FDECEC",
      iconColor: "#E53935",
    },
    {
      label: "Paternity Leaves",
      type: "paternityLeave",
      bgColor: "#FDECEC",
      iconColor: "#E53935",
    },
  ];

  return (
    <>
      <div className="bg-[#F7F7F7] h-[calc(100vh-110px)] rounded-xl p-4 flex flex-col">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div
            onClick={() => navigate("/employees")}
            className="h-10 w-10 cursor-pointer rounded-lg border border-[#D2D2D2] flex justify-center items-center bg-white"
          >
            <FaArrowLeft size={16} />
          </div>
        </div>

        <div
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          className="flex-1 p-4 overflow-y-auto bg-white shadow-md rounded-xl"
        >
          <div className="bg-white rounded-xl border border-[#8FB1FF] p-4 flex-1">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-[#E5EBF7] flex items-center justify-center">
                <div className="w-16 h-16 overflow-hidden rounded-full">
                  <img
                    src={rowData.image}
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-[14px] font-semibold">{rowData.name}</h3>
                <p className="text-[#0755E9] text-[12px]">
                  {rowData.employeeId}
                </p>
              </div>
            </div>

            <h4 className="text-[16px] mt-5">Personal Information</h4>
            <div className="grid grid-cols-1 gap-2 mt-2 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className=" text-[#7D7D7D] w-30 text-sm">DOB</p>
                <p className="text-[#131313] font-medium">
                  {dayjs(rowData.DOB).format("DD-MM-YYYY")}
                </p>
              </div>
              <div>
                <p className=" text-[#7D7D7D] w-30 text-sm">Gender</p>
                <p className="text-[#131313] font-medium">{rowData.gender}</p>
              </div>
              <div>
                <p className=" text-[#7D7D7D] w-30 text-sm"> Phone Number</p>
                <p className="text-[#131313] font-medium">
                  {rowData.phoneNumber}
                </p>
              </div>

              <div>
                <p className=" text-[#7D7D7D] w-30 text-sm"> Email</p>
                <p className="text-[#131313] font-medium">{rowData.email}</p>
              </div>
            </div>

            <h4 className="text-[16px] mt-5">Employee Detail</h4>
            <div className="grid grid-cols-1 gap-2 mt-2 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className=" text-[#7D7D7D] w-30 text-sm">
                  {" "}
                  Emplolyee Status:
                </p>
                <p className="text-[#131313] font-medium">
                  {rowData.employeeStatus}
                </p>
              </div>
              <div>
                <p className=" text-[#7D7D7D] w-30 text-sm"> Employee Type</p>
                <p className="text-[#131313] font-medium">
                  {rowData.employeeType}
                </p>
              </div>
              <div>
                <p className=" text-[#7D7D7D] w-30 text-sm"> Joining Date</p>

                <p className="text-[#131313] font-medium">
                  {dayjs(rowData.joiningDate).format("DD-MM-YYYY")}
                </p>
              </div>
              <div>
                <p className=" text-[#7D7D7D] w-30 text-sm"> Department</p>
                <p className="text-[#131313] font-medium">
                  {rowData.department}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-[#EEF3FB] rounded-xl p-5">
            <p className="text-sm font-medium text-[#131313] mb-3">Password</p>

            <div className="flex flex-wrap items-center gap-4 md:flex-nowrap">
              <div className="relative w-full">
                <label className="absolute -top-2 left-5 bg-white px-1 text-xs text-[#7d7d7d]">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-md w-full h-10 pr-15 px-3 py-2 text-sm outline-none border-[#0755E9] border-[0.5px]"
                />

                <span
                  className="absolute right-4 top-3.5 cursor-pointer text-[#7D7D7D]"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? (
                    <FiEye style={{ fontSize: "20px" }} />
                  ) : (
                    <FiEyeOff style={{ fontSize: "20px" }} />
                  )}
                </span>
              </div>
              <button
                onClick={handleUpdatePassword}
                disabled={loading}
                className="px-4 py-2 h-10 md:w-50 w-full flex justify-center items-center  cursor-pointer rounded-md bg-[#0755E9] text-white"
              >
                {loading ? (
                  <Spin
                    indicator={
                      <Loading3QuartersOutlined
                        style={{ fontSize: 24, color: "white" }}
                        spin
                      />
                    }
                  />
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </div>

          <div className="mt-6 bg-white border border-[#8FB1FF] rounded-xl p-5">
            <h4 className="text-[16px]">Salary Structure</h4>

            <div className="grid grid-cols-1 gap-2 mt-2 md:gap-6 md:grid-cols-3">
              <div>
                <p className="text-[#7D7D7D] text-sm">Basic Salary</p>
                <p className="text-[#131313] font-medium">
                  {rowData.salaryStructure.basic}
                </p>
              </div>

              <div>
                <p className="text-[#7D7D7D] text-sm">Fuel Allowance</p>
                <p className="text-[#131313] font-medium">
                  {rowData.salaryStructure.incentive.flue}
                </p>
              </div>

              <div>
                <p className="text-[#7D7D7D] text-sm">Medical Allowance</p>
                <p className="text-[#131313] font-medium">
                  {rowData.salaryStructure.incentive.medical}
                </p>
              </div>
            </div>

            <h4 className="text-[16px] mt-5 mb-2">Deductions</h4>

            <div className="grid grid-cols-1 gap-6 mt-2 md:grid-cols-3">
              <div>
                <p className="text-[#7D7D7D] text-sm">Loan</p>
                <p className="text-[#131313] font-medium">
                  {rowData.loanPF.loan}
                </p>
              </div>

              <div>
                <p className="text-[#7D7D7D] text-sm">Tax</p>
                <p className="text-[#131313] font-medium">
                  {rowData.salaryStructure.tax}
                </p>
              </div>

              <div>
                <p className="text-[#7D7D7D] text-sm">Provident Fund</p>
                <p className="text-[#131313] font-medium">
                  {rowData.loanPF.pf}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white border border-[#8FB1FF] rounded-xl p-5">
            <h4 className="text-[16px] mb-4 font-medium text-[#2B2B2B]">
              Leaves Information
            </h4>
            <div className="flex flex-wrap gap-y-4 gap-x-6">
              {leaveTypes.map((leave) => {
                const consumed =
                  leaveEntitlements[
                    leave.type as keyof typeof leaveEntitlements
                  ]?.consumed ?? 0;
                const total =
                  leaveEntitlements[
                    leave.type as keyof typeof leaveEntitlements
                  ]?.total ?? 0;

                const isZero = total === 0;

                return (
                  <div
                    key={leave.type}
                    className="flex items-center justify-between w-full md:w-[48%]"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="flex items-center justify-center w-5 h-5 mt-1 rounded-full"
                        style={{ backgroundColor: leave.bgColor }}
                      >
                        {isZero ? (
                          <FaTimes size={12} className="text-[#E53935]" />
                        ) : (
                          <FaCheck size={12} className="text-[#0755E9]" />
                        )}
                      </div>
                      <div>
                        <p className="text-[14px] font-medium">{leave.label}</p>
                        <p className="text-[12px] text-[#7D7D7D]">Used/Total</p>
                      </div>
                    </div>
                    <div
                      className="border border-[#D9D9D9] rounded px-2 py-0.5 text-[12px] min-w-12.5 text-center"
                      style={{ color: isZero ? "#B0B0B0" : "#000" }}
                    >
                      {consumed}/{total}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
