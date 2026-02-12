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
import CustomTimePicker from "../../Components/TimeRangePicker";
import Pagination from "../../Components/Pagination";
import { Spin } from "antd";
import LocationPicker from "../../Components/LocationPicker";
import DoctorCard from "../Doctors/DoctorCard";
import {
  addPharmacypost,
  deletePharmacy,
  getAllPharmacies,
  updatePharmacy,
} from "../../api/pharmacyServices";
import PharmacyUploads from "../../Components/PharmacyUploads";
import { Icon } from "@iconify/react";
import { bricksData } from "../../utils/brick";
import SearchByName from "../../Components/SearchBar/searchByName";
import { useDebounce } from "../../Components/Debounce";
interface Pharmacy {
  _id?: string;
  name: string;
  DSL: string;
  email: string;
  phone: string;
  affiliation: string;
  image?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  brick?: string;
  channel?: string;
  city?: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
}
const channelOptions = [
  "Chain Pharmacy",
  "RT",
  "Wholesale",
  "Local Modern Trade",
];
const cityOptions = ["Lahore", "Islamabad", "Bahawalpur", "Karachi"];

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
  const [searchName, setSearchName] = useState("");
  const debouncedName = useDebounce(searchName, 500);
  const { data, refetch, isFetching } = useQuery({
    queryKey: ["AllPharmacies", currentPage, debouncedName],
    queryFn: () =>
      getAllPharmacies({
        page: currentPage,
        limit: itemsPerPage,
        name: debouncedName || undefined,
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
      DSL: pharmacy.DSL || "",
      phone: pharmacy.phone || "",
      startTime: pharmacy.startTime || "",
      endTime: pharmacy.endTime || "",
      brick: pharmacy.brick || "",
      city: pharmacy.city || "",
      affiliation: pharmacy.affiliation || "",
      image: pharmacy.image || null,
      channel: pharmacy.channel || "",
      location: pharmacy.location || { address: "", lat: 0, lng: 0 },
    });
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: editingPharmacy?.name || "",
      email: editingPharmacy?.email || "",
      DSL: editingPharmacy?.DSL || "",
      phone: editingPharmacy?.phone || "",
      startTime: editingPharmacy?.startTime || "",
      endTime: editingPharmacy?.endTime || "",
      affiliation: editingPharmacy?.affiliation || "",
      brick: editingPharmacy?.brick || "",
      city: editingPharmacy?.city || "",
      image: editingPharmacy?.image || null,
      channel: editingPharmacy?.channel || "",
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
              error.response?.data || error,
            );
            notifyError("Failed to update Pharmacy. Please try again.");
            notifyError(error.response?.data.message);
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
              error.response?.data || error,
            );
            notifyError("Failed to add Pharmacy. Please try again.");
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

  const brickOptions: string[] = bricksData.map(
    (brick: any) => brick.brickName,
  );
  return (
    <>
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap lg:flex-nowrap justify-between items-start gap-4">
          <p className="text-heading font-medium text-[22px] lg:text-[24px]">
            Pharmacies
          </p>
          <div className="flex flex-wrap sm:flex-nowrap gap-4 items-center">
            <div className="md:w-[250px] w-full">
              <SearchByName
                name="Pharmacy Name:"
                value={searchName}
                onChange={(val) => {
                  setSearchName(val);
                  setCurrentPage(1);
                }}
              />
            </div>
            <button
              onClick={() => setOpenModal(true)}
              className="h-[55px] w-full md:w-[180px] bg-white rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
            >
              <Icon
                icon="solar:upload-broken"
                height="24"
                width="24"
                color="#7D7D7D"
              />
              <p className="text-heading text-base font-medium">Bulk Upload</p>
            </button>
            <button
              onClick={() => setAddPharmacy(true)}
              className="h-[55px] w-full md:w-[180px] bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
            >
              <Icon
                icon="mingcute:add-fill"
                height="20"
                width="20"
                color="#fff"
              />
              <p className="text-white text-base font-medium">Add Pharmacy</p>
            </button>
          </div>
        </div>

        <div
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 h-[calc(100vh-230px)] overflow-y-auto scrollbar-none"
        >
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <p className="text-[#7D7D7D] font-medium text-sm">Pharmacy List</p>
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
          ) : paginatedPharmacies.length === 0 ? (
            <p className="text-center text-heading py-5">No data found</p>
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
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="bg-white rounded-xl xl:mx-0 mx-5 w-[1000px] max-h-[90vh] overflow-x-auto  shadow-xl relative"
          >
            <div className="flex items-center justify-between bg-[#E5EBF7] xl:px-6 px-4 py-4">
              <p className="text-[24px] text-heading capitalize font-normal">
                {editingPharmacy ? "Edit Pharmacy" : "Upload Pharmacy"}
              </p>

              <div className="h-[35px] group w-[35px] p-2 rounded-full  hover:shadow-[rgba(99,99,99,0.25)_0px_4px_12px_2px] flex items-center justify-center">
                <div className="group-hover:bg-white">
                  <IoMdCloseCircle
                    size={24}
                    onClick={() => {
                      setAddPharmacy(false);
                      setEditingPharmacy(null);
                      formik.resetForm();
                    }}
                    className="cursor-pointer text-primary"
                  />
                </div>
              </div>
            </div>

            <form onSubmit={formik.handleSubmit} className="xl:p-6 p-4">
              <div className="flex flex-wrap items-start gap-4">
                <div className="xl:w-[calc(50%-8px)] w-full">
                  <p className="text-heading text-base">Pharmacy Details</p>
                  <div className="mt-3">
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
                  </div>{" "}
                  <div className="mt-3">
                    <CustomSelect
                      options={channelOptions}
                      value={formik.values.channel}
                      onChange={(val) => formik.setFieldValue("channel", val)}
                      placeholder="Select Channel"
                    />
                    {formik.touched.channel && formik.errors.channel && (
                      <div className="text-red-500 text-xs">
                        *{formik.errors.channel}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
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
                  <div className="mt-3">
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
                  <div className="mt-3">
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
                  </div>{" "}
                  <div className="mt-3">
                    <CustomInput
                      id="DSL"
                      name="DSL"
                      label="DSL Number"
                      placeholder="Write Your Drug Sale License"
                      height="128px"
                      value={formik.values.DSL}
                      onChange={formik.handleChange}
                    />{" "}
                    {formik.touched.DSL && formik.errors.DSL && (
                      <div className="text-red-500 text-xs">
                        *{formik.errors.DSL}
                      </div>
                    )}
                  </div>
                </div>
                <div className="xl:w-[calc(50%-8px)] w-full">
                  <p className="text-heading text-base">Set Pharmacy Details</p>
                  <div className="mt-3">
                    <LocationPicker
                      label="Address"
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
                  <div className="mt-3 flex gap-3">
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
                  <div className="mt-3">
                    <CustomSelect
                      options={brickOptions}
                      value={formik.values.brick}
                      onChange={(val) => formik.setFieldValue("brick", val)}
                      placeholder="Brick Name"
                    />{" "}
                    {formik.touched.brick && formik.errors.brick && (
                      <div className="text-red-500 text-xs">
                        *{formik.errors.brick}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <CustomSelect
                      options={cityOptions}
                      value={formik.values.city}
                      onChange={(val) => formik.setFieldValue("city", val)}
                      placeholder="City"
                    />{" "}
                    {formik.touched.city && formik.errors.city && (
                      <div className="text-red-500 text-xs">
                        *{formik.errors.city}
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <CustomInput
                      id="affiliation"
                      name="affiliation"
                      label="Affiliation"
                      placeholder="Write your affiliation here..."
                      height="128px"
                      value={formik.values.affiliation}
                      onChange={formik.handleChange}
                    />{" "}
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
                {editingPharmacy && (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmation(true)}
                    className="h-[55px] mr-auto md:w-[200px] w-full bg-[#E90761] text-white rounded-[6px] flex justify-center items-center"
                  >
                    Delete
                  </button>
                )}
                <button
                  onClick={() => {
                    setAddPharmacy(false);
                    setEditingPharmacy(null);
                    formik.resetForm();
                  }}
                  className="h-[55px] md:w-[100px] w-full bg-[#F2FAFD] text-[#131313] rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-[55px] md:w-[200px] w-full bg-primary text-white rounded-[6px] flex justify-center items-center"
                >
                  {isLoading ? (
                    <Spin indicator={antIcon} />
                  ) : editingPharmacy ? (
                    "Update Pharmacy"
                  ) : (
                    "Add Pharmacy"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl xl:mx-0 mx-5 w-[500px] h-auto overflow-x-auto shadow-xl relative">
            <div className="bg-[#E90761]/10 p-4">
              <p className="text-base text-[#131313]">Delete Pharmacy</p>
            </div>

            <div className="flex justify-center my-6">
              <div className="flex justify-center items-center bg-[#E90761]/10 h-[120px] w-[120px] rounded-full">
                <div className="flex justify-center items-center  bg-[#E90761] h-[80px] w-[80px] rounded-full">
                  <Icon
                    icon="mingcute:delete-line"
                    className="text-4xl text-white"
                  />
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-base font-normal text-[#131313] mt-5">
                Are you sure to delete this pharmacy?
              </p>
              <p className="mb-6 text-[#7D7D7D]/40">
                Once you delete it will not restored
              </p>
            </div>
            <div className="flex mt-5 justify-end gap-4 p-4">
              <button
                onClick={() => setDeleteConfirmation(false)}
                className="px-7 h-[48px] py-2 font-medium bg-[#FDE6EF] rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-7 h-[48px] py-2 bg-[#E90761] font-medium text-white rounded-md"
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
