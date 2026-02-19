import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import ImagePicker from "../../Components/ImagePicker";
import CustomSelect from "../../Components/Select";
import CustomInput from "../../Components/CustomInput";
import { Spin } from "antd";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import CustomTextarea from "../../Components/CustomTextarea";
import DatePicker from "../../Components/DatePicker";
import { TbEdit } from "react-icons/tb";
import { useFormik } from "formik";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  updateEvents,
} from "../../api/eventsServices";
import { notifyError, notifySuccess } from "../../Components/Toast";
import { useQuery } from "@tanstack/react-query";
import { RiAlertFill } from "react-icons/ri";
import dayjs from "dayjs";
import { EventSchema } from "../../utils/validation";
export default function Events() {
  const [editing, setEditing] = useState<any>(null);
  const [openModel, setOpenModel] = useState(false);
  const [isloading, setLoading] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [isloadingDelete, setLoadingDelete] = useState(false);

  const { data, refetch, isFetching, isLoading } = useQuery({
    queryKey: ["AllEvents"],
    queryFn: () => getAllEvents(),
    staleTime: 5 * 60 * 1000,
  });
  let AllEvents = data?.data;

  useEffect(() => {
    document.title = "HR-Management | Events";
  }, []);
  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 24, color: "white" }} spin />
  );
  const antIcon22 = (
    <Loading3QuartersOutlined style={{ fontSize: 50, color: "#0755E9" }} spin />
  );
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      coverImage: editing?.coverImage || "",
      date: editing?.date ? dayjs(editing.date) : null,
      heading: editing?.heading || "",
      overview: editing?.overview || "",
      category: editing?.category || "",
    },
    validationSchema: EventSchema,
    onSubmit: (values) => {
      setLoading(true);
      if (editing) {
        updateEvents(editing._id, values)
          .then(() => {
            notifySuccess("Account updated successfully");
            setOpenModel(false);
            setEditing(null);
            formik.resetForm();
            refetch();
          })
          .catch((error) => {
            console.error(error);
            notifyError("Failed to update Account.");
          })
          .finally(() => setLoading(false));
      } else {
        createEvent(values)
          .then(() => {
            notifySuccess("Account added successfully");
            setOpenModel(false);
            formik.resetForm();
            refetch();
          })
          .catch((error) => {
            console.error(error);
            notifyError("Failed to add Account.");
          })
          .finally(() => setLoading(false));
      }
    },
  });
  const handleDelete = () => {
    if (!editing?._id) return;
    setLoadingDelete(true);
    deleteEvent(editing._id)
      .then(() => {
        notifySuccess("Account deleted successfully");
        setDeleteConfirmation(false);
        setEditing(null);
        refetch();
      })
      .catch((error) => {
        console.error("Failed to delete Account:", error);
        notifyError("Failed to delete Account. Please try again.");
      })
      .finally(() => setLoadingDelete(false));
  };
  return (
    <>
      <div className="bg-[#F7F7F7] md:h-[calc(100vh-129px)] h-auto rounded-xl p-4">
        <div className="flex flex-wrap items-start justify-end gap-4">
          <button
            onClick={() => {
              setOpenModel(true);
              setEditing(null);
            }}
            className="h-10 w-full md:w-[180px] bg-[#0755E9] rounded-md gap-3 cursor-pointer flex justify-center items-center"
          >
            <Icon
              icon="mingcute:add-fill"
              height="20"
              width="20"
              color="#fff"
            />
            <p className="text-base font-medium text-white">Add Events</p>
          </button>
        </div>
        <div
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          className="bg-[#E5EBF7] overflow-y-auto mt-4 p-4 rounded-lg 2xl:h-[calc(77.4vh-0px)] xl:h-[calc(67.4vh-0px)]"
        >
          <p className="text-sm text-[#7d7d7d] leading-[100%]">Events List</p>
          <div className="flex flex-wrap items-center gap-4 mt-4">
            {isLoading || isFetching ? (
              <div className="flex items-center justify-center w-full py-10">
                <Spin indicator={antIcon22} />
              </div>
            ) : AllEvents && AllEvents.length > 0 ? (
              AllEvents.map((e: any, index: number) => (
                <div
                  key={e._id || index}
                  className="bg-white rounded-2xl drop-shadow-lg lg:w-[calc(50%-10px)] w-full group flex flex-col overflow-hidden"
                >
                  <div className="flex-1 p-4 ">
                    <p className="text-[#131313] md:text-[32px] text-[18px] font-medium lg:w-max w-auto border-b-2 border-[#0755E9]">
                      {e.heading}
                    </p>
                    <div className="h-auto lg:h-30">
                      {" "}
                      <p className="mt-5 text-sm md:text-base text-[#7d7d7d]">
                        {e.overview}
                      </p>
                    </div>
                  </div>

                  <div className="relative overflow-hidden ">
                    <img
                      src={e.coverImage}
                      className="object-cover w-full h-auto rounded-b-lg lg:h-100"
                      alt={e.heading}
                    />
                    <div className="absolute inset-0 flex items-center justify-center gap-4 transition-opacity duration-300 opacity-50 md:opacity-0 bg-black/70 group-hover:opacity-100">
                      <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full cursor-pointer">
                        <button
                          onClick={() => {
                            setEditing(e);
                            setOpenModel(true);
                          }}
                        >
                          <TbEdit
                            className="text-blue-500 cursor-pointer"
                            size={22}
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full cursor-pointer">
                        <button
                          onClick={() => {
                            setEditing(e);
                            setDeleteConfirmation(true);
                          }}
                        >
                          <Icon
                            className="cursor-pointer "
                            color="#E90761"
                            height="18"
                            width="24"
                            icon="mingcute:delete-fill"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="w-full py-10 text-center text-gray-500">
                No events found.
              </p>
            )}
          </div>
        </div>
      </div>
      {openModel && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="bg-white rounded-xl xl:mx-0 mx-5 w-[1000px] max-h-[90vh] overflow-x-auto  shadow-xl relative"
          >
            <div className="flex items-center justify-between bg-[#E5EBF7] xl:px-6 px-4 py-4">
              <p className="text-xl font-medium">
                {editing ? "Update Event" : "Add Event"}
              </p>

              <div className="h-[35px] group w-[35px] p-2 rounded-full  hover:shadow-[rgba(99,99,99,0.25)_0px_4px_12px_2px] flex items-center justify-center">
                <div className="group-hover:bg-white">
                  <IoMdCloseCircle
                    size={24}
                    onClick={() => setOpenModel(false)}
                    className="cursor-pointer text-primary"
                  />
                </div>
              </div>
            </div>
            <form
              onSubmit={formik.handleSubmit}
              className="xl:p-6 p-4 space-y-6"
            >
              <div>
                {" "}
                <ImagePicker
                  placeholder="Upload Cover Photos"
                  label="Cover Photos"
                  fileType="Hr-Management"
                  type="image"
                  value={formik.values.coverImage}
                  onChange={(val: any) =>
                    formik.setFieldValue("coverImage", val)
                  }
                />
                {formik.touched.coverImage &&
                  formik.errors.coverImage &&
                  typeof formik.errors.coverImage === "string" && (
                    <div className="text-xs text-red-500">
                      * {formik.errors.coverImage}
                    </div>
                  )}
              </div>
              <div>
                {" "}
                <DatePicker
                  label="Date"
                  placeholder="Select the Date"
                  value={formik.values.date}
                  onChange={(date) => formik.setFieldValue("date", date)}
                />
                {formik.touched.date &&
                  formik.errors.date &&
                  typeof formik.errors.date === "string" && (
                    <div className="text-xs text-red-500">
                      * {formik.errors.date}
                    </div>
                  )}
              </div>

              <div>
                {" "}
                <CustomSelect
                  placeholder="Category"
                  value={formik.values.category}
                  options={["Office Staff", "Field Staff", "HR"]}
                  onChange={(val) => formik.setFieldValue("category", val)}
                />
                {formik.touched.category &&
                  formik.errors.category &&
                  typeof formik.errors.category === "string" && (
                    <div className="text-xs text-red-500">
                      * {formik.errors.category}
                    </div>
                  )}
              </div>

              <div>
                {" "}
                <CustomInput
                  label="Heading"
                  placeholder="Write the Heading"
                  value={formik.values.heading}
                  onChange={formik.handleChange}
                  name="heading"
                />
                {formik.touched.heading &&
                  formik.errors.heading &&
                  typeof formik.errors.heading === "string" && (
                    <div className="text-xs text-red-500">
                      * {formik.errors.heading}
                    </div>
                  )}
              </div>

              <div>
                <CustomTextarea
                  label="Overview Detail"
                  placeholder="Write the Overview Detail"
                  value={formik.values.overview}
                  onChange={formik.handleChange}
                  name="overview"
                />{" "}
                {formik.touched.overview &&
                  formik.errors.heading &&
                  typeof formik.errors.overview === "string" && (
                    <div className="text-xs text-red-500">
                      * {formik.errors.overview}
                    </div>
                  )}
              </div>

              <div className="flex justify-end mt-5 gap-4">
                <button
                  onClick={() => setOpenModel(false)}
                  className="h-[55px] md:w-[100px] w-full bg-[#F2FAFD] text-[#131313] rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-[55px] w-full md:w-[180px] bg-[#0755E9] rounded-md gap-3 cursor-pointer flex justify-center items-center text-white font-medium"
                >
                  {isloading ? (
                    <Spin indicator={antIcon} />
                  ) : editing ? (
                    "Update Event"
                  ) : (
                    "Add Event"
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
              <p className="text-base text-[#131313]">Delete Account</p>
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
                Are you sure to delete this account?
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
                {isloadingDelete ? <Spin indicator={antIcon} /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
