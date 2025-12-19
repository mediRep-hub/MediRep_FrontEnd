import { Icon } from "@iconify/react";
import SearchDateRange from "../../Components/SearchBar/SearchDateRange";
import { SearchSelection } from "../../Components/SearchBar/SearchSelection";
import { Avatar, Input, Modal, Spin } from "antd";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import Pagination from "../../Components/Pagination";
import { IoIosArrowDown, IoMdCloseCircle } from "react-icons/io";
import MultiSelect from "../../Components/MultiSelect";
import CustomSelect from "../../Components/Select";
import CustomInput from "../../Components/CustomInput";
import { useFormik } from "formik";
import { useQuery } from "@tanstack/react-query";
import { getAllDoctorsLIst } from "../../api/doctorServices";
import { getAllProductsMR } from "../../api/productServices";
import { getAllAccounts } from "../../api/adminServices";
import { getAllGroups } from "../../api/groupBrickServices";

const titles = [
  "Group ID",
  "Group Name",
  "Total MR’s",
  "Total Dr",
  "Products",
  "Status",
  "Actions",
];
const AllBricks = [
  {
    groupId: "GROUP-001",
    groupName: "Lahore Central",
    distributorName: "Ahmed Khan",
    totalMRs: 5,
    totalDoctors: 20,
    distributorImages: [
      "https://i.pravatar.cc/150?img=1",
      "https://i.pravatar.cc/150?img=2",
      "https://i.pravatar.cc/150?img=3",
    ],
  },
  {
    groupId: "GROUP-002",
    groupName: "Karachi South",
    distributorName: "Bilal Hassan",
    totalMRs: 7,
    totalDoctors: 28,
    distributorImages: [
      "https://i.pravatar.cc/150?img=4",
      "https://i.pravatar.cc/150?img=5",
    ],
  },
];

const doctorList = [
  {
    teamId: "GROUP-001",
    teamName: "Lahore Central",
    totalMRs: 5,
    totalDoctors: 20,
    products: ["Panadol", "Brufen"],
    status: "Active",
    view: "Details",
  },
  {
    teamId: "GROUP-002",
    teamName: "Karachi South",
    totalMRs: 7,
    totalDoctors: 28,
    products: ["Calpol", "Arinac"],
    view: "Details",
    status: "Inactive",
  },
  {
    teamId: "GROUP-003",
    teamName: "Islamabad North",
    totalMRs: 4,
    totalDoctors: 15,
    products: ["Augmentin"],
    status: "Active",
    view: "Details",
  },
];

const selectRegionOptions = [
  "North Punjab",
  "Kashmir",
  "South Punjab",
  "Gilgit",
];

