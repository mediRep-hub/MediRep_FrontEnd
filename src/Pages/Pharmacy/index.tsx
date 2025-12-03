import { MdAdd, MdFileUpload } from "react-icons/md";
import { useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import CustomInput from "../../Components/CustomInput";
import CustomSelect from "../../Components/Select";
import { useFormik } from "formik";
import ImagePicker from "../../Components/ImagePicker";
import { PharmacySchema } from "../../utils/validation";
import { useQuery } from "@tanstack/react-query";
import { notifyError, notifySuccess } from "../../Components/Toast";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { RiAlertFill } from "react-icons/ri";
import CustomTimePicker from "../../Components/TimeRangePicker";
import Pagination from "../../Components/Pagination";
import { Spin } from "antd";
import LocationPicker from "../../Components/LocationPicker";
import DoctorCard from "../HealthcareProfessionals/DoctorCard";
import {
  addPharmacypost,
  deletePharmacy,
  getAllPharmacies,
  updatePharmacy,
} from "../../api/pharmacyServices";
import PharmacyUploads from "../../Components/PharmacyUploads";

interface Pharmacy {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  affiliation: string;
  image?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  region?: string;
  area?: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
}

const regionOptions = ["Sindh", "North Punjab", "Kashmir", "South Punjab"];
const areaOptions = ["Lahore", "Islamabad", "Bahawalpur", "Karachi"];

export default function Pharmacies() {
  const [addPharmacy, setAddPharmacy] = useState<boolean>(false);
  const [editingPharmacy, setEditingPharmacy] = useState<Pharmacy | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deleteID, setDeleteID] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);
  const [isLoadingDelete, setLoadingDelete] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["AllPharmacies", currentPage],
    queryFn: () =>
      getAllPharmacies({
        page: currentPage,
        limit: itemsPerPage,
      }),
    placeholderData: (previous) => previous,
  });

  const pharmaciesList: Pharmacy[] = data?.data?.data || [];
  const totalItems = data?.data.total;
  const paginatedPharmacies = pharmaciesList;

  useEffect(() => {
    document.title = "MediRep | Pharmacies";
  }, []);

  const handleEditPharmacy = (pharmacy: Pharmacy) => {
    if (!pharmacy) return;
    setEditingPharmacy(pharmacy);
    setAddPharmacy(true);

    formik.setValues({
      name: pharmacy.name || "",
      email: pharmacy.email || "",
      phone: pharmacy.phone || "",
      startTime: pharmacy.startTime || "",
      endTime: pharmacy.endTime || "",
      region: pharmacy.region || "",
      area: pharmacy.area || "",
      affiliation: pharmacy.affiliation || "",
      image: pharmacy.image || null,
      location: pharmacy.location || { address: "", lat: 0, lng: 0 },
    });
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: editingPharmacy?.name || "",
      email: editingPharmacy?.email || "",
      phone: editingPharmacy?.phone || "",
      startTime: editingPharmacy?.startTime || "",
      endTime: editingPharmacy?.endTime || "",
      affiliation: editingPharmacy?.affiliation || "",
      region: editingPharmacy?.region || "",
      area: editingPharmacy?.area || "",
      image: editingPharmacy?.image || null,
      location: editingPharmacy?.location || { address: "", lat: 0, lng: 0 },
    },
    validationSchema: PharmacySchema,
    onSubmit: (values) => {
      setLoading(true);
      const cleanedValues = {
        ...values,
        image: typeof values.image === "object" ? "" : values.image,
      };

      if (editingPharmacy && editingPharmacy._id) {
        updatePharmacy(editingPharmacy._id, cleanedValues)
          .then(() => {
            notifySuccess("Pharmacy updated successfully");
            setAddPharmacy(false);
            setEditingPharmacy(null);
            formik.resetForm();
            refetch();
          })
          .catch((error) => {
            console.error(
              "Error updating Pharmacy:",
              error.response?.data || error
            );
            notifyError("Failed to update Pharmacy. Please try again.");
          })
          .finally(() => setLoading(false));
      } else {
        addPharmacypost({ ...cleanedValues })
          .then(() => {
            notifySuccess("Pharmacy added successfully");
            setAddPharmacy(false);
            formik.resetForm();
            refetch();
          })
          .catch((error) => {
            console.error(
              "Error adding Pharmacy:",
              error.response?.data || error
            );
            notifyError("Failed to add Pharmacy. Please try again.");
          })
          .finally(() => setLoading(false));
      }
    },
  });
  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 24, color: "white" }} spin />
  );
  const antIcon22 = (
    <Loading3QuartersOutlined style={{ fontSize: 50, color: "#0755E9" }} spin />
  );

  const handleDelete = async () => {
    setLoadingDelete(true);
    deletePharmacy(deleteID)
      .then(() => {
        notifySuccess("Pharmacy deleted successfully");
        setDeleteConfirmation(false);
        setAddPharmacy(false);
        setEditingPharmacy(null);
        const newTotalItems = totalItems - 1;
        const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);
        if (currentPage > newTotalPages) setCurrentPage(newTotalPages);
        refetch();
      })
      .catch((error) => {
        console.error("Failed to delete Pharmacy:", error);
        notifyError("Failed to delete Pharmacy. Please try again.");
      })
      .finally(() => {
        setLoadingDelete(false);
      });
  };

  return (
    <>
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap md:flex-nowrap justify-between items-start gap-4">
          <p className="text-heading font-medium text-[22px] lg:text-[24px]">
            Pharmacies
          </p>
          <div className="flex flex-wrap sm:flex-nowrap gap-4 items-center">
            <button
              onClick={() => setOpenModal(true)}
              className="h-[55px] w-full min-w-[172px] bg-white rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
            >
              <MdFileUpload size={20} color="#7D7D7D" />
              <p className="text-heading text-base font-medium">Bulk Upload</p>
            </button>
            <button
              onClick={() => setAddPharmacy(true)}
              className="h-[55px] w-full min-w-[192px] bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
            >
              <MdAdd size={20} color="#fff" />
              <p className="text-white text-base font-medium">
                Upload Pharmacy
              </p>
            </button>
          </div>
        </div>

        <div
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(90vh-126px)] h-[calc(90vh-160px)] overflow-y-auto scrollbar-none"
        >
          <div className="flex justify-between items-center">
            <p className="text-[#7D7D7D] font-medium text-sm">
              Pharmacy Profiles
            </p>
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>

          {isFetching ? (
            <div className="py-5 text-center text-[#7d7d7d]">
              <Spin indicator={antIcon22} />
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-3 mt-4">
              {paginatedPharmacies.map((pharmacy: any, index: number) => (
                <DoctorCard
                  key={index}
                  doctor={pharmacy}
                  onEdit={() => handleEditPharmacy(pharmacy)}
                  setdeleteID={setDeleteID}
                  setAddDoctor={setAddPharmacy}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {addPharmacy && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-40">
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="bg-white rounded-xl xl:mx-0 mx-5 w-[1000px] max-h-[90vh] overflow-x-auto xl:p-6 p-4 shadow-xl relative"
          >
            <div className="flex items-center justify-between">
              <p className="text-[24px] text-heading capitalize font-semibold">
                {editingPharmacy ? "Edit Pharmacy" : "Upload Pharmacy"}
              </p>

              <IoMdCloseCircle
                size={20}
                onClick={() => {
                  setAddPharmacy(false);
                  setEditingPharmacy(null);
                  formik.resetForm();
                }}
                className="cursor-pointer text-primary"
              />
            </div>

            <form onSubmit={formik.handleSubmit} className="mt-5">
              <div className="flex flex-wrap items-start gap-4">
                <div className="xl:w-[calc(50%-8px)] w-full">
                  <p className="text-heading text-base">Pharmacy Details</p>

                  <div className="mt-4">
                    <CustomInput
                      id="name"
                      name="name"
                      label="Pharmacy Name"
                      placeholder="Pharmacy Name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <div className="text-red-500 text-xs">
                        *{formik.errors.name}
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <CustomInput
                      id="email"
                      name="email"
                      label="Email"
                      placeholder="Enter email here"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="text-red-500 text-xs">
                        *{formik.errors.email}
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <CustomInput
                      id="phone"
                      name="phone"
                      label="Phone Number"
                      placeholder="e.g, +92-321-123-4567"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.phone && formik.errors.phone && (
                      <div className="text-red-500 text-xs">
                        *{formik.errors.phone}
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <ImagePicker
                      label="Upload Image"
                      placeholder="Upload Your Image"
                      fileType="Pharmacies"
                      type="image"
                      value={formik.values.image || ""}
                      onChange={(val) => formik.setFieldValue("image", val)}
                    />
                    {formik.touched.image && formik.errors.image && (
                      <div className="text-red-500 text-xs">
                        *{formik.errors.image}
                      </div>
                    )}
                  </div>
                </div>
                <div className="xl:w-[calc(50%-8px)] w-full">
                  <p className="text-heading text-base">Set Pharmacy Details</p>
                  <div className="mt-4">
                    <LocationPicker
                      label="Pick Location"
                      value={formik.values.location.address}
                      placeholder="Enter address"
                      onChange={(address, lat, lng) => {
                        formik.setFieldValue("location", { address, lat, lng });
                      }}
                    />
                    {formik.touched.location?.address &&
                      formik.errors.location?.address && (
                        <div className="text-red-500 text-xs">
                          *{formik.errors.location.address}
                        </div>
                      )}
                  </div>
                  <div className="mt-4 flex gap-3">
                    <div className="w-full">
                      <CustomTimePicker
                        value={formik.values.startTime}
                        onChange={(val) =>
                          formik.setFieldValue("startTime", val)
                        }
                        placeholder="Start Time"
                      />
                    </div>

                    <div className="w-full">
                      <CustomTimePicker
                        value={formik.values.endTime}
                        onChange={(val) => formik.setFieldValue("endTime", val)}
                        placeholder="End Time"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <CustomSelect
                      options={regionOptions}
                      value={formik.values.region}
                      onChange={(val) => formik.setFieldValue("region", val)}
                      placeholder="Region"
                    />
                  </div>
                  <div className="mt-4">
                    <CustomSelect
                      options={areaOptions}
                      value={formik.values.area}
                      onChange={(val) => formik.setFieldValue("area", val)}
                      placeholder="Area"
                    />
                  </div>
                  <div className="mt-4">
                    <CustomInput
                      id="affiliation"
                      name="affiliation"
                      label="Affiliation"
                      placeholder="Write your affiliation here..."
                      height="128px"
                      value={formik.values.affiliation}
                      onChange={formik.handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 flex-wrap justify-end mt-5">
                {editingPharmacy && (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmation(true)}
                    className="h-[55px] mr-auto md:w-[200px] w-full bg-red-600 text-white rounded-[6px] flex justify-center items-center"
                  >
                    Delete
                  </button>
                )}

                <button
                  type="submit"
                  className="h-[55px] md:w-[200px] w-full bg-primary text-white rounded-[6px] flex justify-center items-center"
                >
                  {isLoading ? (
                    <Spin indicator={antIcon} />
                  ) : editingPharmacy ? (
                    "Update"
                  ) : (
                    "Add"
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
                Are you sure you want to delete this <strong>Pharmacy</strong>?
              </p>
            </div>
            <div className="flex mt-5 justify-between gap-4">
              <button
                onClick={() => setDeleteConfirmation(false)}
                className="px-7 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-7 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                {isLoadingDelete ? <Spin indicator={antIcon} /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {openModal && (
        <PharmacyUploads closeModle={setOpenModal} refetch={refetch} />
      )}
    </>
  );
}
