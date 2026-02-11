import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  deleteRequisition,
  getAllRequisition,
  getSingleRequisition,
  updateRequisition,
  updateStatusRequisition,
} from "../../api/requisitionServices";
import { notifyError, notifySuccess } from "../../Components/Toast";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import CustomInput from "../../Components/CustomInput";
import { IoMdCloseCircle } from "react-icons/io";
import CustomSelect from "../../Components/Select";
import { Icon } from "@iconify/react";

interface Product {
  _id: string;
  name: string;
  quantity: number;
  duration: string;
  amount: number;
}

interface Requisition {
  _id: string;
  reqId: string;
  mrName: string;
  doctorName: string;
  status: string;
  attachedDoc?: string;
  details?: string;
  product: Product[];
  startingDate: string;
  quantity: number;
  duration: string;
  amount: number;
  paymentType: string;
  accepted: boolean;
  remarks?: string;
  requisitionType: "cash" | "other" | "house" | "car" | "tour";
  totalQuantity: number;
}

const requisitionTypeOptions: Requisition["requisitionType"][] = [
  "cash",
  "other",
  "house",
  "car",
  "tour",
];

export default function RequisitionDetail() {
  const [loadingAccept, setLoadingAccept] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const location = useLocation();
  const requisition = location.state?.requisition;
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [changeRequisition, setChangeRequisition] = useState(false);
  const [isloadingDelete, setLoadingDelete] = useState(false);
  const { user } = useSelector((state: any) => state.user);
  const [dataRequisitions, setRequisitionsingle] = useState<Requisition | null>(
    null,
  );
  const [requisitionType, setRequisitionType] = useState<
    Requisition["requisitionType"]
  >(dataRequisitions?.requisitionType || "cash");
  const [remarks, setRemarks] = useState(dataRequisitions?.remarks || "");
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const navigate = useNavigate();
  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 24, color: "white" }} spin />
  );
  const antIcon2 = (
    <Loading3QuartersOutlined style={{ fontSize: 50, color: "#0755E9" }} spin />
  );
  const handleGetSingle = async (id?: string) => {
    try {
      const res = await getSingleRequisition(id || requisition._id);
      setRequisitionsingle(res.data?.requisition || res);
      setRequisitionType(res.data?.requisition?.requisitionType || "cash");
    } catch (error: any) {
      console.error("Error fetching requisition:", error);
      alert(error?.response?.data?.error || "Failed to fetch requisition");
    }
  };

  const { refetch } = useQuery({
    queryKey: ["AllRequisition"],
    queryFn: () => getAllRequisition(),
    staleTime: 5 * 60 * 1000,
  });

  const handleBack = () => navigate("/requisitionsList");

  const handleAccept = async (id: string) => {
    try {
      setLoadingAccept(true);
      await updateStatusRequisition(id, { status: "accepted" });
      notifySuccess("Requisition accepted!");
      await handleGetSingle(id);
    } catch (error: any) {
      notifyError(error?.response?.data?.message || "Failed to accept");
    } finally {
      setLoadingAccept(false);
      refetch();
    }
  };
  const handleReject = async (id: string) => {
    try {
      setLoadingReject(true);
      await updateStatusRequisition(id, { status: "rejected" });
      notifySuccess("Requisition rejected!");
      await handleGetSingle(id);
    } catch (error: any) {
      notifyError(error?.response?.data?.message || "Failed to reject");
    } finally {
      setLoadingReject(false);
      refetch();
    }
  };

  const handleDelete = async (e: React.FormEvent) => {
    setLoadingDelete(true);
    e.preventDefault();
    try {
      await deleteRequisition(requisition._id);
      notifySuccess("Requisition deleted successfully!");
    } catch (error: any) {
      notifyError(error?.response?.data?.error || "Something went wrong");
    } finally {
      setLoadingDelete(false);
      refetch();
      setDeleteConfirmation(false);
      navigate("/requisitionsList");
    }
  };

  const handleSaveRemarks = async () => {
    if (!remarks.trim()) return notifyError("Please enter remarks first!");

    try {
      setLoadingSave(true);
      await updateRequisition(requisition._id, { remarks });
      notifySuccess("Remarks updated successfully!");
      await handleGetSingle(requisition._id);
    } catch (error: any) {
      notifyError(error?.response?.data?.error || "Failed to update remarks");
    } finally {
      setLoadingSave(false);
      refetch();
    }
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct || !dataRequisitions) return;

    try {
      setLoadingUpdate(true);

      const updatedProducts = dataRequisitions.product.map((p) =>
        p._id === selectedProduct._id
          ? {
              ...selectedProduct,
              amount: requisitionType === "cash" ? selectedProduct.amount : 0,
              duration: selectedProduct.duration || "",
            }
          : { ...p, amount: requisitionType === "cash" ? p.amount : 0 },
      );

      const updatedRequisition: Requisition = {
        ...dataRequisitions,
        product: updatedProducts,
        requisitionType,
        amount: requisitionType === "cash" ? dataRequisitions.amount : 0,
      };

      setRequisitionsingle(updatedRequisition);

      const payload: Partial<Requisition> = {
        product: updatedProducts,
        requisitionType,
        amount: updatedRequisition.amount,
      };

      await updateRequisition(dataRequisitions._id, payload);
      notifySuccess("Requisition updated successfully!");
      await handleGetSingle(dataRequisitions._id);
      setChangeRequisition(false);
    } catch (error: any) {
      notifyError(
        error?.response?.data?.error || "Failed to update requisition",
      );
    } finally {
      setLoadingUpdate(false);
    }
  };

  useEffect(() => {
    document.title = "MediRep | Requisition Details";
    if (requisition?._id) handleGetSingle(requisition._id);
  }, [requisition]);

  return (
    <>
      <div className="bg-secondary lg:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div
            onClick={handleBack}
            className="h-10  min-w-10 cursor-pointer rounded-lg border border-[#D2D2D2] flex justify-center items-center bg-white"
          >
            <Icon
              icon="material-symbols:arrow-back-rounded"
              className="text-xl text-heading"
            />
          </div>
          <p className="text-heading font-medium text-[22px] sm:text-[24px]">
            Requisition Details
          </p>
        </div>
        <div className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(77.2vh-0px)] xl:h-[calc(66vh-0px)] h-auto">
          <p className="text-[#7d7d7d]">Requisition Details</p>

          <div
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="scroll-smooth mt-5  bg-white border border-primary rounded-lg 2xl:h-[calc(69.3vh-0px)] xl:h-[calc(54vh-0px)] overflow-y-auto scrollbar-none"
          >
            {dataRequisitions ? (
              <div className="flex flex-wrap md:gap-0 gap-5">
                <div className="xl:w-[calc(70%-1px)] w-full">
                  <div className="flex flex-wrap gap-5  p-5 border-b-[1px] border-primary">
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
                          className={`inline-block mt-3 rounded-sm capitalize px-2  font-normal text-sm border ${
                            dataRequisitions?.status?.toLowerCase() ===
                            "pending"
                              ? "text-[#E90761] border-[#E90761]"
                              : dataRequisitions?.status?.toLowerCase() ===
                                  "accepted"
                                ? "text-primary border-primary"
                                : dataRequisitions?.status?.toLowerCase() ===
                                    "rejected"
                                  ? "text-[#FF9500] border-[#FF9500]"
                                  : dataRequisitions?.status === "Paid"
                                    ? "text-[#0BA69C] border-[#0BA69C]"
                                    : "text-[#7d7d7d] border-[#7d7d7d]"
                          }`}
                        >
                          {dataRequisitions?.status}
                        </p>
                        <p
                          className="text-primary cursor-pointer text-sm mt-3 underline"
                          onClick={() => {
                            if (dataRequisitions?.attachedDoc) {
                              window.open(
                                dataRequisitions.attachedDoc,
                                "_blank",
                              );
                            }
                          }}
                        >
                          View File
                        </p>
                      </div>
                    </div>{" "}
                    <div className="xl:w-[calc(50%-10px)] w-full flex gap-5">
                      {" "}
                      <div className="xl:w-[calc(50%-10px)] w-full">
                        <p className="text-[#131313] font-medium text-sm">
                          Details
                        </p>
                        <p className="text-[#131313] mt-3 font-medium text-sm">
                          Starting Date
                        </p>
                        <p className="text-[#131313] mt-3 font-medium text-sm">
                          Requisition Type
                        </p>{" "}
                        <p className="text-[#131313] mt-3 font-medium text-sm">
                          Total Quantity
                        </p>{" "}
                        {(dataRequisitions?.amount ?? 0) > 0 && (
                          <p className="text-[#131313] mt-3 font-medium text-sm">
                            Amount
                          </p>
                        )}
                      </div>
                      <div className="xl:w-[calc(50%-10px)] w-full">
                        <p className="text-[#131313]  font-normal text-sm">
                          {dataRequisitions?.details}
                        </p>
                        <p className="text-[#131313] mt-3 font-normal text-sm">
                          {dataRequisitions?.startingDate
                            ? dayjs(dataRequisitions.startingDate).format(
                                "DD-MM-YYYY",
                              )
                            : "-"}
                        </p>
                        <p className="text-[#131313] capitalize mt-3 font-normal text-sm">
                          {dataRequisitions?.requisitionType}
                        </p>
                        <p className="text-[#131313] mt-3 font-normal text-sm">
                          {dataRequisitions?.totalQuantity}
                        </p>
                        {(dataRequisitions?.amount ?? 0) > 0 && (
                          <p className="text-[#131313] mt-3 font-normal text-sm">
                            {dataRequisitions?.amount}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="py-5 border-b-[1px] border-primary  p-5">
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
                    {["Admin", "Area Sales Manager (ASM)"].includes(
                      user?.position || "",
                    ) && (
                      <>
                        <textarea
                          className="rounded-lg bg-[#F7F7F7] p-3 mt-5 w-full focus:outline-none"
                          placeholder="Enter your remarks..."
                          value={dataRequisitions?.remarks || remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          disabled={!!dataRequisitions?.remarks}
                        />
                        {dataRequisitions?.remarks ? (
                          ""
                        ) : (
                          <div className="flex justify-end">
                            <button
                              className="bg-primary mt-5 h-[56px] w-[100px] cursor-pointer rounded-md text-white"
                              onClick={handleSaveRemarks}
                              disabled={!!dataRequisitions?.remarks}
                            >
                              {loadingSave ? (
                                <Spin indicator={antIcon} />
                              ) : (
                                "Save"
                              )}
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  {["Admin", "Area Sales Manager (ASM)"].includes(
                    user?.position || "",
                  ) && (
                    <div className=" p-5">
                      <p className="text-[#131313] mt-3 font-medium text-sm">
                        Accept Requisition
                      </p>
                      <div className="flex flex-wrap md:flex-nowrap gap-3 justify-between items-center pb-5 mt-5">
                        <button
                          onClick={() => {
                            setDeleteConfirmation(true);
                          }}
                          className="bg-[#F2FAFD] h-[56px] w-full md:w-[100px] cursor-pointer rounded-md text-black"
                        >
                          Delete
                        </button>
                        <div className="flex flex-wrap md:flex-nowrap gap-3 w-full md:w-auto items-center">
                          <button
                            onClick={() =>
                              dataRequisitions?._id &&
                              handleReject(dataRequisitions._id)
                            }
                            disabled={
                              dataRequisitions?.status === "accepted" ||
                              dataRequisitions?.status === "rejected"
                            }
                            className={`h-[56px] w-full md:w-[100px] rounded-md text-white  
      ${
        dataRequisitions?.status === "rejected" || "accepted"
          ? "bg-red-400 cursor-not-allowed"
          : "bg-red-600 hover:bg-red-700 cursor-pointer"
      }`}
                          >
                            {loadingReject ? (
                              <Spin indicator={antIcon} />
                            ) : (
                              <span>
                                {dataRequisitions?.status === "rejected"
                                  ? "Rejected"
                                  : "Reject"}
                              </span>
                            )}
                          </button>
                          <button
                            onClick={() =>
                              dataRequisitions?._id &&
                              handleAccept(dataRequisitions._id)
                            }
                            disabled={
                              dataRequisitions?.status === "accepted" ||
                              dataRequisitions?.status === "rejected"
                            }
                            className={`h-[56px] w-full md:w-[100px] rounded-md text-white  
      ${
        dataRequisitions?.status === "rejected" || "accepted"
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-primary hover:bg-primary cursor-pointer"
      }`}
                          >
                            {loadingAccept ? (
                              <Spin indicator={antIcon} />
                            ) : (
                              <span>
                                {dataRequisitions?.status === "accepted"
                                  ? "Accepted"
                                  : "Accept"}
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>{" "}
                <div className="border-primary border-l-[1px] h-auto"></div>
                <div className="xl:w-[calc(30%-1px)] w-full p-5">
                  {dataRequisitions?.product?.map((p) => (
                    <div
                      key={p._id}
                      className="bg-[#E5EBF7] rounded-[8px] w-full first:mt-0 mt-3 p-4"
                    >
                      <div className="flex items-center gap-4 ">
                        <p className="text-heading w-[90px] text-xs font-medium">
                          Product
                        </p>
                        <p className="text-heading text-xs font-normal">
                          {p?.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <p className="text-heading w-[90px] text-xs font-medium">
                          Quantity
                        </p>
                        <p className="text-heading text-xs font-normal">
                          {p?.quantity}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedProduct(p);
                          setChangeRequisition(true);
                        }}
                        className="mt-5 bg-primary text-white w-full h-9 rounded-md cursor-pointer"
                      >
                        Change Requisition
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex justify-center h-full">
                <Spin indicator={antIcon2} className="my-6 h-[64vh]" />
              </div>
            )}
          </div>
        </div>
        {deleteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl xl:mx-0 mx-5 w-[500px] h-auto overflow-x-auto shadow-xl relative">
              <div className="bg-[#E90761]/10 p-4">
                <p className="text-base text-[#131313]">Delete Requisition</p>
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
                  Are you sure to delete this requisition?
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

        {changeRequisition && selectedProduct && dataRequisitions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white  rounded-lg w-[450px] shadow-lg">
              <div className="flex p-4 rounded-t-lg bg-[#E5EBF7] items-center justify-between">
                <p className="text-[16px] leading-[100%] text-heading font-medium">
                  Update Requisition
                </p>
              </div>
              <div className="p-4">
                <CustomSelect
                  placeholder="Requisition Type"
                  value={requisitionType}
                  options={requisitionTypeOptions}
                  onChange={(value) =>
                    setRequisitionType(
                      value as "cash" | "other" | "house" | "car" | "tour",
                    )
                  }
                />

                {requisitionType === "cash" && (
                  <CustomInput
                    label="Amount"
                    type="number"
                    className="mt-4"
                    value={dataRequisitions.amount || 0}
                    onChange={(e) =>
                      setRequisitionsingle({
                        ...dataRequisitions,
                        amount: Number(e.target.value),
                      })
                    }
                  />
                )}

                <CustomInput
                  label="Quantity"
                  type="number"
                  className="mt-4"
                  value={selectedProduct.quantity}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      quantity: Number(e.target.value),
                    })
                  }
                />

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    className="h-[48px] px-6 bg-[#F2FAFD] text-[#131313] rounded-[6px] cursor-pointer"
                    onClick={() => setChangeRequisition(false)}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateProduct}
                    className="bg-primary text-white px-7 py-3 rounded"
                  >
                    {loadingUpdate ? <Spin indicator={antIcon} /> : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