interface ProductRow {
  productName: string;
  quantity: number;
  bonus?: number;
  total: number;
}
const selectRouteOptions = ["Active", "Planning", "In-active"];
const cityOptions = ["Lahore", "Islamabad", "BahawalPur", "Karachi"];
export default function Group() {
  const [selectedBrick, setSelectedBrick] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addGroupModel, setAddGroupModel] = useState(false);
  const [currentRowIndex, setCurrentRowIndex] = useState<number | null>(null);
  const [bonusValue, setBonusValue] = useState("");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [rows, setRows] = useState([
    { productName: "", quantity: 0, total: 0, bonus: "" },
  ]);

  const addRow = () => {
    setRows([...rows, { productName: "", quantity: 0, total: 0, bonus: "" }]);
  };
  const { data: doctorss } = useQuery({
    queryKey: ["AllDoctorsss", selectedArea],
    queryFn: () => getAllDoctorsLIst(selectedArea),
  });
  const { data: Products } = useQuery({
    queryKey: ["getAllProductsMR"],
    queryFn: () => getAllProductsMR(),
  });
  const { data: allMr } = useQuery({
    queryKey: ["AllAccount"],
    queryFn: () => getAllAccounts(),
    staleTime: 5 * 60 * 1000,
  });
  const { data: brickGroup, isFetching } = useQuery({
    queryKey: ["getAllGroups"],
    queryFn: () => getAllGroups(),
    staleTime: 5 * 60 * 1000,
  });
  let allbrickGroup = brickGroup?.data?.data;
  console.log("🚀 ~ Group ~ allbrickGroup:", allbrickGroup);
  const formik = useFormik({
    initialValues: {
      groupName: "",
      groupType: "",
      region: "",
      mrName: [],
      area: "",
      doctorList: [],
      manager: "",
      teamLead: "",
      activePeriod: "",
      distributor: "",
    },
    onSubmit: (values) => {
      // This function runs when the form is submitted
      console.log("Form Values:", values);
    },
  });
  useEffect(() => {
    document.title = "MediRep | Groups";
  }, []);
  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 24, color: "white" }} spin />
  );
  const antIcon22 = (
    <Loading3QuartersOutlined style={{ fontSize: 50, color: "#0755E9" }} spin />
  );
  useEffect(() => {
    setSelectedArea(formik.values.area || "");
  }, [formik.values.area]);

  const AllMR = allMr?.data?.admins ?? [];
  const AllDOctors = Array.isArray(doctorss?.data?.data)
    ? doctorss.data?.data
    : [];
  const AllProducts = Array.isArray(Products?.data?.data)
    ? Products.data?.data
    : [];
  const removeRow = (index: number) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const openBonusModal = (index: number) => {
    setCurrentRowIndex(index);
    setBonusValue(rows[index].bonus || "");
    setIsModalOpen(true);
  };

  const handleBonusSave = () => {
    if (currentRowIndex !== null) {
      const newRows = [...rows];
      newRows[currentRowIndex].bonus = bonusValue;
      setRows(newRows);
    }
    setIsModalOpen(false);
    setBonusValue("");
    setCurrentRowIndex(null);
  };

  return (
    <>
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap gap-4 justify-between items-start">
          <p className="text-heading w-full lg:w-auto font-medium text-[22px] sm:text-[24px]">
            Group
          </p>
          <div className="flex flex-wrap w-auto md:w-full lg:w-auto items-center gap-3">
            <div className="lg:w-[200px] 2xl:w-[300px] md:w-[calc(33%-8px)] w-full">
              <SearchSelection />
            </div>{" "}
            <div className="lg:w-[200px] 2xl:w-[300px] md:w-[calc(33%-8px)] md:mt-0 mt-2 w-full">
              <SearchSelection placeholder="Select Area" />
            </div>{" "}
            <div className="lg:w-[200px] 2xl:w-[300px] md:w-[calc(33%-8px)] md:mt-0 mt-2 w-full">
              <SearchDateRange />
            </div>
          </div>
          <button
            onClick={() => {
              setAddGroupModel(true);
            }}
            className="h-[55px] w-full md:w-[200px] bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
          >
            <Icon
              icon="mingcute:add-fill"
              height="20"
              width="20"
              color="#fff"
            />
            <p className="text-white text-base font-medium">Create Group</p>
          </button>
        </div>
        <div className="bg-[#E5EBF7] flex-wrap flex gap-4 mt-4 rounded-[12px] p-4 2xl:h-[calc(75.7vh-0px)] xl:h-[calc(64vh-0px)] h-auto ">
          <div className="lg:w-[calc(25%-8px)] w-full">
            <div className="flex justify-between items-center">
              <p className="text-[#7D7D7D] font-medium text-sm">Bricks List</p>
              <Pagination />
            </div>
            {isFetching ? (
              <div className="mt-5 flex justify-center">
                <Spin indicator={antIcon22} />
              </div>
            ) : allbrickGroup && allbrickGroup.length > 0 ? (
              <div
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                className="scroll-smooth 2xl:h-[calc(68vh-0px)] xl:h-[calc(53vh-0px)] mt-4 overflow-y-auto scrollbar-none"
              >
                {allbrickGroup.map((mr: any, index: number) => (
                  <div
                    key={mr._id || index}
                    className={`bg-white p-5 first:mt-0 mt-4 rounded-xl cursor-pointer ${
                      selectedBrick?._id === mr._id
                        ? "border-2 border-primary"
                        : "border-2 border-white"
                    }`}
                    // onClick={() => {
                    //   setSelectedBrick(mr);
                    //   setDoctorPage(1);
                    // }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex -space-x-5">
                        {mr.mr.map((img: any, index: number) => (
                          <Avatar
                            key={index}
                            size={42}
                            src={img.image}
                            className="border-2 border-white"
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-3">
                        {selectedBrick?._id === mr._id && (
                          <div className="flex h-9 w-9 rounded-[6px] items-center justify-center gap-2 border-[1px] border-primary">
                            <Icon
                              color="#0755E9"
                              height="18"
                              width="20"
                              icon="icon-park-solid:doc-detail"
                              // onClick={(e) => {
                              //   SetViewdetails(true);
                              //   e.stopPropagation();
                              // }}
                            />
                          </div>
                        )}

                        <div className="flex h-9 w-9 rounded-[6px] items-center justify-center gap-2 border-[1px] border-[#E90761]">
                          <Icon
                            color="#E90761"
                            height="18"
                            width="20"
                            icon="mingcute:delete-fill"
                            // onClick={(e) => {
                            //   e.stopPropagation();
                            //   setDeleteConfirmation(true);
                            //   setEditingProduct(mr);
                            // }}
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-primary mt-5 text-sm ">
                      GROUP ID: {mr?.groupId}
                    </p>
                    <p className="text-[#131313] text-sm ">
                      Group Name:{" "}
                      <span className="text-[#7d7d7d]">{mr.groupName}</span>
                    </p>
                    <p className="text-[#131313] text-sm ">
                      Distributor Name{" "}
                      <span className="text-primary">
                        {mr?.distributorName}
                      </span>{" "}
                      <span className="text-[#7d7d7d]">
                        {mr?.mrStatus?.totalCalls}
                      </span>
                    </p>{" "}
                    <p className="text-[#131313] text-sm">
                      MR’s/Doctor:{" "}
                      <span className="text-[#7d7d7d]">
                        <span className="text-primary">{mr?.mr.length}</span> /{" "}
                        {mr?.doctors.length}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 text-center text-heading text-base">
                No data found
              </div>
            )}
          </div>
          <div className="lg:w-[calc(75%-8px)] w-full">
            <div className="flex justify-between items-center">
              <p className="text-[#7D7D7D] font-medium text-sm">Call List</p>
              <Pagination />
            </div>

            <div
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(68vh-0px)] xl:h-[calc(53vh-0px)] mt-4 overflow-y-auto scrollbar-none"
            >
              <table className="w-full border-collapse min-w-[700px]">
                <thead className="sticky top-0 z-[1] h-[56px] bg-white">
                  <tr>
                    {titles?.map((title, index) => (
                      <th
                        key={index}
                        className="border-b border-primary px-5 py-2 text-[12px] font-medium text-heading text-left bg-white"
                      >
                        {title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isFetching ? (
                    <tr>
                      <td
                        colSpan={titles.length}
                        className="py-5 text-center text-[#7d7d7d]"
                      >
                        <Spin indicator={antIcon} />
                      </td>
                    </tr>
                  ) : doctorList.length > 0 ? (
                    doctorList.map((doc: any, rowIndex: number) => (
                      <tr
                        key={rowIndex}
                        className="hover:bg-[#E5EBF7] h-[56px] hover:text-black cursor-pointer"
                      >
                        <td className="px-5 py-2 min-w-[120px]   border-b-[0.5px] text-[13px] border-primary">
                          {doc.teamId}
                        </td>
                        <td className="px-5 py-2 min-w-[120px] border-b-[0.5px] text-[13px] border-primary">
                          {doc.teamName || "--"}
                        </td>
                        <td className="px-5 py-2 min-w-[120px] border-b-[0.5px] text-[13px] border-primary">
                          {doc.totalMRs}
                        </td>
                        <td className="px-5 py-2 min-w-[120px] border-b-[0.5px] text-[13px] border-primary">
                          {doc.totalDoctors || "--"}
                        </td>
                        <td className="px-5 py-2 min-w-[150px] border-b-[0.5px] text-[13px] border-primary">
                          {doc.products?.join(", ") || "--"}
                        </td>
                        <td className="px-5 py-2 min-w-[120px] border-b-[0.5px] text-[13px] border-primary">
                          <p
                            className={`inline-block px-2 py-0.5 capitalize  rounded-sm font-medium text-sm border ${
                              doc.status === "pending"
                                ? "text-[#E90761] border-[#E90761]"
                                : doc.status === "close"
                                ? "text-[#0BA69C] border-[#0BA69C]"
                                : doc.status === "check In"
                                ? "text-[#FF9500] border-[#FF9500]"
                                : "text-heading border-heading"
                            }`}
                          >
                            {doc.status}
                          </p>
                        </td>
                        <td className="px-5 py-2 min-w-[150px] border-b-[0.5px] text-[13px] border-primary">
                          <div
                            className="flex gap-3 items-center"
                            // onClick={() => handleGoTODetails(doc)}
                          >
                            <Icon
                              icon="iconoir:notes"
                              height="16"
                              width="16"
                              color="#7d7d7d"
                            />
                            Details
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={titles.length}
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
      {addGroupModel && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="bg-white rounded-xl xl:mx-0 mx-5 w-[1000px] max-h-[90vh] overflow-x-auto xl:p-6 p-4 shadow-xl relative"
          >
            <div className="flex items-center justify-between ">
              <p className="text-[24px] text-heading capitalize font-medium">
                Create Group
              </p>
              <IoMdCloseCircle
                size={20}
                onClick={() => {
                  setAddGroupModel(false);
                }}
                className="cursor-pointer text-primary"
              />
            </div>
            <p className="text-base font-normal text-[#979797]">
              Define targeted visit strategies for your team
            </p>
            <form onSubmit={formik.handleSubmit}>
              <div className="flex flex-wrap mt-5 gap-8">
                <div className="md:w-[calc(50%-16px)] w-full">
                  <p className="text-base font-normal text-heading">
                    Brick Details
                  </p>
                  <div className="mt-3">
                    <CustomInput
                      label="Group Name"
                      name="groupName"
                      placeholder="Write the Group Name"
                      value={formik.values.groupName}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.groupName && formik.errors.groupName && (
                      <div className="text-red-500 text-xs">
                        *{String(formik.errors.groupName)}
                      </div>
                    )}
                  </div>{" "}
                  <div className="mt-3">
                    <CustomSelect
                      options={selectRouteOptions}
                      value={formik.values.groupType}
                      onChange={(val) => formik.setFieldValue("groupType", val)}
                      placeholder="Group Type"
                    />
                    {formik.touched.groupType && formik.errors.groupType && (
                      <div className="text-red-500 text-xs">
                        *{String(formik.errors.groupType)}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <CustomSelect
                      options={selectRegionOptions}
                      value={formik.values.region}
                      onChange={(val) => formik.setFieldValue("region", val)}
                      placeholder="Region"
                    />
                    {formik.touched.region && formik.errors.region && (
                      <div className="text-red-500 text-xs">
                        *{String(formik.errors.region)}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <CustomSelect
                      options={cityOptions}
                      value={formik.values.area}
                      onChange={(val) => formik.setFieldValue("area", val)}
                      placeholder="Area"
                    />
                    {formik.touched.area && formik.errors.area && (
                      <div className="text-red-500 text-xs">
                        *{String(formik.errors.area)}
                      </div>
                    )}
                  </div>{" "}
                  <div className="mt-3">
                    <MultiSelect
                      options={AllMR.filter(
                        (doc: any) => doc.position === "MedicalRep(MR)"
                      ).map((doc: any) => doc.name)}
                      value={formik.values.doctorList}
                      onChange={(val) =>
                        formik.setFieldValue("doctorList", val)
                      }
                      placeholder="Select MR"
                    />

                    {formik.touched.mrName && formik.errors.mrName && (
                      <div className="text-red-500 text-xs">
                        *{String(formik.errors.mrName)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="md:w-[calc(50%-16px)] w-full">
                  <p className="text-base font-normal text-heading">
                    Set Doctors
                  </p>
                  <div className="mt-3">
                    <CustomSelect
                      options={cityOptions}
                      value={formik.values.manager}
                      onChange={(val) => formik.setFieldValue("manager", val)}
                      placeholder="Select Manager"
                    />
                    {formik.touched.manager && formik.errors.manager && (
                      <div className="text-red-500 text-xs">
                        *{String(formik.errors.manager)}
                      </div>
                    )}
                  </div>{" "}
                  <div className="mt-3">
                    <CustomSelect
                      options={cityOptions}
                      value={formik.values.teamLead}
                      onChange={(val) => formik.setFieldValue("teamLead", val)}
                      placeholder="Team Lead"
                    />
                    {formik.touched.area && formik.errors.area && (
                      <div className="text-red-500 text-xs">
                        *{String(formik.errors.area)}
                      </div>
                    )}
                  </div>{" "}
                  <div className="mt-3">
                    <CustomSelect
                      options={cityOptions}
                      value={formik.values.activePeriod}
                      onChange={(val) =>
                        formik.setFieldValue("activePeriod", val)
                      }
                      placeholder="Active Period"
                    />
                    {formik.touched.activePeriod &&
                      formik.errors.activePeriod && (
                        <div className="text-red-500 text-xs">
                          *{String(formik.errors.activePeriod)}
                        </div>
                      )}
                  </div>{" "}
                  <div className="mt-3">
                    <CustomSelect
                      options={cityOptions}
                      value={formik.values.distributor}
                      onChange={(val) =>
                        formik.setFieldValue("distributor", val)
                      }
                      placeholder="Select Distributor"
                    />
                    {formik.touched.distributor &&
                      formik.errors.distributor && (
                        <div className="text-red-500 text-xs">
                          *{String(formik.errors.distributor)}
                        </div>
                      )}
                  </div>{" "}
                  <div className="mt-3">
                    <MultiSelect
                      options={AllDOctors.map((doc: any) => doc.name)}
                      value={formik.values.doctorList}
                      onChange={(val) =>
                        formik.setFieldValue("doctorList", val)
                      }
                      placeholder="Select Doctor"
                    />
                    {formik.touched.doctorList && formik.errors.doctorList && (
                      <div className="text-red-500 text-xs">
                        *{String(formik.errors.doctorList)}
                      </div>
                    )}
                  </div>{" "}
                </div>
              </div>
              <div className="w-full mt-5 rounded-md border-dashed border-[1px] border-primary pb-3">
                <div className="border-b-[1px] border-primary w-full flex p-4">
                  <p className="text-xs w-[40%] font-bold text-heading">
                    Product Name
                  </p>{" "}
                  <p className="text-xs w-[20%] font-bold text-heading">
                    Set Target
                  </p>{" "}
                  <p className="text-xs w-[20%]  font-bold text-heading">
                    Set Bonus
                  </p>{" "}
                  <p className="text-xs w-[20%]  font-bold text-heading">
                    Value
                  </p>{" "}
                  <p className="text-xs w-[20%]  font-bold text-heading">
                    Action
                  </p>
                </div>{" "}
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2">
                    {rows.map((row, index) => {
                      // Get the price of the selected product
                      const product = AllProducts.find(
                        (p: any) => p.productName === row.productName
                      );
                      const price = product ? product.amount : 0;
                      const total = price * (row.quantity || 0);

                      return (
                        <div
                          key={index}
                          className="border-b-[1px] border-primary w-full flex items-center p-4"
                        >
                          <div className="text-xs w-[40%] font-bold text-heading">
                            <select
                              value={row.productName}
                              onChange={(e) => {
                                const newRows = [...rows];
                                newRows[index].productName = e.target.value;
                                setRows(newRows);
                              }}
                              className="border-[1px] px-2 w-[90%] rounded-md border-[#7d7d7d] p-1 focus:outline-none"
                            >
                              <option value="">Select Product</option>
                              {AllProducts.map((product: any, idx: number) => (
                                <option key={idx} value={product.productName}>
                                  {product.productName}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="text-xs w-[20%] font-bold text-heading">
                            <input
                              type="number"
                              value={row.quantity}
                              onChange={(e) => {
                                const newRows = [...rows];
                                newRows[index].quantity =
                                  parseInt(e.target.value) || 0;
                                setRows(newRows);
                              }}
                              className="border-[1px] px-2 w-[90%] rounded-md border-[#7d7d7d] p-1 focus:outline-none"
                            />
                          </div>

                          <p
                            className="text-xs cursor-pointer w-[20%] font-medium text-primary underline"
                            onClick={() => openBonusModal(index)}
                          >
                            {row.bonus || "Add Bonus"}
                          </p>

                          <p className="text-xs w-[20%] font-bold text-heading">
                            {total}
                          </p>

                          <div className="w-[20%] flex gap-2">
                            {index === 0 ? (
                              <div
                                className="h-10 cursor-pointer w-10 border-primary flex items-center justify-center border-[1px] rounded-md"
                                onClick={addRow}
                              >
                                <Icon
                                  className="text-primary"
                                  icon="basil:add-outline"
                                  height="25"
                                  width="25"
                                />
                              </div>
                            ) : (
                              <div
                                className="h-10 cursor-pointer w-10 border-red-500 flex items-center justify-center border-[1px] rounded-md"
                                onClick={() => removeRow(index)}
                              >
                                <Icon
                                  className="text-red-500"
                                  icon="mingcute:close-fill"
                                  height="20"
                                  width="20"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Modal
                    title="Add Bonus"
                    open={isModalOpen}
                    onOk={handleBonusSave}
                    onCancel={() => setIsModalOpen(false)}
                    okText="Save"
                    className="mt-10"
                  >
                    <Input
                      value={bonusValue}
                      onChange={(e: any) => setBonusValue(e.target.value)}
                      placeholder="Enter bonus text"
                    />
                  </Modal>
                </div>
              </div>{" "}
              <div className="flex justify-end mt-5">
                <button
                  type="submit"
                  className="h-[55px] md:w-[200px] w-full bg-primary text-white rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
                >
                  Save Gorup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}{" "}
    </>
  );
}
