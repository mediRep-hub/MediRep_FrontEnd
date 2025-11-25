import { useEffect, useState } from "react";
import { MdAdd, MdDeleteOutline } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp, IoMdCloseCircle } from "react-icons/io";
import CustomInput from "../../Components/CustomInput";
import CustomSelect from "../../Components/Select";
import { useFormik } from "formik";
import { StrategySchema } from "../../utils/validation";
import MultiSelect from "../../Components/MultiSelect";
import { useQuery } from "@tanstack/react-query";
import { getAllDoctorsLIst } from "../../api/doctorServices";
import { RiAlertFill } from "react-icons/ri";
import { notifyError, notifySuccess } from "../../Components/Toast";
import { Avatar, Spin } from "antd";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { getAllAccounts } from "../../api/adminServices";
import {
  addReport,
  deleteReports,
  getAllReports,
  reorderDoctorList,
  updateReports,
} from "../../api/callReporting";
import { FiClock } from "react-icons/fi";
import { BiMessageDetail } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import Pagination from "../../Components/Pagination";
import { SearchSelection } from "../../Components/SearchBar/SearchSelection";
import SearchDateRange from "../../Components/SearchBar/SearchDateRange";

const areaOptions: string[] = [
  "All",
  "Lahore",
  "Islamabad",
  "BahawalPur",
  "Karachi",
];

const titles = [
  "Call ID",
  "Doctor Name",
  "Status",
  "Check in",
  "Check out",
  "Actions",
];

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

