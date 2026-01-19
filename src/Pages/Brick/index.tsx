import { Icon } from "@iconify/react";
import { IoIosArrowDown, IoMdCloseCircle } from "react-icons/io";
import CustomSelect from "../../Components/Select";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { notifyError, notifySuccess } from "../../Components/Toast";
import {
  addReport,
  deleteReports,
  getAllReports,
  updateReports,
} from "../../api/callReporting";
import { BrickSchema } from "../../utils/validation";
import { getAllDoctorsLIst } from "../../api/doctorServices";
import { getAllProductsMR } from "../../api/productServices";
import { getAllAccounts } from "../../api/adminServices";
import CustomInput from "../../Components/CustomInput";
import MultiSelect from "../../Components/MultiSelect";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import Pagination from "../../Components/Pagination";
import { Avatar, Spin } from "antd";
import { FiClock } from "react-icons/fi";
import { TbEdit } from "react-icons/tb";
import { RiAlertFill } from "react-icons/ri";
const selectRegionOptions = [
  "North Punjab",
  "Kashmir",
  "South Punjab",
  "Gilgit",
];
const selectDaysOptions = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const selectRouteOptions = ["Active", "Planning", "In-active"];
const cityOptions = ["Lahore", "Islamabad", "BahawalPur", "Karachi"];

