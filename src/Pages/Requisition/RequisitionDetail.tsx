import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import CustomInput from "../../Components/CustomInput";
import CustomSelect from "../../Components/Select";
import dayjs from "dayjs";
import {
  acceptRequisition,
  deleteRequisition,
  getAllRequisition,
  getSingleRequisition,
  updateRequisition,
} from "../../api/requisitionServices";
import { notifyError, notifySuccess } from "../../Components/Toast";
import { Spin } from "antd";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { RiAlertFill } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../Context/AuthContext";

interface Requisition {
  _id: string;
  reqId: string;
  mrName: string;
  doctorName: string;
  status: string;
  attachedDoc?: string;
  details?: string;
  product: string;
  startingDate: string;
  quantity: number;
  duration: string;
  amount: number;
  paymentType: string;
  accepted: boolean;
  remarks?: string;
}

const statusOption = ["Pending", "Approved", "Paid", "Rejected"];
const timeOption = [
  "01-Month",
  "02-Month",
  "03-Month",
  "04-Month",
  "05-Month",
  "06-Month",
  "07-Month",
];
const paymentOption = ["Online", "Cheque", "Cash", "Part-payment"];

export default function RequisitionDetail() {
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const [dataRequisitions, setRequisitionsingle] = useState<Requisition | null>(
    null
  );
  const [remarks, setRemarks] = useState(dataRequisitions?.remarks || "");

  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const location = useLocation();
  const requisition = location.state?.requisition;

  const handleGetSingle = async (id?: string) => {
    try {
      setLoading(true);

      const res = await getSingleRequisition(id || requisition._id);

      setRequisitionsingle(res.data || res);
    } catch (error: any) {
      console.error("Error fetching requisition:", error);
      alert(error?.response?.data?.error || "Failed to fetch requisition");
    } finally {
      setLoading(false);
    }
  };

  const { refetch } = useQuery({
    queryKey: ["AllRequisition"],
    queryFn: () => getAllRequisition(),
    staleTime: 5 * 60 * 1000,
  });
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/requisition");
  };

  const [formData, setFormData] = useState({
    status: "",
    quantity: 0,
    amount: 0,
    duration: "",
    paymentType: "",
  });
  useEffect(() => {
    if (dataRequisitions) {
      setFormData({
        status: dataRequisitions.status,
        quantity: dataRequisitions.quantity,
        amount: dataRequisitions.amount,
        duration: dataRequisitions.duration,
        paymentType: dataRequisitions.paymentType,
      });
    }
  }, [dataRequisitions]);
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await updateRequisition(requisition._id, formData);
      console.log("Updated Requisition:", res);
      notifySuccess("Requisition updated successfully!");
    } catch (error: any) {
      console.error("Error updating requisition:", error);
      notifyError(error?.response?.data?.error || "Something went wrong");
    } finally {
      console.log("Update request finished");
      setLoading(false);
      handleGetSingle(requisition._id);
    }
  };
  const handleAccept = async (id: string) => {
    try {
      setLoading(true);
      const res = await acceptRequisition(id);
      console.log("Accepted:", res.data);
      notifySuccess("Requisition accepted!");
      handleGetSingle(id);
    } catch (error: any) {
      console.error("Error accepting requisition:", error);
      notifyError(
        error?.response?.data?.error || "Failed to accept requisition"
      );
    } finally {
      setLoading(false);
      refetch();
    }
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await deleteRequisition(requisition._id);
      console.log("Updated Requisition:", res);
      notifySuccess("Requisition delete successfully!");
    } catch (error: any) {
      console.error("Error delete requisition:", error);
      notifyError(error?.response?.data?.error || "Something went wrong");
    } finally {
      console.log("Update request finished");
      setLoading(false);
      refetch();
      setDeleteConfirmation(false);
      navigate("/requisition");
    }
  };
  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 24, color: "white" }} spin />
  );
  useEffect(() => {
    document.title = "MediRep | Requisition Details";
    const fetchRequisition = async () => {
      if (requisition?._id) {
        await handleGetSingle(requisition._id);
      }
    };
    fetchRequisition();
  }, [requisition]);
  const { admin } = useAuth();

  const handleSaveRemarks = async () => {
    if (!remarks.trim()) return notifyError("Please enter remarks first!");

    try {
      setLoadingSave(true);
      await updateRequisition(requisition._id, { remarks });
      notifySuccess("Remarks updated successfully!");
    } catch (error: any) {
      console.error("Error updating remarks:", error);
      notifyError(error?.response?.data?.error || "Failed to update remarks");
    } finally {
      setLoadingSave(false);
      refetch();
    }
  };

  return (
    <>
      <div className="bg-secondary lg:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap items-center gap-4 ">
          <div
            onClick={handleBack}
            className="w-10 h-10 border-[#7d7d7d] border-[1px] rounded-lg cursor-pointer flex justify-center items-center"
          >
            <FaArrowLeft size={16} color="#000000" />
          </div>
          <p className="text-heading font-medium text-[22px] sm:text-[24px]">
            Requisition Details
          </p>
        </div>
        <div className="bg-[#E5EBF7]  mt-4 rounded-[12px] p-4 2xl:h-[calc(90vh-123px)] lg:h-[calc(90vh-149px)] h-auto ">
          <p className="text-[#7d7d7d]">Requisition Details</p>
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="scroll-smooth mt-5 flex flex-wrap gap-5  bg-white border border-primary rounded-lg 2xl:h-[calc(80vh-105px)] xl:h-[calc(63vh-60px)] overflow-y-auto scrollbar-none"
          >
            <div className="xl:w-[calc(70%-21px)] w-full p-5">
              <div className="flex flex-wrap gap-5 pb-5 border-b-[1px] border-primary">
                <div className="xl:w-[calc(50%-10px)] w-full flex gap-5">
                  {" "}
                  <div className="xl:w-[calc(50%-10px)] w-full">
                    <p className="text-[#131313] font-medium text-sm">
                      Requisition ID
                    </p>
                    <p className="text-[#131313] mt-3 font-medium text-sm">
                      MR Name
                    </p>
                    <p className="text-[#131313] mt-3 font-medium text-sm">
                      Doctor Name
                    </p>
                    <p className="text-[#131313] mt-3 font-medium text-sm">
                      Status
                    </p>
                    <p className="text-[#131313] mt-3 font-medium text-sm">
                      Attachments
                    </p>
                    <p className="text-[#131313] mt-3 font-medium text-sm">
                      Details
                    </p>
                  </div>
                  <div className="xl:w-[calc(50%-10px)] w-full">
                    {" "}
                    <p className="text-[#131313] font-normal text-sm">
                      {dataRequisitions?.reqId}
                    </p>
                    <p className="text-[#131313] mt-3 font-normal text-sm">
                      {dataRequisitions?.mrName}
                    </p>
                    <p className="text-[#131313] mt-3 font-normal text-sm">
                      {dataRequisitions?.doctorName}
                    </p>
                    <p
                      className={`inline-block rounded-[3px] px-2 mt-3 font-normal text-sm border ${
                        dataRequisitions?.status === "Pending"
                          ? "text-[#E90761] border-[#E90761]"
                          : dataRequisitions?.status === "Approved"
                          ? "text-primary border-primary"
                          : dataRequisitions?.status === "Rejected"
                          ? "text-[#FF9500] border-[#FF9500]"
                          : dataRequisitions?.status === "Paid"
                          ? "text-[#0BA69C] border-[#0BA69C]"
                          : "text-gray-500 border-gray-500"
                      }`}
                    >
                      {dataRequisitions?.status}
                    </p>
                    <p className="text-primary mt-3 font-normal text-sm">
                      {dataRequisitions?.attachedDoc}
                    </p>
                    <p className="text-[#131313] mt-3 font-normal text-sm">
                      {dataRequisitions?.details}
                    </p>
                  </div>
                </div>
                <div className="xl:w-[calc(50%-10px)] w-full flex gap-5">
                  {" "}
                  <div className="w-[calc(50%-10px)]">
                    <p className="text-[#131313] font-medium text-sm">
                      Product
                    </p>
                    <p className="text-[#131313] mt-3 font-medium text-sm">
                      Starting Date
                    </p>
                    <p className="text-[#131313] mt-3 font-medium text-sm">
                      Quantity
                    </p>
                    <p className="text-[#131313] mt-3 font-medium text-sm">
                      Duration
                    </p>
                    <p className="text-[#131313] mt-3 font-medium text-sm">
                      Amount
                    </p>{" "}
                    <p className="text-[#131313] mt-3 font-medium text-sm">
                      Payment Type
                    </p>
                  </div>
                  <div className="w-[calc(50%-10px)]">
                    {" "}
                    <p className="text-[#131313] font-normal text-sm">
                      {dataRequisitions?.product}
                    </p>
                    <p className="text-[#131313] mt-3 font-normal text-sm">
                      {dataRequisitions?.startingDate
                        ? dayjs(dataRequisitions.startingDate).format(
                            "DD-MM-YYYY"
                          )
                        : "-"}
                    </p>{" "}
                    <p className="text-[#131313] mt-3 font-normal text-sm">
                      {dataRequisitions?.quantity}
                    </p>
                    <p className="text-[#131313] mt-3 font-normal text-sm">
                      {dataRequisitions?.duration}
                    </p>
                    <p className="text-[#131313] mt-3 font-normal text-sm">
                      {dataRequisitions?.amount}
                    </p>
                    <p className="text-[#131313] mt-3  131313 font-normal text-sm">
                      {dataRequisitions?.paymentType}
                    </p>
                  </div>
                </div>
              </div>
              <div className="py-5 border-b-[1px] border-primary">
                <p className="text-[#131313] mt-3 font-medium text-sm">
                  Manager Remarks
                </p>
                {dataRequisitions?.remarks ? (
                  <div>
                    <div className="flex items-center gap-3 mt-4">
                      <FaCheckCircle size={16} color="#27C840" />
                      <p className="text-[#131313] font-medium text-xs">
                        Manager approved requisition
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#7D7D7D] mt-2">
                    No remarks added by Manager
                  </p>
                )}
                {["Admin", "manager"].includes(admin?.position || "") && (
                  <>
                    <textarea
                      className="rounded-lg bg-[#F7F7F7] p-3 mt-5 w-full focus:outline-none"
                      placeholder="Enter your remarks..."
                      value={dataRequisitions?.remarks || remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      disabled={!!dataRequisitions?.remarks}
                    />

                    <div className="flex justify-end">
                      <button
                        className="bg-primary mt-5 h-[56px] w-[100px] cursor-pointer rounded-md text-white"
                        onClick={handleSaveRemarks}
                        disabled={!!dataRequisitions?.remarks} // optional: disable button if remarks exist
                      >
                        {loadingSave ? "Loading" : "Save"}
                      </button>
                    </div>
                  </>
                )}
              </div>
              {["Admin", "manager"].includes(admin?.position || "") && (
                <div>
                  <p className="text-[#131313] mt-3 font-medium text-sm">
                    Accept Requisition
                  </p>
                  <div className="flex justify-between items-center pb-5 mt-5">
                    <button
                      onClick={() => {
                        setDeleteConfirmation(true);
                      }}
                      className="bg-[#F2FAFD] h-[56px] w-[100px] cursor-pointer rounded-md text-black"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleAccept(requisition._id)}
                      disabled={requisition.accepted}
                      className={`h-[56px] w-[100px] rounded-md text-white cursor-pointer ${
                        requisition.accepted
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-primary hover:bg-primary"
                      }`}
                    >
                      {requisition.accepted ? "Accepted" : "Accept"}
                    </button>
                  </div>
                </div>
              )}
            </div>{" "}
            <div className="border-primary border-l-[1px] h-full"></div>
            <div className="xl:w-[calc(30%-21px)] w-full p-5">
              <p>Change Requisition</p>
              <form onSubmit={handleSubmit}>
                <div className="mt-3">
                  <CustomSelect
                    options={statusOption}
                    placeholder="Change Status"
                    value={formData.status}
                    onChange={(val) => handleChange("status", val)}
                  />
                </div>
                <div className="mt-3">
                  <CustomInput
                    label="Quantity"
                    value={formData.quantity}
                    onChange={(e) =>
                      handleChange("quantity", Number(e.target.value))
                    }
                  />
                </div>
                <div className="mt-3">
                  <CustomInput
                    label="Amount"
                    value={formData.amount}
                    onChange={(e) =>
                      handleChange("amount", Number(e.target.value))
                    }
                  />
                </div>
                <div className="mt-3">
                  <CustomSelect
                    placeholder="Duration"
                    options={timeOption}
                    value={formData.duration}
                    onChange={(val) => handleChange("duration", val)}
                  />
                </div>
                <div className="mt-3">
                  <CustomSelect
                    placeholder="Payment Type"
                    options={paymentOption}
                    value={formData.paymentType}
                    onChange={(val) => handleChange("paymentType", val)}
                  />
                </div>

                <button type="submit" className="mt-4 btn btn-primary">
                  Update Requisition
                </button>
              </form>
              <div className="mt-5 flex justify-end">
                <button
                  onClick={handleSubmit}
                  className="bg-primary h-[56px] w-[130px] cursor-pointer rounded-md text-white"
                >
                  {loading ? <Spin indicator={antIcon} /> : " Re-submit"}
                </button>
              </div>
            </div>{" "}
          </div>
        </div>
        {deleteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl xl:mx-0 mx-5 w-[500px] xl:h-auto h-[90vh] overflow-x-auto xl:p-6 p-4 shadow-xl relative">
              <RiAlertFill className="text-[120px] text-yellow-500 text-center mx-auto mb-2" />
              <div className="text-center">
                <h2 className="text-xl font-semibold text-primary mt-5">
                  Confirm Delete
                </h2>
                <p className="mb-6">
                  Are you sure you want to delete this{" "}
                  <strong>Requisition</strong>
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
      </div>
    </>
  );
}
