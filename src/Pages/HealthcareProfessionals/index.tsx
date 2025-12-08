import { useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import CustomInput from "../../Components/CustomInput";
import DoctorCard from "./DoctorCard";
import CustomSelect from "../../Components/Select";
import { useFormik } from "formik";
import ImagePicker from "../../Components/ImagePicker";
import { DoctorSchema } from "../../utils/validation";
import { useQuery } from "@tanstack/react-query";
import {
  addDoctors,
  deleteDoctor,
  getAllDoctors,
  updateDoctor,
} from "../../api/doctorServices";
import { notifyError, notifySuccess } from "../../Components/Toast";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { RiAlertFill } from "react-icons/ri";
import CustomTimePicker from "../../Components/TimeRangePicker";
import DoctorUploads from "../../Components/DoctorsUpload";
import Pagination from "../../Components/Pagination";
import { Spin } from "antd";
import LocationPicker from "../../Components/LocationPicker";
import { Icon } from "@iconify/react";

interface Doctor {
  _id?: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  value?: [string, string] | null;
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
const specialtyOptions = [
  "All",
  "Cardiologist",
  "Dermatologist",
  "Endocrinologist",
  "Gastroenterologist",
  "Family Doctor",
];
const regionOptions = ["Sindh", "North Punjab", "Kashmir", "South Punjab"];
const areaOptions = ["Lahore", "Islamabad", "Bahawalpur", "Karachi"];

export default function HealthcareProfessionals() {
  const [addDoctor, setAddDoctor] = useState<boolean>(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deleteID, setdeleteID] = useState<any>(null);
  const [isloading, setLoading] = useState(false);
  const [isloadingDelete, setLoadingDelete] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["AllDoctors", currentPage],
    queryFn: () => getAllDoctors({ page: currentPage, limit: itemsPerPage }),
    placeholderData: (previous) => previous,
  });

  const doctorsList: Doctor[] = data?.data?.data || [];
  const totalItems = data?.data.total;

  const paginatedDoctors = doctorsList;

  useEffect(() => {
    document.title = "MediRep | Healthcare Professionals";
  }, []);

  const handleEditDoctor = (doctor: Doctor) => {
    if (!doctor) return;

    setEditingDoctor(doctor);
    setAddDoctor(true);

    formik.setValues({
      name: doctor.name || "",
      specialty: doctor.specialty || "",
      email: doctor.email || "",
      phone: doctor.phone || "",
      startTime: doctor.startTime || "",
      endTime: doctor.endTime || "",
      region: doctor.region || "",
      area: doctor.area || "",
      affiliation: doctor.affiliation || "",
      image: doctor.image || null,
      location: doctor.location || { address: "", lat: 0, lng: 0 },
    });
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: editingDoctor?.name || "",
      specialty: editingDoctor?.specialty || "",
      email: editingDoctor?.email || "",
      phone: editingDoctor?.phone || "",
      startTime: editingDoctor?.startTime || "",
      endTime: editingDoctor?.endTime || "",
      affiliation: editingDoctor?.affiliation || "",
      region: editingDoctor?.region || "",
      area: editingDoctor?.area || "",
      image: editingDoctor?.image || null,
      location: editingDoctor?.location || { address: "", lat: 0, lng: 0 },
    },
    validationSchema: DoctorSchema,
    onSubmit: (values) => {
      setLoading(true);
      const cleanedValues = {
        ...values,
        image: typeof values.image === "object" ? "" : values.image,
      };

      if (editingDoctor && editingDoctor._id) {
        updateDoctor(editingDoctor._id, cleanedValues)
          .then(() => {
            notifySuccess("Profile updated successfully");
            setAddDoctor(false);
            setEditingDoctor(null);
            formik.resetForm();
            refetch();
          })
          .catch((error) => {
            console.error(
              "Error updating Profile:",
              error.response?.data || error
            );
            const errorMessage =
              error?.response?.data?.message ||
              error?.response?.data ||
              error?.message ||
              "An unexpected error occurred.";

            notifyError(
              `Failed to update Profile. Please try again. ${errorMessage}`
            );
            notifyError(error.response?.data.message);
          })
          .finally(() => setLoading(false));
      } else {
        addDoctors(cleanedValues)
          .then(() => {
            notifySuccess("Profile added successfully");
            setAddDoctor(false);
            formik.resetForm();
            refetch();
          })
          .catch((error) => {
            console.error(
              "Error adding Profile:",
              error.response?.data || error
            );
            refetch();
            notifyError("Failed to add Profile. Please try again.");
            notifyError(error.response?.data.message);
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
    deleteDoctor(deleteID)
      .then(() => {
        notifySuccess("Doctor deleted successfully");
        setDeleteConfirmation(false);
        setAddDoctor(false);
        setEditingDoctor(null);
        const newTotalItems = totalItems - 1;
        const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);
        if (currentPage > newTotalPages) setCurrentPage(newTotalPages);
        refetch();
      })
      .catch((error) => {
        console.error("Failed to delete doctor:", error);
        notifyError("Failed to delete doctor. Please try again.");
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
            Healthcare Professionals
          </p>
          <div className="flex flex-wrap sm:flex-nowrap gap-4 items-center">
            <button
              onClick={() => setOpenModal(true)}
              className="h-[55px] w-full min-w-[172px] bg-white rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
            >
              <Icon
                icon="ic:round-upload"
                height="20"
                width="20"
                color="#7D7D7D"
              />
              <p className="text-heading text-base font-medium">Bulk Upload</p>
            </button>
            <button
              onClick={() => setAddDoctor(true)}
              className="h-[55px] w-full min-w-[192px] bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
            >
              <Icon
                icon="mingcute:add-fill"
                height="20"
                width="20"
                color="#fff"
              />
              <p className="text-white text-base font-medium">
                Upload Profiles
              </p>
            </button>
          </div>
        </div>

        <div
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(76vh-0px)] xl:h-[calc(64vh-0px)] overflow-y-auto scrollbar-none"
        >
          <div className="flex justify-between items-center">
            <p className="text-[#7D7D7D] font-medium text-sm">
              Doctors Profile
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
          ) : paginatedDoctors.length === 0 ? (
            <p className="text-center text-heading py-5">No data found</p>
          ) : (
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-3 mt-4">
              {paginatedDoctors.map((doc: any, index: number) => (
                <DoctorCard
                  key={index}
                  doctor={doc}
                  onEdit={() => handleEditDoctor(doc)}
                  setdeleteID={setdeleteID}
                  setAddDoctor={setAddDoctor}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {addDoctor && (
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
                {editingDoctor ? "Edit Profile" : "Upload Profile"}
              </p>

              <IoMdCloseCircle
                size={20}
                onClick={() => {
                  setAddDoctor(false);
                  setEditingDoctor(null);
                  formik.resetForm();
                }}
                className="cursor-pointer text-primary"
              />
            </div>

            <form onSubmit={formik.handleSubmit} className="mt-5">
              <div className="flex flex-wrap items-start gap-4">
                <div className="xl:w-[calc(50%-8px)] w-full">
                  <p className="text-heading text-base">Profile Details</p>

                  <div className="mt-4">
                    <CustomInput
                      id="name"
                      name="name"
                      label="Profile Name"
                      placeholder="Paul Walker"
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
                    <CustomSelect
                      options={specialtyOptions}
                      value={formik.values.specialty}
                      onChange={(val) => formik.setFieldValue("specialty", val)}
                      placeholder="Specialty"
                    />
                    {formik.touched.specialty && formik.errors.specialty && (
                      <div className="text-red-500 text-xs">
                        *{formik.errors.specialty}
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
                      fileType="Doctors"
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
                  <p className="text-heading text-base">Set Profile</p>
                  <div className="mt-4">
                    <LocationPicker
                      label="Pick Location"
                      value={formik.values.location.address}
                      placeholder="Enter your address"
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
                      />{" "}
                      {formik.touched.startTime && formik.errors.startTime && (
                        <div className="text-red-500 text-xs">
                          *{formik.errors.startTime}
                        </div>
                      )}
                    </div>

                    <div className="w-full">
                      <CustomTimePicker
                        value={formik.values.endTime}
                        onChange={(val) => formik.setFieldValue("endTime", val)}
                        placeholder="End Time"
                      />{" "}
                      {formik.touched.endTime && formik.errors.endTime && (
                        <div className="text-red-500 text-xs">
                          *{formik.errors.endTime}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <CustomSelect
                      options={regionOptions}
                      value={formik.values.region}
                      onChange={(val) => formik.setFieldValue("region", val)}
                      placeholder="Region"
                    />
                    {formik.touched.region && formik.errors.region && (
                      <div className="text-red-500 text-xs">
                        *{formik.errors.region}
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <CustomSelect
                      options={areaOptions}
                      value={formik.values.area}
                      onChange={(val) => formik.setFieldValue("area", val)}
                      placeholder="Area"
                    />
                    {formik.touched.area && formik.errors.area && (
                      <div className="text-red-500 text-xs">
                        *{formik.errors.area}
                      </div>
                    )}
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

                    {formik.touched.affiliation &&
                      formik.errors.affiliation && (
                        <div className="text-red-500 text-xs">
                          *{formik.errors.affiliation}
                        </div>
                      )}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 flex-wrap justify-end mt-5">
                {editingDoctor && (
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteConfirmation(true);
                    }}
                    className="h-[55px] mr-auto md:w-[200px] w-full bg-[#E90761] text-white rounded-[6px] flex justify-center items-center"
                  >
                    Delete
                  </button>
                )}

                <button
                  type="submit"
                  className="h-[55px] md:w-[200px] w-full bg-primary text-white rounded-[6px] flex justify-center items-center"
                >
                  {isloading ? (
                    <Spin indicator={antIcon} />
                  ) : editingDoctor ? (
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
                Are you sure you want to delete this <strong>Profiles</strong>
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
                className="px-7 py-2 bg-[#E90761] text-white rounded"
              >
                {isloadingDelete ? <Spin indicator={antIcon} /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {openModal && (
        <DoctorUploads closeModle={setOpenModal} refetch={refetch} />
      )}
    </>
  );
}
