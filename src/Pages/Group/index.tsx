import { Icon } from "@iconify/react";
import { SearchSelection } from "../../Components/SearchBar/SearchSelection";
import { Input, Modal } from "antd";
import { IoMdCloseCircle } from "react-icons/io";
import MultiSelect from "../../Components/MultiSelect";
import CustomSelect from "../../Components/Select";
import CustomInput from "../../Components/CustomInput";
import { useFormik } from "formik";
import { useQuery } from "@tanstack/react-query";
import { getAllDoctorsLIst } from "../../api/doctorServices";
import { getAllProductsMR } from "../../api/productServices";
import { getAllAccounts } from "../../api/adminServices";
import CustomTable from "../../Components/CustomTable";
import { useEffect, useState } from "react";
import { TbEdit } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const titles = [
  "Group ID",
  "Group Name",
  "City",
  "No Of Mr",
  "Area’s Name",
  "Product",
  "No Of Doctors",
  "No Of Phaermacies",
  "Actions",
];

const selectRegionOptions = [
  "North Punjab",
  "Kashmir",
  "South Punjab",
  "Gilgit",
];
const activePeriodOptions = [
  "1 month",
  "2 month",
  "3 month",
  "4 month",
  "5 month",
  "6 month",
];

const tableData = [
  [
    "GR007",
    "Cardio A",
    "Lahore",
    "08",
    "Multan Road, DHA-EME, Behria, Izmir Town, Westwood, Muhafiz Town, ParkView...",
    "Amoxicillin, Metformin, Ibuprofen, Naproxen, Acetaminophen, Lisinopril, Atorvastatin, Omeprazole, Sertraline, Escitalopram",
    "19",
    "18",
    <div className="flex items-center gap-3">
      <TbEdit size={18} className="cursor-pointer text-primary" />
      <Icon
        icon="mingcute:delete-line"
        color="#E90761"
        height="18"
        width="20"
        className="cursor-pointer"
      />
    </div>,
  ],
  [
    "GR008",
    "Neuro Plus",
    "Karachi",
    "12",
    "Clifton, DHA Phase 2, PECHS, Gulshan-e-Iqbal, North Nazimabad, Bahadurabad...",
    "Gabapentin, Pregabalin, Diazepam, Alprazolam, Fluoxetine, Paroxetine",
    "22",
    "20",
    <div className="flex items-center gap-3">
      <TbEdit size={18} className="cursor-pointer text-primary" />
      <Icon
        icon="mingcute:delete-line"
        color="#E90761"
        height="18"
        width="20"
        className="cursor-pointer"
      />
    </div>,
  ],
  [
    "GR009",
    "Ortho Care",
    "Islamabad",
    "05",
    "Blue Area, G-9, G-10, F-8, F-10, I-8, I-10...",
    "Diclofenac, Tramadol, Celecoxib, Etoricoxib, Calcium, Vitamin D",
    "16",
    "14",
    <div className="flex items-center gap-3">
      <TbEdit size={18} className="cursor-pointer text-primary" />
      <Icon
        icon="mingcute:delete-line"
        color="#E90761"
        height="18"
        width="20"
        className="cursor-pointer"
      />
    </div>,
  ],
  [
    "GR010",
    "General Med",
    "Faisalabad",
    "09",
    "Peoples Colony, Madina Town, D-Ground, Jinnah Colony, Gulberg...",
    "Azithromycin, Cefixime, Paracetamol, Montelukast, Cetirizine",
    "25",
    "23",
    <div className="flex items-center gap-3">
      <TbEdit size={18} className="cursor-pointer text-primary" />
      <Icon
        icon="mingcute:delete-line"
        color="#E90761"
        height="18"
        width="20"
        className="cursor-pointer"
      />
    </div>,
  ],
];

const selectRouteOptions = ["Active", "Planning", "In-active"];
const cityOptions = ["Lahore", "Islamabad", "BahawalPur", "Karachi"];
export default function Group() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addGroupModel, setAddGroupModel] = useState(false);
  const [currentRowIndex, setCurrentRowIndex] = useState<number | null>(null);
  const [bonusValue, setBonusValue] = useState("");
  const [selectedArea, setSelectedArea] = useState<string>("");

  const [rows, setRows] = useState([
    { productName: "", quantity: 0, total: 0, bonus: "" },
  ]);

  const navigate = useNavigate();
  const handleRowClick = (row: any) => {
    navigate("/group/groupDetails", {
      state: { row },
    });
  };

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
  // const { data: brickGroup, isFetching } = useQuery({
  //   queryKey: ["getAllGroups"],
  //   queryFn: () => getAllGroups(),
  //   staleTime: 5 * 60 * 1000,
  // // });
  // let allbrickGroup = brickGroup?.data?.data;
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
      console.log("Form Values:", values);
    },
  });
  useEffect(() => {
    document.title = "MediRep | Groups";
  }, []);

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
          <div className="flex flex-wrap lg:flex-nowrap w-auto md:w-full lg:w-auto items-center gap-3">
            <div className="md:w-[250px] w-full">
              <SearchSelection placeholder="Group Name" />
            </div>{" "}
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
        </div>
        <div className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(75.7vh-0px)] xl:h-[calc(64vh-0px)] h-auto ">
          <p className="text-[#7D7D7D] font-medium text-sm">Bricks List</p>{" "}
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="scroll-smooth mt-4 bg-white rounded-xl 2xl:h-[calc(68.5vh-0px)] xl:h-[calc(59vh-0px)]  overflow-y-auto scrollbar-none"
          >
            <CustomTable
              titles={titles}
              data={tableData}
              handleGoToDetail={handleRowClick}
            />
          </div>
        </div>
      </div>
      {addGroupModel && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="bg-white rounded-xl xl:mx-0 mx-5 w-[1000px] max-h-[90vh] overflow-x-auto  shadow-xl relative"
          >
            <div className="flex items-center justify-between bg-[#E5EBF7] xl:px-6 px-4 py-4">
              <p className="text-[24px] text-heading capitalize font-normal">
                Create Group
              </p>
              <IoMdCloseCircle
                size={24}
                onClick={() => {
                  setAddGroupModel(false);
                }}
                className="cursor-pointer text-primary"
              />
            </div>

            <form onSubmit={formik.handleSubmit} className="xl:p-6 p-4">
              <p className="text-base font-normal text-[#979797]">
                Define targeted visit strategies for your team
              </p>
              <div className="flex flex-wrap gap-8">
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
                      label="MR Name"
                      options={AllMR.filter(
                        (doc: any) => doc.position === "MedicalRep(MR)",
                      ).map((doc: any) => doc.name)}
                      value={formik.values.mrName}
                      onChange={(val) => formik.setFieldValue("mrName", val)}
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
                      options={AllMR.filter(
                        (doc: any) =>
                          doc.position === "Area Sales Manager (ASM)",
                      ).map((doc: any) => doc.name)}
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
                      options={AllMR.filter(
                        (doc: any) => doc.position === "MedicalRep(MR)",
                      ).map((doc: any) => doc.name)}
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
                      options={activePeriodOptions}
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
                      options={AllMR.filter(
                        (doc: any) => doc.division === "Distributor",
                      ).map((doc: any) => doc.name)}
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
                      label="Doctors List"
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
                      const product = AllProducts.find(
                        (p: any) => p.productName === row.productName,
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
              <div className="flex justify-end mt-5 gap-4">
                <button
                  onClick={() => {
                    setAddGroupModel(false);
                  }}
                  className="h-[55px] md:w-[100px] w-full bg-[#F2FAFD] text-[#131313] rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
                >
                  Cancel
                </button>
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