export default function CallReporting() {
  const [addStrategyModel, setAddStrategyModel] = useState(false);
  const [viewDetails, SetViewdetails] = useState(false);
  const [selectedMR, setSelectedMR] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<{
    start: string;
    end: string;
  }>({
    start: "",
    end: "",
  });

  const [isloadinOrder, setLoadingOrder] = useState(false);
  const [page, setPage] = useState(1);
  const [doctorPage, setDoctorPage] = useState(1);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [isloading, setLoading] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<any>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isloadingDelete, setLoadingDelete] = useState(false);
  const [doctorList, setDoctorList] = useState<any[]>([]);

  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 24, color: "white" }} spin />
  );
  const antIcon22 = (
    <Loading3QuartersOutlined style={{ fontSize: 50, color: "#0755E9" }} spin />
  );
  const capitalize = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const limit = 10;
  const doctorLimit = 10;

  const navigate = useNavigate();
  const { data: doctorss } = useQuery({
    queryKey: ["AllDoctors"],
    queryFn: () => getAllDoctorsLIst(),
  });
  const { data: allMr } = useQuery({
    queryKey: ["AllAccount"],
    queryFn: () => getAllAccounts(),
    staleTime: 5 * 60 * 1000,
  });
  const AllMR = allMr?.data?.admins ?? [];
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
        selectedDate.start || undefined, // send undefined if not selected
        selectedDate.end || undefined,
        capitalize(selectedArea?.toLowerCase())
      ),
    placeholderData: (previous) => previous,
  });

  const handleFilter = () => {
    if (selectedMR === "All") setSelectedMR("");
    if (selectedArea === "All") setSelectedArea("");

    setSelectedArea((prev) => prev?.toLowerCase());
  };

  let AllStrategy = result?.data;
  const AllDOctors = Array.isArray(doctorss?.data?.data)
    ? doctorss.data?.data
    : [];

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      region: editingProduct?.region || "",
      area: editingProduct?.area || "",
      strategyName: editingProduct?.strategyName || "",
      route: editingProduct?.route || "",
      day: editingProduct?.day || "",
      mrName: editingProduct?.mrName?.name || "",
      doctorList: editingProduct?.doctorList?.map((doc: any) => doc.name) || [],
    },
    validationSchema: StrategySchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const selectedMR = AllMR?.find((mr: any) => mr._id === values.mrName);
        if (!selectedMR) {
          notifyError("MR not found");
          setLoading(false);
          return;
        }

        const doctorIds = AllDOctors?.filter((doc: any) =>
          values.doctorList.includes(doc.name)
        )?.map((doc: any) => doc._id);

        const payload = {
          ...values,
          mrName: values.mrName,
          doctorList: doctorIds,
        };

        if (editingProduct) {
          await updateReports(editingProduct._id, payload);
          notifySuccess("Strategy updated successfully");
          setEditingProduct(null);
        } else {
          await addReport(payload);
          notifySuccess("Strategy added successfully");
        }

        setAddStrategyModel(false);
        formik.resetForm();
        refetch();
      } catch (error: any) {
        console.error(error);
        notifyError(error.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
  });
  const handleDelete = async () => {
    setLoadingDelete(true);
    try {
      await deleteReports(editingProduct._id);
      notifySuccess("Strategy deleted successfully");
      refetch();
    } catch (error) {
      console.error(error);
      notifyError("Failed to delete Strategy. Please try again.");
    } finally {
      setLoadingDelete(false);
      setDeleteConfirmation(false);
    }
  };
  useEffect(() => {
    if (AllStrategy && AllStrategy.length > 0)
      setSelectedStrategy(AllStrategy[0]);
  }, [AllStrategy]);
  useEffect(() => {
    if (!selectedStrategy) return;
    const doctors = selectedStrategy.doctorList || [];
    const start = (doctorPage - 1) * doctorLimit;
    const paginatedDoctors = doctors.slice(start, start + doctorLimit);
    setDoctorList(paginatedDoctors);
  }, [selectedStrategy, doctorPage]);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...doctorList];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setDoctorList(updated);
  };

  const moveDown = (index: number) => {
    if (index === doctorList.length - 1) return;
    const updated = [...doctorList];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setDoctorList(updated);
  };

  const handleGoTODetails = (doctor: any) => {
    if (!selectedStrategy) return;
    const plainDoctor = {
      _id: doctor._id,
      callId: doctor.callId,
      name: doctor.doctor?.name || doctor.name || "--",
      address: doctor.doctor?.address || "--",
      duration: doctor.duration || "--",
      productDiscussed: doctor.productDiscussed || "--",
      doctorResponse: doctor.doctorResponse || "--",
      promotionalMaterialGiven: doctor.promotionalMaterialGiven || "--",
      followUpRequired: doctor.followUpRequired || "--",
      doctorPurchaseInterest: doctor.doctorPurchaseInterest || "--",
      keyDiscussionPoints: doctor.keyDiscussionPoints || "--",
      doctorConcerns: doctor.doctorConcerns || "--",
      checkIn: doctor.checkIn || "--",
      checkOut: doctor.checkOut || "--",
      status: doctor.status || "--",
      strategyName: selectedStrategy.strategyName,
      mrName: selectedStrategy.mrName?.name,
      mrId: selectedStrategy.mrName?.adminId,
      mrImage: selectedStrategy.mrName?.image,
      date: selectedStrategy?.createdAt,
      checkInLocation: doctor?.checkInLocation,
      nextVisitDate: doctor?.nextVisitDate,
    };
    navigate("/callReporting/details", { state: { doctor: plainDoctor } });
  };

  return (
    <>
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap gap-4 justify-between items-start">
          <p className="text-heading w-full lg:w-auto font-medium text-[22px] sm:text-[24px]">
            Strategies
          </p>
          <div className="flex flex-wrap w-auto md:w-full lg:w-auto items-center gap-3">
            <div className="lg:w-[200px] 2xl:w-[300px] md:w-[calc(33%-8px)] w-full">
              <SearchSelection
                placeholder="Select MR"
                options={[
                  "All",
                  ...AllMR.filter(
                    (mr: any) => mr?.position === "MedicalRep(MR)"
                  ).map((mr: any) => mr?.name),
                ]}
                value={selectedMR}
                onChange={(val) => {
                  setSelectedMR(val);
                  handleFilter();
                }}
              />
            </div>{" "}
            <div className="lg:w-[200px] 2xl:w-[300px] md:w-[calc(33%-8px)] w-full">
              <SearchSelection
                placeholder="Select Area"
                options={areaOptions}
                value={selectedArea}
                onChange={(val) => {
                  setSelectedArea(val);
                  handleFilter();
                }}
              />
            </div>{" "}
            <div className="lg:w-[200px] 2xl:w-[300px] md:w-[calc(33%-8px)] w-full">
              <SearchDateRange
                onChange={(range: { start: string; end: string }) => {
                  setSelectedDate(range);
                }}
              />
            </div>
          </div>
          <button
            onClick={() => {
              setAddStrategyModel(true);
              setEditingProduct(null);
            }}
            className="h-[55px] w-full md:w-[200px] bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
          >
            <MdAdd size={20} color="#fff" />{" "}
            <p className="text-white text-base font-medium">
              Create Strategies
            </p>
          </button>
        </div>

        <div className="bg-[#E5EBF7] flex-wrap flex gap-4 mt-4 rounded-[12px] p-4 2xl:h-[calc(90vh-127px)] xl:h-[calc(90vh-163px)] h-auto ">
          <div className="lg:w-[calc(20%-8px)] w-full">
            <div className="flex justify-between items-center">
              <p className="text-[#7D7D7D] font-medium text-sm">
                Strategies List
              </p>
              <Pagination
                currentPage={page}
                totalItems={result?.totalItems}
                itemsPerPage={limit}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </div>
            {isFetching ? (
              <div className="mt-5 flex justify-center">
                {" "}
                <Spin indicator={antIcon22} />
              </div>
            ) : (
              <div
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                className="scroll-smooth 2xl:h-[calc(85vh-142px)] xl:h-[calc(65vh-55px)] mt-4 overflow-y-auto scrollbar-none"
              >
                {AllStrategy?.map((mr: any, index: number) => (
                  <div
                    key={mr._id || index}
                    className={`bg-white p-5 first:mt-0 mt-4 rounded-xl cursor-pointer ${
                      selectedStrategy?._id === mr._id
                        ? "border-2 border-primary"
                        : "border-2 border-white"
                    }`}
                    onClick={() => {
                      setSelectedStrategy(mr);
                      setDoctorPage(1);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <Avatar size={42} src={mr?.mrName?.image} />
                      <div className="flex items-center gap-2">
                        <MdDeleteOutline
                          size={18}
                          className="text-red-600 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmation(true);
                            setEditingProduct(mr);
                          }}
                        />
                      </div>
                    </div>
                    <p className="text-[#131313] capitalize text-sm mt-3">
                      {typeof mr.mrName === "string"
                        ? mr.mrName
                        : mr.mrName?.name || "--"}
                    </p>
                    <p className="text-primary text-sm ">
                      MR ID: {mr?.mrName?.adminId}
                    </p>
                    <p className="text-[#131313] text-sm ">
                      Strategy Name: {mr.strategyName}
                    </p>
                    <p className="text-[#131313] text-sm ">
                      MR Status:{" "}
                      <span className="text-primary">
                        {mr?.mrStatus?.completedCalls}
                      </span>
                      /{mr?.mrStatus?.totalCalls}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="lg:w-[calc(80%-8px)] w-full">
            <div className="flex justify-between items-center">
              <p className="text-[#7D7D7D] font-medium text-sm">Call List</p>
              <Pagination
                currentPage={doctorPage}
                totalItems={selectedStrategy?.doctorList?.length || 0}
                itemsPerPage={doctorLimit}
                onPageChange={(newPage) => setDoctorPage(newPage)}
              />
            </div>

            <div
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(85vh-142px)] xl:h-[calc(65vh-55px)] mt-4 overflow-y-auto scrollbar-none"
            >
              <table className="w-full border-collapse min-w-[800px]">
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
                        onClick={() => handleGoTODetails(doc)}
                      >
                        <td className="px-5 py-2 min-w-[200px] border-b-[0.5px] text-[13px] border-primary">
                          {doc.callId}
                        </td>
                        <td className="px-5 py-2 min-w-[150px] border-b-[0.5px] text-[13px] border-primary">
                          {doc.doctor?.name || "--"}
                        </td>
                        <td className="px-5 py-2 min-w-[150px] border-b-[0.5px] text-[13px] border-primary">
                          <p
                            className={`inline-block px-2 py-1 capitalize  rounded-md font-medium text-sm border ${
                              doc.status === "pending"
                                ? "text-[#E90761] border-[#E90761]"
                                : doc.status === "close"
                                ? "text-[#0BA69C] border-[#0BA69C]"
                                : doc.status === "rejected"
                                ? "text-[#FF9500] border-[#FF9500]"
                                : "text-heading border-heading"
                            }`}
                          >
                            {doc.status}
                          </p>
                        </td>
                        <td className="px-5 py-2 min-w-[150px] border-b-[0.5px] text-[13px] border-primary">
                          <div className="flex gap-3">
                            <FiClock
                              size={16}
                              className="inline text-[#7d7d7d]"
                            />{" "}
                            {doc.checkIn || "--"}
                          </div>
                        </td>
                        <td className="px-5 py-2 min-w-[150px] border-b-[0.5px] text-[13px] border-primary">
                          <div className="flex gap-3">
                            <FiClock
                              size={16}
                              className="inline text-[#7d7d7d]"
                            />{" "}
                            {doc.checkOut || "--"}
                          </div>
                        </td>
                        <td className="px-5 py-2 min-w-[150px] border-b-[0.5px] text-[13px] border-primary">
                          <div
                            className="flex gap-3"
                            onClick={(e) => {
                              SetViewdetails(true);
                              e.stopPropagation();
                            }}
                          >
                            <BiMessageDetail
                              size={16}
                              className="inline text-[#7d7d7d]"
                            />{" "}
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
      </div>{" "}
      {addStrategyModel && (
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
                {editingProduct === null
                  ? "Create Strategy"
                  : "Update  Strategy"}
              </p>
              <IoMdCloseCircle
                size={20}
                onClick={() => {
                  setAddStrategyModel(false);
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
                    Strategy Details
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
                      label="Strategy Name"
                      name="strategyName"
                      placeholder="e.g, Cardiology Focus"
                      value={formik.values.strategyName}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.strategyName &&
                      formik.errors.strategyName && (
                        <div className="text-red-500 text-xs">
                          *{String(formik.errors.strategyName)}
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
                          (mr: any) => mr?.position === "MedicalRep(MR)"
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
                    "Create Strategy"
                  ) : (
                    "Update Strategy"
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
                Are you sure you want to delete this <strong>Strategy</strong>
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
                className="px-7 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex justify-center items-center"
              >
                {isloadingDelete ? <Spin indicator={antIcon} /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      {viewDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="bg-white rounded-xl xl:mx-0 mx-5 w-[700px] max-h-[90vh] overflow-x-auto xl:p-6 p-4 shadow-xl relative"
          >
            <div className="flex justify-between items-center">
              <p className="text-[24px] font-medium">Doctor List</p>
              <IoMdCloseCircle
                size={20}
                onClick={() => {
                  SetViewdetails(false);
                }}
                className="cursor-pointer text-primary"
              />
            </div>
            <div className="space-y-3">
              {doctorList.length > 0 ? (
                doctorList.map((docItem: any, index: number) => (
                  <div
                    key={index}
                    className="p-3 flex justify-between border mt-5 rounded-lg hover:bg-gray-50 transition"
                  >
                    <p className="text-sm font-medium text-heading">
                      {docItem?.doctor?.name ||
                        docItem?.name ||
                        "Unnamed Doctor"}
                    </p>

                    <div className="flex gap-1">
                      <button
                        onClick={() => moveUp(index)}
                        className={`p-1 rounded-md ${
                          index === 0
                            ? "opacity-40 cursor-not-allowed"
                            : "hover:bg-gray-200"
                        }`}
                        disabled={index === 0}
                      >
                        <IoIosArrowUp />
                      </button>
                      <button
                        onClick={() => moveDown(index)}
                        className={`p-1 rounded-md ${
                          index === doctorList.length - 1
                            ? "opacity-40 cursor-not-allowed"
                            : "hover:bg-gray-200"
                        }`}
                        disabled={index === doctorList.length - 1}
                      >
                        <IoIosArrowDown />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[#7d7d7d] text-sm text-center">
                  No doctors found for this strategy.
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                className="bg-primary text-white mt-5 ml-auto w-[150px] h-[50px] cursor-pointer rounded-lg"
                onClick={async () => {
                  try {
                    setLoadingOrder(true);
                    const doctorIds = doctorList
                      .map((doc: any) => doc.doctor?._id)
                      .filter(Boolean);

                    if (doctorIds.length === 0) {
                      notifyError("No doctor IDs to save.");
                      return;
                    }

                    console.log("Sending doctor IDs:", doctorIds);

                    await reorderDoctorList(selectedStrategy._id, {
                      orderedDoctorIds: doctorIds,
                    });

                    notifySuccess("Doctor order updated successfully");
                    refetch();
                    SetViewdetails(false);
                  } catch (error) {
                    console.error(error);
                    notifyError("Failed to update order");
                  } finally {
                    setLoadingOrder(false);
                  }
                }}
              >
                {isloadinOrder ? <Spin indicator={antIcon} /> : " Save"}
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
