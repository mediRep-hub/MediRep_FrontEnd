import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { updatePassword } from "../../api/adminServices";
import { notifyError, notifySuccess } from "../../Components/Toast";

export default function AccountDetails() {
  useEffect(() => {
    document.title = "HR-Management | Employees Details";
  }, []);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const location = useLocation();
  const account = location.state?.row;

  const navigate = useNavigate();

  const handleUpdatePassword = async () => {
    setLoading(true);
    try {
      await updatePassword(account._id, { password });
      notifySuccess("Password updated successfully!");
      setPassword("");
    } catch (err: any) {
      console.error(err);
      notifyError(err?.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-[#F7F7F7] h-[calc(100vh-129px)] rounded-xl p-4 flex flex-col">
        <div className="flex items-center gap-3 mb-3">
          <div
            onClick={() => navigate("/manageAccounts")}
            className="h-10 w-10 cursor-pointer rounded-lg border border-[#D2D2D2] flex justify-center items-center bg-white"
          >
            <Icon
              icon="material-symbols:arrow-back-rounded"
              className="text-xl"
            />
          </div>
          <p className="text-2xl font-medium">Account Details</p>
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
                    src={account.image}
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-[14px] font-semibold">{account.name}</h3>
                <p className="text-[#0755E9] text-[12px]">{account.adminId}</p>
              </div>
            </div>

            <h4 className="text-[16px] mt-5">Personal Information</h4>
            <div className="grid grid-cols-1 gap-2 mt-2 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className=" text-[#7D7D7D] w-30 text-sm"> Phone Number</p>
                <p className="text-[#131313] font-medium">
                  {account.phoneNumber}
                </p>
              </div>

              <div>
                <p className=" text-[#7D7D7D] w-30 text-sm"> Email</p>
                <p className="text-[#131313] font-medium">{account.email}</p>
              </div>
              <div>
                <p className=" text-[#7D7D7D] w-30 text-sm">Position</p>
                <p className="text-[#131313] font-medium">{account.position}</p>
              </div>
              <div>
                <p className=" text-[#7D7D7D] w-30 text-sm">Division</p>
                <p className="text-[#131313] font-medium">{account.division}</p>
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
                  className="rounded-md w-full h-[40px] pr-15 px-3 py-2 text-sm outline-none border-[#0755E9] border-[0.5px]"
                />

                <span
                  className="absolute right-4 top-2.5 cursor-pointer text-[#7D7D7D]"
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
                className="px-4 py-2 h-10 md:w-[200px] w-full flex justify-center items-center  cursor-pointer rounded-md bg-[#0755E9] text-white"
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
          </div>{" "}
          {/*

          <div className="mt-6 bg-white border border-[#8FB1FF] rounded-xl p-5">
            <h4 className="text-[16px]">Salary Structure</h4>

            <div className="grid grid-cols-1 gap-2 mt-2 md:gap-6 md:grid-cols-3">
              <div>
                <p className="text-[#7D7D7D] text-sm">Basic Salary</p>
                <p className="text-[#131313] font-medium">
                  {account.salaryStructure.basic}
                </p>
              </div>

              <div>
                <p className="text-[#7D7D7D] text-sm">Fuel Allowance</p>
                <p className="text-[#131313] font-medium">
                  {account.salaryStructure.incentive.flue}
                </p>
              </div>

              <div>
                <p className="text-[#7D7D7D] text-sm">Medical Allowance</p>
                <p className="text-[#131313] font-medium">
                  {account.salaryStructure.incentive.medical}
                </p>
              </div>
            </div>

            <h4 className="text-[16px] mt-5 mb-2">Deductions</h4>

            <div className="grid grid-cols-1 gap-6 mt-2 md:grid-cols-3">
              <div>
                <p className="text-[#7D7D7D] text-sm">Loan</p>
                <p className="text-[#131313] font-medium">{account.loanPF.loan}</p>
              </div>

              <div>
                <p className="text-[#7D7D7D] text-sm">Tax</p>
                <p className="text-[#131313] font-medium">
                  {account.salaryStructure.tax}
                </p>
              </div>

              <div>
                <p className="text-[#7D7D7D] text-sm">Provident Fund</p>
                <p className="text-[#131313] font-medium">{account.loanPF.pf}</p>
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
          </div> */}
        </div>
      </div>
    </>
  );
}
