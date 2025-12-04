import { useState, useEffect } from "react";
import { MdAdd } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import { FaCircleCheck } from "react-icons/fa6";
import { LuSearch } from "react-icons/lu";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllProducts, updateProducts } from "../../api/productServices";
import TargetsUploadFile from "../../Components/TargetUploads";
import { notifyError, notifySuccess } from "../../Components/Toast";
import { FaCheckCircle } from "react-icons/fa";
import Pagination from "../../Components/Pagination";

interface EditData {
  _id?: string;
  target?: number;
  [key: string]: any;
}

export default function Targets() {
  const [openModal, setOpenModal] = useState(false);
  const [notifiedModel, setNotifiedModel] = useState(false);
  const [SkuNo, setSkuNo] = useState("");
  const [productName, setProductName] = useState("");
  const [debouncedSku, setDebouncedSku] = useState("");
  const [debouncedProductName, setDebouncedProductName] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<EditData>({});
  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = "MediRep | Targets & Achievements";
  }, []);

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["AllProducts", debouncedSku, debouncedProductName],
    queryFn: () => getAllProducts(debouncedSku, debouncedProductName),
    staleTime: 5 * 60 * 1000,
  });

  const ProductData = data?.data?.data || [];

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSku(SkuNo);
      setDebouncedProductName(productName);
    }, 500);
    return () => clearTimeout(timer);
  }, [SkuNo, productName]);

  const handleEdit = async (editData: EditData) => {
    if (!editData._id) return;

    try {
      await updateProducts(editData._id, { target: editData.target });
      notifySuccess("Target updated successfully!");
      queryClient.setQueryData(
        ["AllProducts", debouncedSku, debouncedProductName],
        (oldData: any) => {
          const products = oldData?.data?.data || [];
          const updatedProducts = products.map((item: any) =>
            item._id === editData._id
              ? { ...item, target: editData.target }
              : item
          );

          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: updatedProducts,
            },
          };
        }
      );

      setNotifiedModel(true);
      setTimeout(() => setNotifiedModel(false), 5000);
    } catch (error) {
      console.error("❌ Update error:", error);
      notifyError("Failed to update target.");
    } finally {
      setEditIndex(null);
      setEditData({});
      refetch();
    }
  };

  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 50, color: "#0755E9" }} spin />
  );

  return (
    <div>
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap gap-4 items-start justify-between">
          <p className="text-heading font-medium text-[22px] sm:text-[24px]">
            Targets
          </p>
          <button
            onClick={() => setOpenModal(true)}
            className="h-[55px] w-full md:w-[180px] bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
          >
            <MdAdd size={20} color="#fff" />
            <p className="text-white text-base font-medium">Upload Target</p>
          </button>
        </div>

        <div className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(76vh-0px)] xl:h-[calc(90vh-160px)] h-auto">
          <div className="flex justify-between items-center">
            <p className="text-[#7D7D7D] font-medium text-sm">
              Targets as List
            </p>
            <Pagination
              currentPage={data?.data?.pagination?.currentPage}
              totalItems={data?.data?.pagination?.totalItems}
              itemsPerPage={data?.data?.pagination?.itemsPerPage}
            />
          </div>
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(68.5vh-0px)] xl:h-[calc(65vh-53px)] mt-4 overflow-y-auto scrollbar-none"
          >
            <div className="w-full flex-1 overflow-x-auto">
              <table className="w-full border-collapse min-w-[900px]">
                <thead className="sticky top-0 z-[1] bg-white">
                  <tr className="border-b border-primary text-left text-[13px] font-semibold text-heading">
                    <th className="px-4 py-3 w-[16%]">
                      <div className="relative flex items-center">
                        <LuSearch
                          className="absolute left-2 text-[#7d7d7d]"
                          size={14}
                        />
                        <div className="absolute left-7 flex items-center h-full pr-2 border-r border-gray-400 text-xs font-medium text-heading">
                          SKU
                        </div>
                        <input
                          value={SkuNo}
                          onChange={(e) => setSkuNo(e.target.value)}
                          type="text"
                          className="h-8 pl-[66px] pr-3 w-full border font-normal border-gray-400 rounded-md text-xs text-heading focus:outline-none"
                        />
                      </div>
                    </th>
                    <th className="px-4 py-3 2xl:w-[18%] w-[25%]">
                      <div className="relative flex items-center">
                        <LuSearch
                          className="absolute left-2 text-[#7d7d7d]"
                          size={14}
                        />
                        <div className="absolute left-7 top-0 h-full flex items-center border-r border-gray-400 pr-2">
                          <p className="text-heading text-xs font-medium">
                            Product Name
                          </p>
                        </div>
                        <input
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          type="text"
                          className="h-8 pl-[120px] pr-3 w-full border border-gray-400 rounded-md text-sm text-heading font-normal focus:outline-none"
                        />
                      </div>
                    </th>
                    <th className="px-4 font-medium py-3 text-[12px] w-[10%]">
                      Form
                    </th>
                    <th className="px-4 font-medium py-3 text-[12px] w-[14%]">
                      Status
                    </th>
                    <th className="px-4 font-medium py-3 text-[12px] w-[18%]">
                      Target
                    </th>
                    <th className="px-4 font-medium py-3 text-[12px] w-[14%]">
                      Achievement
                    </th>
                    <th className="px-4 font-medium py-3 text-[12px] w-[10%]">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {isFetching ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-5 text-center text-[#7d7d7d]"
                      >
                        <Spin indicator={antIcon} />
                      </td>
                    </tr>
                  ) : ProductData.length > 0 ? (
                    ProductData.map((row: any, rowIndex: number) => (
                      <tr
                        key={rowIndex}
                        className="hover:bg-[#E5EBF7] h-[56px] hover:text-black cursor-pointer"
                      >
                        <td className="px-5 py-2 border-b-[0.5px] border-primary text-[13px] font-normal text-heading break-words">
                          {row.sku}
                        </td>
                        <td className="px-5 py-2 border-b-[0.5px] border-primary text-[13px] font-normal text-heading break-words">
                          {row.productName}
                        </td>
                        <td className="px-5 py-2 border-b-[0.5px] border-primary text-[13px] font-normal text-heading break-words">
                          {row.isfrom}
                        </td>
                        <td className="px-5 py-2 border-b-[0.5px] border-primary text-[13px] font-normal text-heading break-words">
                          {row.isStatus}
                        </td>
                        <td className="px-5 py-2 w-[90px] border-b-[0.5px] border-primary text-[13px] font-normal text-heading break-words">
                          {editIndex === rowIndex ? (
                            <input
                              type="number"
                              value={editData.target ?? row.target}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  _id: row._id,
                                  target: Number(e.target.value),
                                })
                              }
                              className="border border-gray-400 rounded-md px-2 py-1 w-[90px] text-sm text-heading focus:outline-none"
                            />
                          ) : (
                            <span>{row.target}</span>
                          )}
                        </td>
                        <td className="px-5 py-2 border-b-[0.5px] border-primary text-[13px] font-normal text-heading break-words">
                          {row.achievement}
                        </td>
                        <td className="px-5 py-2 border-b-[0.5px] border-primary text-[13px] font-normal text-heading break-words">
                          <div className="flex gap-5 items-center">
                            <TbEdit
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditIndex(
                                  editIndex === rowIndex ? null : rowIndex
                                );
                                setEditData({
                                  _id: row._id,
                                  target: row.target,
                                });
                              }}
                              size={18}
                              className={`cursor-pointer ${
                                editIndex === rowIndex
                                  ? "text-primary"
                                  : "text-[#7d7d7d]"
                              }`}
                            />
                            <FaCheckCircle
                              size={18}
                              onClick={(e: any) => {
                                e.stopPropagation();
                                handleEdit(editData);
                              }}
                              className="cursor-pointer text-primary"
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-3 py-6 text-center text-heading"
                      >
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {notifiedModel && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl xl:mx-0 mx-5 w-[400px] max-h-[90vh] overflow-x-auto xl:p-6 p-4 shadow-xl relative">
            <div className="h-[120px] w-[120px] bg-[#0755E91F] mx-auto mb-3 rounded-full flex justify-center items-center">
              <FaCircleCheck size={90} className="text-primary" />
            </div>
            <p className="text-center text-base font-bold text-heading">
              Uploaded
            </p>
            <p className="text-center text-sm font-normal text-[#7D7D7D]">
              Your target is uploaded
            </p>
            <button
              onClick={() => setNotifiedModel(false)}
              className="w-full h-[40px] rounded-md mt-[50px] bg-primary text-white"
            >
              Ok
            </button>
          </div>
        </div>
      )}

      {openModal && <TargetsUploadFile closeModle={setOpenModal} />}
    </div>
  );
}