export default function Brick() {
  const [addBrickModel, setAddBrickModel] = useState(false);
  const [doctorPage, setDoctorPage] = useState(1);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [isloadingDelete, setLoadingDelete] = useState(false);
  const [deleteID, setdeleteID] = useState<any>(null);
  const [selectedBrick, setSelectedBrick] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isloading, setLoading] = useState(false);
  const [selectedMR, setSelectedMR] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [doctorList, setDoctorList] = useState<any[]>([]);

  const [selectedDate, setSelectedDate] = useState<{
    start: string;
    end: string;
  }>({
    start: "",
    end: "",
  });

  useEffect(() => {
    document.title = "MediRep | Brick";
  }, []);
  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 24, color: "white" }} spin />
  );
  const capitalize = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const limit = 10;
  const doctorLimit = 10;
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
  const {
    data: result,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [
      "reports",
      page,
      doctorPage,
      selectedMR,
      selectedArea,
      selectedDate.start,
      selectedDate.end,
    ],
    queryFn: () =>
      getAllReports(
        page,
        limit,
        doctorPage,
        doctorLimit,
        selectedMR,
        selectedDate.start || undefined,
        selectedDate.end || undefined,
        capitalize(selectedArea?.toLowerCase()),
      ),
  });
  const AllMR = allMr?.data?.admins ?? [];
  const ALLbricks = result?.data ?? [];
  console.log("🚀 ~ Brick ~ ALLbricks:", ALLbricks);
  useEffect(() => {
    const bricks = result?.data?.data ?? [];
    const firstBrickDoctors = bricks[0]?.doctorList ?? [];
    setDoctorList(firstBrickDoctors);
  }, [result]);

  const AllDOctors = Array.isArray(doctorss?.data?.data)
    ? doctorss.data?.data
    : [];
  const AllProducts = Array.isArray(Products?.data?.data)
    ? Products.data?.data
    : [];

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      region: editingProduct?.region || "",
      area: editingProduct?.area || "",
      brickName: editingProduct?.brickName || "",
      route: editingProduct?.route || "",
      day: editingProduct?.day || "",
      products: editingProduct?.products?.map((pro: any) => pro.name) || [],
      mrName: editingProduct?.mrName?.name || "",
      doctorList: editingProduct?.doctorList?.map((doc: any) => doc.name) || [],
    },
    validationSchema: BrickSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const selectedMR = AllMR?.find((mr: any) => mr._id === values.mrName);
        if (!selectedMR) {
          notifyError("MR not found");
          setLoading(false);
          return;
        }

        // Convert doctor names to IDs
        const doctorIds = AllDOctors?.filter((doc: any) =>
          values.doctorList.includes(doc.name),
        )?.map((doc: any) => doc._id);

        const selectedProducts = AllProducts.filter((pro: any) =>
          values.products.some(
            (p: any) =>
              p.name?.trim().toLowerCase() ===
              pro.productName.trim().toLowerCase(),
          ),
        );

        if (selectedProducts.length === 0) {
          notifyError("Please select at least one valid product.");
          setLoading(false);
          return;
        }

        console.log("🚀 ~ Bricks ~ selectedProducts:", selectedProducts);
        console.log("values.products =", values.products);
        if (selectedProducts.length === 0) {
          notifyError("Please select at least one valid product.");
          setLoading(false);
          return;
        }

        const payload = {
          ...values,
          mrName: values.mrName,
          doctorList: doctorIds,
          products: values.products.map((p: any) => p.name),
        };
        if (editingProduct) {
          await updateReports(editingProduct._id, payload);
          notifySuccess("Brick updated successfully");
          setEditingProduct(null);
        } else {
          await addReport(payload);
          notifySuccess("Brick added successfully");
        }

        setAddBrickModel(false);
        formik.resetForm();
        // refetch();
      } catch (error: any) {
        console.error(error);
        notifyError(error.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
  });
  const antIcon22 = (
    <Loading3QuartersOutlined style={{ fontSize: 50, color: "#0755E9" }} spin />
  );
  const handleDelete = async () => {
    setLoadingDelete(true);
    try {
      await deleteReports(editingProduct._id);
      notifySuccess("Brick deleted successfully");
      refetch();
    } catch (error) {
      console.error(error);
      notifyError("Failed to delete Brick. Please try again.");
    } finally {
      setLoadingDelete(false);
      setDeleteConfirmation(false);
    }
  };
  return (
    <>
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap gap-4 justify-between items-start">
          <p className="text-heading w-full lg:w-auto font-medium text-[22px] sm:text-[24px]">
            Brick
          </p>

          <button
            onClick={() => {
              setAddBrickModel(true);
              setEditingProduct(null);
            }}
            className="h-[55px] w-full md:w-[200px] bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
          >
            <Icon
              icon="mingcute:add-fill"
              height="20"
              width="20"
              color="#fff"
            />
            <p className="text-white text-base font-medium">Create Brick</p>
          </button>
        </div>
        <div className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(75.7vh-0px)] xl:h-[calc(64vh-0px)] h-auto ">
          <div className="flex justify-end">
            <Pagination
              currentPage={doctorPage}
              totalItems={selectedBrick?.doctorList?.length || 0}
              itemsPerPage={doctorLimit}
              onPageChange={(newPage) => setDoctorPage(newPage)}
            />
          </div>
          <div className="bg-white h-[68vh] rounded-[12px] mt-4">
            <table className="w-full border-collapse min-w-[700px]">
              <thead className="sticky top-0 z-[1] h-[56px] bg-white">
                <tr>
                  <th className="border-b border-primary px-5 py-2 text-[12px] font-medium text-heading text-left bg-white">
                    Brick Name
                  </th>{" "}
                  <th className="border-b border-primary px-5 py-2 text-[12px] font-medium text-heading text-left bg-white">
                    City
                  </th>{" "}
                  <th className="border-b border-primary px-5 py-2 text-[12px] font-medium text-heading text-left bg-white">
                    Area’s Name
                  </th>{" "}
                  <th className="border-b border-primary px-5 py-2 text-[12px] font-medium text-heading text-left bg-white">
                    No of Doctors/Pharmacy
                  </th>{" "}
                  <th className="border-b border-primary px-5 py-2 text-[12px] font-medium text-heading text-left bg-white">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {isFetching ? (
                  <Spin indicator={antIcon} />
                ) : ALLbricks.length > 0 ? (
                  ALLbricks.map((doc: any, rowIndex: number) => (
                    <tr
                      key={rowIndex}
                      className="hover:bg-[#E5EBF7] h-[56px] hover:text-black cursor-pointer"
                    >
                      <td className="px-5 py-2 min-w-[120px] border-b-[0.5px] text-[13px] border-primary">
                        {doc.brickName}
                      </td>
                      <td className="px-5 py-2 min-w-[120px] border-b-[0.5px] text-[13px] border-primary">
                        {doc.area}
                      </td>
                      <td className="px-5 py-2 min-w-[120px] border-b-[0.5px] text-[13px] border-primary">
                        {doc.doctorList.map((item: any, index: number) => (
                          <span key={index} className="block">
                            {item.doctor?.name}
                          </span>
                        ))}
                      </td>
                      <td className="px-5 py-2 min-w-[150px] border-b-[0.5px] text-[13px] border-primary">
                        <div className="flex gap-3">
                          {" "}
                          <TbEdit
                            size={18}
                            className="text-primary cursor-pointer"
                            onClick={() => {
                              setEditingProduct(doc);
                              setAddBrickModel(true);
                            }}
                          />
                          <Icon
                            color="#E90761"
                            height="18"
                            width="20"
                            icon="mingcute:delete-fill"
                            onClick={() => {
                              setDeleteConfirmation(true);
                              setdeleteID(doc?._id);
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-3 py-6 text-center text-heading">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {addBrickModel && (
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
                {editingProduct === null ? "Create Bricks" : "Update  Bricks"}
              </p>
              <IoMdCloseCircle
                size={20}
                onClick={() => {
                  setAddBrickModel(false);
                }}
                className="cursor-pointer text-primary"
              />
            </div>
            <p className="text-base font-normal text-[#979797]">
              Define targeted visit strategies for your medical representatives
            </p>
            <form onSubmit={formik.handleSubmit}>
              <div className="flex flex-wrap mt-5 gap-8">
                <div className="md:w-[calc(50%-16px)] w-full">
                  <p className="text-base font-normal text-heading">
                    Brick Details
                  </p>
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
                  </div>
                  <div className="mt-3">
                    <CustomInput
                      label="Brick Name"
                      name="brickName"
                      placeholder="Write the Brick Name"
                      value={formik.values.brickName}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.brickName && formik.errors.brickName && (
                      <div className="text-red-500 text-xs">
                        *{String(formik.errors.brickName)}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <CustomSelect
                      options={selectRouteOptions}
                      value={formik.values.route}
                      onChange={(val) => formik.setFieldValue("route", val)}
                      placeholder="Route Status"
                    />
                    {formik.touched.route && formik.errors.route && (
                      <div className="text-red-500 text-xs">
                        *{String(formik.errors.route)}
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
                      options={selectDaysOptions}
                      value={formik.values.day}
                      onChange={(val) => formik.setFieldValue("day", val)}
                      placeholder="Select Day"
                    />
                    {formik.touched.day && formik.errors.day && (
                      <div className="text-red-500 text-xs">
                        *{String(formik.errors.day)}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <CustomSelectMR
                      options={[
                        ...AllMR.filter(
                          (mr: any) => mr?.position === "MedicalRep(MR)",
                        ).map((mr: any) => ({
                          label: mr.name,
                          value: mr._id,
                        })),
                      ]}
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
                  <div className="mt-3">
                    <MultiSelect
                      options={AllProducts.map((p: any) => p.productName)}
                      value={formik.values.products.map((p: any) => p.name)}
                      onChange={(selectedNames: string[]) =>
                        formik.setFieldValue(
                          "products",
                          selectedNames.map((name) => ({ name })),
                        )
                      }
                      placeholder="Select Products"
                    />

                    {formik.touched.products && formik.errors.products && (
                      <div className="text-red-500 text-xs">
                        *{String(formik.errors.products)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-5">
                <button
                  type="submit"
                  className="h-[55px] md:w-[200px] w-full bg-primary text-white rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
                >
                  {isloading ? (
                    <Spin indicator={antIcon} />
                  ) : editingProduct === null ? (
                    "Create Bricks"
                  ) : (
                    "Update Bricks"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl xl:mx-0 mx-5 w-[500px] h-auto overflow-x-auto xl:p-6 p-4 shadow-xl relative">
            <RiAlertFill className="text-[120px] text-yellow-500 text-center mx-auto mb-2" />
            <div className="text-center">
              <h2 className="text-xl font-semibold text-primary mt-5">
                Confirm Delete
              </h2>
              <p className="mb-6">
                Are you sure you want to delete this <strong>Brick</strong>
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
                disabled={isloadingDelete}
                className="px-7 py-2 bg-[#E90761] text-white rounded flex justify-center items-center"
              >
                {isloadingDelete ? <Spin indicator={antIcon} /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const CustomSelectMR = ({
  options = [],
  value,
  onChange,
  placeholder = "Select MR",
  firstSelected = false,
}: {
  options: { label: string; value: string }[];
  value?: string | null;
  onChange?: (value: string) => void;
  placeholder?: string;
  firstSelected?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(value || null);

  useEffect(() => {
    setSelected(value || null);
  }, [value]);

  useEffect(() => {
    if (firstSelected && options.length > 0 && !value) {
      setSelected(options[0].value);
      onChange?.(options[0].value);
    }
  }, [options, value, onChange, firstSelected]);

  const handleSelect = (option: { label: string; value: string }) => {
    setSelected(option.value);
    onChange?.(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <label className="absolute -top-2 left-5 bg-white px-1 text-xs text-[#7d7d7d]">
        {placeholder}
      </label>
      <div
        className="flex items-center h-14 justify-between bg-white px-4 py-2 border-[0.5px] border-primary rounded-md cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={`text-sm ${selected ? "text-heading" : "text-[#7d7d7d]"}`}
        >
          {selected
            ? options.find((opt) => opt.value === selected)?.label
            : "Select the Options"}
        </span>
        <IoIosArrowDown
          className={`transition-transform duration-200 text-primary ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>
      {isOpen && options.length > 0 && (
        <ul
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          className="absolute mt-1 w-full bg-[#E5EBF7] border border-gray-200 rounded-md shadow-xl z-10 max-h-60 overflow-y-auto"
        >
          {options.map((option, index) => (
            <li
              key={index}
              className={`px-4 flex items-center h-[56px] text-sm cursor-pointer ${
                selected === option.value
                  ? "bg-primary text-white"
                  : "text-heading hover:bg-gray-100"
              }`}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
