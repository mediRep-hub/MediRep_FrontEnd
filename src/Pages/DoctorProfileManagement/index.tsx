import { MdAdd, MdFileUpload } from "react-icons/md";
import { useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import CustomInput from "../../Components/CustomInput";
import DoctorCard from "./DoctorCard";
import UploadFile from "../../Components/Upload File";
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
import { Spin } from "antd";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { RiAlertFill } from "react-icons/ri";
import CustomTimePicker from "../../Components/TimeRangePicker";
interface Doctor {
  _id?: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  address: string;
  value?: [string, string] | null;
  affiliation: string;
  image?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  region?: string;
  area?: string;
}

const specialtyOptions = [
  "Cardiologist",
  "Dermatologist",
  "Endocrinologist",
  "Gastroenterologist",
  "Family Doctor",
];
const regionOptions = ["Sindh", "North Punjab", "Kashmir", "South Punjab"];
const areaOptions = ["Lahore", "Islamabad", "Bahawalpur ", "Karachi"];
export default function DoctorProfileManagement() {
  const [addDoctor, setAddDoctor] = useState<boolean>(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deleteID, setdeleteID] = useState<any>(null);
  const [isloading, setLoading] = useState(false);
  const { data, refetch } = useQuery({
    queryKey: ["AllDoctors"],
    queryFn: () => getAllDoctors(),
    staleTime: 5 * 60 * 1000,
  });
  const doctorsList = data?.data?.data || [];
  useEffect(() => {
    document.title = "MediRep | Doctor Profile Management";
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
      address: doctor.address || "",
      startTime: doctor.startTime || "",
      endTime: doctor.endTime || "",
      region: doctor.region || "",
      area: doctor.area || "",
      affiliation: doctor.affiliation || "",
      image: doctor.image || null,
    });
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: editingDoctor?.name || "",
      specialty: editingDoctor?.specialty || "",
      email: editingDoctor?.email || "",
      phone: editingDoctor?.phone || "",
      address: editingDoctor?.address || "",
      startTime: editingDoctor?.startTime || "",
      endTime: editingDoctor?.endTime || "",
      affiliation: editingDoctor?.affiliation || "",
      region: editingDoctor?.region || "",
      area: editingDoctor?.area || "",
      image: editingDoctor?.image || null,
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
            notifySuccess("Doctor updated successfully");
            setAddDoctor(false);
            setEditingDoctor(null);
            formik.resetForm();
            refetch();
          })
          .catch((error) => {
            console.error(
              "Error updating doctor:",
              error.response?.data || error
            );
            const errorMessage =
              error?.response?.data?.message ||
              error?.response?.data ||
              error?.message ||
              "An unexpected error occurred.";

            notifyError(
              `Failed to update doctor. Please try again. ${errorMessage}`
            );
          })
          .finally(() => setLoading(false));
      } else {
        addDoctors(cleanedValues)
          .then(() => {
            notifySuccess("Doctor added successfully");
            setAddDoctor(false);
            formik.resetForm();
            refetch();
          })
          .catch((error) => {
            console.error(
              "Error adding doctor:",
              error.response?.data || error
            );
            notifyError("Failed to add doctor. Please try again.");
          })
          .finally(() => setLoading(false));
      }
    },
  });

  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 24, color: "white" }} spin />
  );

  const handleDelete = async () => {
    deleteDoctor(deleteID)
      .then(() => {
        notifySuccess("Product delete successfully");
        setDeleteConfirmation(false);
        setAddDoctor(false);
        setEditingDoctor(null);
        refetch();
      })
      .catch((error) => {
        console.error("Failed to delete doctor:", error);
        notifyError("Failed to delete doctor. Please try again.");
      });
  };
  return (
    <>
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap md:flex-nowrap  justify-between gap-4 items-center">
          <p className="text-heading font-medium text-[22px]  lg:text-[24px]">
            Doctor Profile Manangement
          </p>
          <div className="flex flex-wrap sm:flex-nowrap gap-4 items-center">
            <button
              onClick={() => setOpenModal(true)}
              className="h-[55px] w-full min-w-[172px] bg-white rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
            >
              <MdFileUpload size={20} color="#7D7D7D" />{" "}
              <p className="text-heading text-base font-medium">Bulk Upload</p>
            </button>{" "}
            <button
              onClick={() => {
                setAddDoctor(true);
              }}
              className="h-[55px] w-full min-w-[192px] bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
            >
              <MdAdd size={20} color="#fff" />{" "}
              <p className="text-white text-base font-medium">Upload Doctors</p>
            </button>
          </div>
        </div>
        <div
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(90vh-137px)] h-[calc(90vh-168px)] overflow-y-auto scrollbar-none"
        >
          <p className="text-[#7D7D7D] font-medium text-sm">Doctors Profile</p>
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-3 mt-4">
            {doctorsList.map((doc: any, index: number) => (
              <DoctorCard
                key={index}
                doctor={doc}
                onEdit={() => handleEditDoctor(doc)}
                setdeleteID={setdeleteID}
                setAddDoctor={setAddDoctor}
              />
            ))}
          </div>
        </div>
      </div>
      {addDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl xl:mx-0 mx-5 w-[1000px] xl:h-auto h-[90vh] overflow-x-auto xl:p-6 p-4 shadow-xl relative">
            <div className="flex items-center justify-between">
              <p className="text-[24px] text-heading capitalize font-semibold">
                {editingDoctor ? "Edit Doctor" : "Upload Doctor"}
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
                  <p className="text-heading text-base">Doctor Details</p>

                  <div className="mt-4">
                    <CustomInput
                      id="name"
                      name="name"
                      label="Doctor Name"
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
                  <p className="text-heading text-base">Set Doctors</p>
                  <div className="mt-4">
                    <CustomInput
                      id="address"
                      name="address"
                      label="Address"
                      placeholder="Write address here.."
                      value={formik.values.address}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.address && formik.errors.address && (
                      <div className="text-red-500 text-xs">
                        *{formik.errors.address}
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
              <div className="flex justify-end mt-5">
                {editingDoctor && (
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteConfirmation(true);
                    }}
                    className="h-[55px] mr-auto md:w-[200px] w-full bg-red-600 text-white rounded-[6px] flex justify-center items-center"
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
                    "Update Doctor"
                  ) : (
                    "Add Doctor"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl xl:mx-0 mx-5 w-[500px] xl:h-auto h-[90vh] overflow-x-auto xl:p-6 p-4 shadow-xl relative">
            <RiAlertFill className="text-[120px] text-yellow-500 text-center mx-auto mb-2" />
            <div className="text-center">
              <h2 className="text-xl font-semibold text-primary mt-5">
                Confirm Delete
              </h2>
              <p className="mb-6">
                Are you sure you want to delete this <strong>Doctor</strong>{" "}
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
                className="px-7 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {openModal && <UploadFile closeModle={setOpenModal} />}
    </>
  );
}
