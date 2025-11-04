import { MdAdd } from "react-icons/md";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllProducts, updateProducts } from "../../api/productServices";
import { TbEdit } from "react-icons/tb";
import { FaCheckCircle } from "react-icons/fa";
import { notifyError, notifySuccess } from "../../Components/Toast";
import TargetsUploadFile from "../../Components/TargetUploads";
import { LuSearch } from "react-icons/lu";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { Spin } from "antd";

interface EditData {
  _id?: string;
  target?: number;
  [key: string]: any;
}

export default function Targets() {
  const [openModal, setOpenModal] = useState(false);
  const [SkuNo, setskuNo] = useState("");
  const [productName, setproductName] = useState("");
  const [debouncedSku, setDebouncedSku] = useState("");
  const [debouncedProductName, setDebouncedProductName] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editdata, setEditdata] = useState<EditData>({});
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
  const handleEdit = async (editdata: EditData) => {
    if (!editdata._id) return;

    try {
      await updateProducts(editdata._id, { target: editdata.target });
      notifySuccess("Target updated successfully!");
      queryClient.setQueryData(["AllProducts"], (oldData: any) => {
        const updated = oldData?.data?.data.map((item: any) =>
          item._id === editdata._id
            ? { ...item, target: editdata.target }
            : item
        );
        return { ...oldData, data: { ...oldData.data, data: updated } };
      });
    } catch (error) {
      console.error("❌ Update error:", error);
      notifyError("Failed to update target.");
    } finally {
      setEditIndex(null);
      setEditdata({});
      refetch();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSku(SkuNo);
      setDebouncedProductName(productName);
    }, 500);
    return () => clearTimeout(timer);
  }, [SkuNo, productName]);
  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 40, color: "#0755E9" }} spin />
  );
  return (
    <div>
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <p className="text-heading font-medium text-[22px] sm:text-[24px]">
            Target
          </p>
          <button
            onClick={() => setOpenModal(true)}
            className="h-[55px] w-full md:w-[180px] bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
          >
            <MdAdd size={20} color="#fff" />
            <p className="text-white text-base font-medium">Upload Target</p>
          </button>
        </div>

        <div className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(90vh-137px)] xl:h-[calc(90vh-169px)] h-auto">
          <p className="text-[#7D7D7D] font-medium text-sm">Targets List</p>
          <div className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(85vh-157px)] xl:h-[calc(65vh-79px)] mt-4 overflow-y-auto scrollbar-none">
            <div className="w-full flex-1 overflow-x-auto">
              <table className="w-full border-collapse min-w-[900px]">
                <thead className="sticky top-0 z-[1] bg-white">
                  <tr className="border-b border-primary text-left text-[13px] font-semibold text-heading">
                    <th className="px-4 py-3 w-[16%]">
                      <div className="relative flex items-center">
                        <LuSearch
                          className="absolute left-2 text-gray-500"
                          size={14}
                        />
                        <div className="absolute left-7 border-r-[1px] border-gray-400 pr-2 text-xs font-medium text-heading">
                          SKU
                        </div>
                        <input
                          value={SkuNo}
                          onChange={(e) => setskuNo(e.target.value)}
                          type="text"
                          className="h-8 pl-[66px] pr-3 w-full border font-medium border-gray-400 rounded-md text-sm text-gray-800 focus:outline-none"
                        />{" "}
                      </div>
                    </th>
                    <th className="px-4 py-3 w-[18%]">
                      <div className="relative flex items-center">
                        <LuSearch
                          className="absolute left-2 text-gray-500"
                          size={14}
                        />
                        <div className="absolute left-7 border-r-[1px] border-gray-400 pr-2 text-xs font-medium text-heading">
                          Product Name
                        </div>
                        <input
                          value={productName}
                          onChange={(e) => setproductName(e.target.value)}
                          type="text"
                          className="h-8 pl-[120px] pr-3 w-full border border-gray-400 rounded-md text-sm text-heading font-medium focus:outline-none"
                        />{" "}
                      </div>
                    </th>
                    <th className="px-4 py-3 w-[14%]">Form</th>
                    <th className="px-4 py-3 w-[14%]">Status</th>
                    <th className="px-4 py-3 w-[14%]">Target</th>
                    <th className="px-4 py-3 w-[14%]">Achievement</th>
                    <th className="px-4 py-3 w-[10%]">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {isFetching ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-5 text-center text-gray-500"
                      >
                        {" "}
                        <Spin indicator={antIcon} />
                      </td>
                    </tr>
                  ) : ProductData.length > 0 ? (
                    ProductData.map((row: any, rowIndex: number) => (
                      <tr
                        key={rowIndex}
                        className="hover:bg-[#E5EBF7] h-[56px] hover:text-black cursor-pointer"
                      >
                        <td className=" px-5 py-2 border-b-[0.5px] border-primary text-[13px] font-normal text-heading break-words">
                          {row.sku}
                        </td>
                        <td className=" px-5 py-2 border-b-[0.5px] border-primary text-[13px] font-normal text-heading break-words">
                          {row.productName}
                        </td>
                        <td className=" px-5 py-2 border-b-[0.5px] border-primary text-[13px] font-normal text-heading break-words">
                          {row.isfrom}
                        </td>
                        <td className=" px-5 py-2 border-b-[0.5px] border-primary text-[13px] font-normal text-heading break-words">
                          {row.isStatus}
                        </td>
                        <td className=" px-5 py-2 border-b-[0.5px] border-primary text-[13px] font-normal text-heading break-words">
                          {editIndex === rowIndex ? (
                            <input
                              type="number"
                              value={editdata.target ?? row.target}
                              onChange={(e) =>
                                setEditdata({
                                  ...editdata,
                                  _id: row._id,
                                  target: Number(e.target.value),
                                })
                              }
                              className="border border-gray-400 rounded-md px-2 py-1 w-20 text-sm text-gray-700 focus:outline-none"
                            />
                          ) : (
                            <span>{row.target}</span>
                          )}
                        </td>
                        <td className=" px-5 py-2 border-b-[0.5px] border-primary text-[13px] font-normal text-heading break-words">
                          {row.achievement}
                        </td>
                        <td className=" px-5 py-2 border-b-[0.5px] border-primary text-[13px] font-normal text-heading break-words">
                          <div className="flex gap-5 items-center">
                            <TbEdit
                              onClick={() => {
                                setEditIndex(
                                  editIndex === rowIndex ? null : rowIndex
                                );
                                setEditdata({
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
                              onClick={() => handleEdit(editdata)}
                              className={`cursor-pointer ${
                                editIndex === rowIndex
                                  ? "text-[#7d7d7d]"
                                  : "text-primary"
                              }`}
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

      {openModal && <TargetsUploadFile closeModle={setOpenModal} />}
    </div>
  );
}
