import { useState, useEffect } from "react";
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
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { MonthYearPicker } from "../../Components/FilterMonthYear";
import SearchByName from "../../Components/SearchBar/searchByName";

const SaleData = [
  {
    asm: "Area Sales Manager",
    area: "Lahore",
    brick: "Canal Road, Raiwind Road",
    mrName: "Umair Yaqoob",
    target: "500,000",
    achievement: "350,000",
    percentage: "70%",
    details: [
      {
        employeeName: "Umair Yaqoob",
        city: "Lahore",
        brick: "Canal Road",
        target: "250,000",
        achievement: "150,000",
        percentage: "60%",
      },
      {
        employeeName: "Umair Yaqoob",
        city: "Lahore",
        brick: "Raiwind Road",
        target: "250,000",
        achievement: "200,000",
        percentage: "80%",
      },
    ],
  },
  {
    asm: "Area Sales Manager",
    area: "Karachi",
    brick: "Clifton Block 2",
    mrName: "Ahmed Raza",
    target: "600,000",
    achievement: "480,000",
    percentage: "80%",
    details: [
      {
        employeeName: "Ahmed Raza",
        city: "Karachi",
        brick: "Clifton Block 2",
        target: "300,000",
        achievement: "240,000",
        percentage: "80%",
      },
      {
        employeeName: "Ahmed Raza",
        city: "Karachi",
        brick: "Block 2 Extension",
        target: "300,000",
        achievement: "240,000",
        percentage: "80%",
      },
    ],
  },
  {
    asm: "Regional Sales Manager",
    area: "Islamabad",
    brick: "Blue Area",
    mrName: "Ali Khan",
    target: "450,000",
    achievement: "300,000",
    percentage: "66%",
    details: [
      {
        employeeName: "Ali Khan",
        city: "Islamabad",
        brick: "Blue Area",
        target: "450,000",
        achievement: "300,000",
        percentage: "66%",
      },
    ],
  },
  {
    asm: "Area Sales Manager",
    area: "Faisalabad",
    brick: "D Ground",
    mrName: "Hassan Shah",
    target: "550,000",
    achievement: "410,000",
    percentage: "74%",
    details: [
      {
        employeeName: "Hassan Shah",
        city: "Faisalabad",
        brick: "D Ground",
        target: "550,000",
        achievement: "410,000",
        percentage: "74%",
      },
    ],
  },
  {
    asm: "Regional Sales Manager",
    area: "Multan",
    brick: "Cantt Area",
    mrName: "Usman Ali",
    target: "400,000",
    achievement: "320,000",
    percentage: "80%",
    details: [
      {
        employeeName: "Usman Ali",
        city: "Multan",
        brick: "Cantt Area",
        target: "200,000",
        achievement: "160,000",
        percentage: "80%",
      },
      {
        employeeName: "Usman Ali",
        city: "Multan",
        brick: "City Road",
        target: "200,000",
        achievement: "160,000",
        percentage: "80%",
      },
    ],
  },
];

interface EditData {
  _id?: string;
  target?: number;
  [key: string]: any;
}

export default function Targets() {
  const [selectTab, setSelectTab] = useState<"Sales Wise" | "Product Wise">(
    "Sales Wise",
  );
  const [areaFilter, setAreaFilter] = useState("");
  const [brickFilter, setBrickFilter] = useState("");
  const [mrFilter, setMrFilter] = useState("");
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
    queryFn: () =>
      getAllProducts({
        sku: debouncedSku,
        productName: debouncedProductName,
      }),
    staleTime: 5 * 60 * 1000,
  });

  const ProductData = data?.data?.data || [];
  const filteredSaleData = SaleData.filter((item) => {
    return (
      item.area.toLowerCase().includes(areaFilter.toLowerCase()) &&
      item.brick.toLowerCase().includes(brickFilter.toLowerCase()) &&
      item.mrName.toLowerCase().includes(mrFilter.toLowerCase())
    );
  });

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
              : item,
          );

          return {
            ...oldData,

            data: {
              ...oldData.data,
              data: updatedProducts,
            },
          };
        },
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

  const navigate = useNavigate();
  const handleGoToDetails = (row: any) => {
    navigate("/targets-achievements/details", {
      state: { row },
    });
  };

  return (
    <>
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap xl:flex-nowrap gap-4 items-start justify-between">
          <div className="flex w-full lg:w-auto  items-center gap-3">
            <p className="text-heading font-medium text-[22px] sm:text-[24px]">
              Targets
            </p>
            <div className="w-full">
              <MonthYearPicker />
            </div>
          </div>

          <div className="flex flex-wrap lg:flex-nowrap  items-center gap-3">
            {selectTab === "Sales Wise" ? (
              <>
                <div className="w-full md:w-[210px]">
                  <SearchByName
                    name="MR Name:"
                    value={mrFilter}
                    onChange={(val) => setMrFilter(val)}
                  />
                </div>{" "}
                <div className="w-full md:w-[210px]">
                  <SearchByName
                    name="Brick Name:"
                    value={brickFilter}
                    onChange={(val) => setBrickFilter(val)}
                  />
                </div>{" "}
                <div className="w-full md:w-[210px]">
                  <SearchByName
                    name="City:"
                    value={areaFilter}
                    onChange={(val) => setAreaFilter(val)}
                  />
                </div>
              </>
            ) : (
              <>
                {" "}
                <div className="w-full md:w-[220px]">
                  <SearchByName name="Product Name:" />
                </div>{" "}
                <div>
                  <SearchByName name="Form:" />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex mt-4 flex-wrap-reverse justify-between">
          <div className="flex gap-2 w-full md:w-auto self-baseline">
            {["Sales Wise", "Product Wise"].map((tab) => (
              <button
                key={tab}
                className={`w-[120px] h-12 rounded-t-lg ${
                  selectTab === tab
                    ? "bg-[#E5EBF7] text-heading"
                    : "bg-white text-[#7d7d7d]"
                }`}
                onClick={() => {
                  setSelectTab(tab as typeof selectTab);
                  // setCurrentPage(1);
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={() => setOpenModal(true)}
            className="h-[55px] mb-4 w-full md:w-[180px] bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
          >
            <Icon
              icon="mingcute:add-fill"
              height="20"
              width="20"
              color="#fff"
            />
            <p className="text-white text-base font-medium">Upload Target</p>
          </button>
        </div>
        <div
          className={`rounded-[12px] bg-[#E5EBF7] p-4 h-[calc(100vh-287px)] ${
            selectTab === "Sales Wise" ? "rounded-tl-none" : "rounded-tl-[12px]"
          }`}
        >
          <div className="flex flex-wrap gap-3 justify-between items-center">
            <p className="text-[#7D7D7D] font-medium text-sm">
              {selectTab === "Sales Wise"
                ? "Employee Wise Target List"
                : "Products Wise Target List"}
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
            className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(62.6vh-0px)] xl:h-[calc(44.5vh-0px)]  mt-4 overflow-y-auto scrollbar-none"
          >
            {selectTab === "Product Wise" ? (
              <div className="w-full flex-1 overflow-x-auto">
                <table className="w-full border-collapse min-w-[900px]">
                  <thead className="sticky top-0 z-[1] bg-white">
                    <tr className="border-b border-primary text-left text-[13px] font-semibold text-heading">
                      <th className="px-4 py-3 text-[12px] w-[14.5%]">
                        <div className="relative flex items-center">
                          <LuSearch
                            className="absolute left-2 text-[#7d7d7d]"
                            size={14}
                          />

                          <input
                            placeholder="SKU"
                            value={SkuNo}
                            onChange={(e) => setSkuNo(e.target.value)}
                            type="text"
                            className="h-8 pl-[30px] pr-3 w-full border font-normal border-gray-400 rounded-md text-xs text-heading focus:outline-none"
                          />
                        </div>
                      </th>
                      <th className="px-4 py-3 w-[14.5%]">
                        <div className="relative flex items-center">
                          <LuSearch
                            className="absolute left-2 text-[#7d7d7d]"
                            size={14}
                          />

                          <input
                            placeholder="Product Name"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            type="text"
                            className="h-8 pl-[30px] pr-3 w-full border border-gray-400 rounded-md text-sm text-heading font-normal focus:outline-none"
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
                            <p
                              className={`px-2 py-0.5 w-max rounded-sm ${
                                row.isStatus === "Active"
                                  ? "text-primary border border-primary"
                                  : row.isStatus === "Discontinued"
                                    ? "text-[#E90761] border border-[#E90761]"
                                    : "text-heading border border-gray-300"
                              }`}
                            >
                              {" "}
                              {row.isStatus}
                            </p>{" "}
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
                                    editIndex === rowIndex ? null : rowIndex,
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
            ) : (
              <div className="w-full flex-1 overflow-x-auto">
                <table className="w-full border-collapse min-w-[900px]">
                  <thead className="sticky top-0 z-[1] bg-white">
                    <tr className="border-b h-[56px] border-primary text-left text-[13px] font-semibold text-heading">
                      <th className="px-4 font-medium py-3 text-[12px] w-[14.5%]">
                        Employees Name
                      </th>
                      <th className="px-4 font-medium py-3 text-[12px] w-[14.5%]">
                        City
                      </th>
                      <th className="px-4 font-medium py-3 text-[12px] w-[14.5%]">
                        Brick Name
                      </th>
                      <th className="px-4 font-medium py-3 text-[12px] w-[14.5%]">
                        Mr Name
                      </th>
                      <th className="px-4 font-medium py-3 text-[12px] w-[14.5%]">
                        Enter Target
                      </th>
                      <th className="px-4 font-medium py-3 text-[12px] w-[14.5%]">
                        Achievement
                      </th>
                      <th className="px-4 font-medium py-3 text-[12px] w-[14.5%]">
                        Percentage
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
                    ) : filteredSaleData.length > 0 ? (
                      filteredSaleData.map((row, rowIndex) => (
                        <tr
                          onClick={() => handleGoToDetails(row)}
                          key={rowIndex}
                          className="hover:bg-[#E5EBF7] h-[56px] hover:text-black cursor-pointer"
                        >
                          <td className="px-5 py-2 border-b border-primary text-[13px]">
                            {row.asm}
                          </td>
                          <td className="px-5 py-2 border-b border-primary text-[13px]">
                            {row.area}
                          </td>
                          <td className="px-5 py-2 border-b border-primary text-[13px]">
                            {row.brick}
                          </td>
                          <td className="px-5 py-2 border-b border-primary text-[13px]">
                            {row.mrName}
                          </td>
                          <td className="px-5 py-2 border-b border-primary text-[13px]">
                            {row.target}
                          </td>
                          <td className="px-5 py-2 border-b border-primary text-[13px]">
                            {row.achievement}
                          </td>
                          <td className="px-5 py-2 border-b border-primary text-[13px]">
                            {row.percentage}
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
            )}
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
      {openModal && (
        <TargetsUploadFile closeModle={setOpenModal} refetch={refetch} />
      )}
    </>
  );
}
