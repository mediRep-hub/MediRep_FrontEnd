import { useEffect, useState } from "react";
import { MdAdd, MdDeleteOutline } from "react-icons/md";
import CustomTable from "../../Components/CustomTable";
import { IoMdCloseCircle, IoMdEye } from "react-icons/io";
import CustomSelect from "../../Components/Select";
import CustomInput from "../../Components/CustomInput";
import ImagePicker from "../../Components/ImagePicker";
import { ProductSchema } from "../../utils/validation";
import { useFormik } from "formik";
import { useQuery } from "@tanstack/react-query";
import {
  addProduct,
  deleteProducts,
  getAllProducts,
  updateProducts,
} from "../../api/productServices";
import { notifyError, notifySuccess } from "../../Components/Toast";
import { Spin } from "antd";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { IoClose } from "react-icons/io5";
import { RiAlertFill } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import Pagination from "../../Components/Pagination";

const titles = [
  "Product SKU",
  "Product Name",
  "Category",
  "Form",
  "Status",
  "Amount",
  "Image",
  "Actions",
];

const categoryOptions = [
  "Cardiology",
  "Neurology",
  "Dermatology",
  "Endocrinology",
  "Gastroenterology",
  "Pulmonology",
  "Nephrology",
  "Rheumatology",
  "Oncology",
  "Hematology",
  "Orthopedics",
  "Gynecology",
  "Pediatrics",
  "Psychiatry",
  "Ophthalmology",
  "Otolaryngology (ENT)",
  "Urology",
];

const medicineForms = [
  "Tablet",
  "Capsule",
  "Syrup",
  "Injection",
  "Cream",
  "Ointment",
  "Drops",
  "Inhaler",
  "Spray",
  "Powder",
];

const statusOptions = ["Active", "Discontinued"];
export default function Products() {
  const [openModel, setOpenModel] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [isloading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [deleteID, setdeleteID] = useState<any>(null);
  const [viewImage, setViewImage] = useState<any>(null);
  const [openImage, setOpenImage] = useState(false);
  const [isloadingDelete, setLoadingDelete] = useState(false);
  useEffect(() => {
    document.title = "MediRep | Products";
  }, []);
  const { data, refetch, isFetching } = useQuery({
    queryKey: ["AllProducts"],
    queryFn: () => getAllProducts(),
    staleTime: 5 * 60 * 1000,
  });
  let ProductData = data?.data?.data;

  let tableData: any = [];
  ProductData?.map((v: any) => {
    tableData.push([
      v?.sku,
      <div>
        {v?.productName} ({v?.strength})
      </div>,
      v?.category,
      v?.isfrom,
      <div
        className={`border-[1px] px-2 py-0.5 text-sm font-medium rounded-sm w-max capitalize
    ${
      v?.isStatus?.toLowerCase() === "active"
        ? "border-[#0755E9] text-[#0755E9]"
        : "border-[#E90761] text-[#E90761]"
    }`}
      >
        {v?.isStatus}
      </div>,
      v?.amount,
      <div
        className="flex items-center gap-1"
        onClick={() => {
          setViewImage(v?.productImage);
          setOpenImage(true);
        }}
      >
        <IoMdEye size={16} color="#7d7d7d" />
        <p>View</p>
      </div>,
      <div className="flex items-center gap-2">
        <TbEdit
          size={18}
          className="text-primary cursor-pointer"
          onClick={() => {
            setEditingProduct(v);
            setOpenModel(true);
          }}
        />
        <MdDeleteOutline
          onClick={() => {
            setDeleteConfirmation(true);
            setdeleteID(v?._id);
          }}
          size={18}
          className="text-red-600 cursor-pointer"
        />
      </div>,
    ]);
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      productName: editingProduct?.productName || "",
      category: editingProduct?.category || "",
      isfrom: editingProduct?.isfrom || "",
      amount: editingProduct?.amount || "",
      productImage: editingProduct?.productImage || null,
      isStatus: editingProduct?.isStatus || "",
      strength: editingProduct?.strength || "",
      packSize: editingProduct?.packSize || "",
    },
    validationSchema: ProductSchema,
    onSubmit: (values) => {
      setLoading(true);
      if (editingProduct) {
        updateProducts(editingProduct._id, values)
          .then(() => {
            notifySuccess("Product updated successfully");
            setOpenModel(false);
            setEditingProduct(null);
            formik.resetForm();
            refetch();
          })
          .catch((error) => {
            console.error(error);
            notifyError("Failed to update product.");
          })
          .finally(() => setLoading(false));
      } else {
        addProduct(values)
          .then(() => {
            notifySuccess("Product added successfully");
            setOpenModel(false);
            formik.resetForm();
            refetch();
          })
          .catch((error) => {
            console.error(error);
            notifyError("Failed to add product.");
          })
          .finally(() => setLoading(false));
      }
    },
  });
  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 24, color: "white" }} spin />
  );
  const handleDelete = () => {
    setLoadingDelete(true);
    deleteProducts(deleteID)
      .then(() => {
        notifySuccess("Product deleted successfully");
        setDeleteConfirmation(false);
        refetch();
      })
      .catch((error) => {
        console.error("Failed to delete product:", error);
        notifyError("Failed to delete product. Please try again.");
      })
      .finally(() => {
        setLoadingDelete(false);
      });
  };
  return (
    <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
      <div className="flex flex-wrap gap-4 items-start justify-between">
        <p className="text-heading font-medium text-[22px] sm:text-[24px]">
          Products
        </p>
        <button
          onClick={() => {
            setEditingProduct(null);
            setOpenModel(true);
          }}
          className="h-[55px] w-full md:w-[180px] bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
        >
          <MdAdd size={20} color="#fff" />{" "}
          <p className="text-white text-base font-medium">Add Products</p>
        </button>
      </div>
      <div className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(90vh-127px)] xl:h-[calc(90vh-162px)] h-auto ">
        <div className="flex justify-between items-center">
          <p className="text-[#7D7D7D] font-medium text-sm">Targets as List</p>
          <Pagination
            currentPage={data?.data?.pagination?.currentPage || 1}
            totalItems={data?.data?.pagination?.totalItems || 0}
            itemsPerPage={data?.data?.pagination?.itemsPerPage}
          />
        </div>
        <div
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(85vh-147px)] xl:h-[calc(65vh-55px)]  mt-4 overflow-y-auto scrollbar-none"
        >
          <CustomTable
            isFetching={isFetching}
            titles={titles}
            data={tableData}
          />
        </div>
      </div>
      {openModel && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="bg-white rounded-xl xl:mx-0 mx-5 w-[1000px] max-h-[90vh] overflow-x-auto xl:p-6 p-4 shadow-xl relative"
          >
            <div className="flex items-center justify-between ">
              <p className="text-[24px] text-heading capitalize font-medium">
                <p className="text-[24px] text-heading capitalize font-semibold">
                  {editingProduct ? "Edit Products" : "Upload Products"}
                </p>
              </p>
              <IoMdCloseCircle
                size={20}
                onClick={() => setOpenModel(false)}
                className="cursor-pointer text-primary"
              />
            </div>
            <p className="text-base font-normal text-[#979797]">
              Define Products accordingly
            </p>{" "}
            <form onSubmit={formik.handleSubmit}>
              <div className="flex flex-wrap mt-5 gap-8">
                <div className="md:w-[calc(50%-16px)] w-full">
                  <p className="text-base font-normal text-heading">
                    Products Details
                  </p>
                  <div className="mt-3">
                    <CustomInput
                      label="Product Name"
                      placeholder="Enter Product Name"
                      name="productName"
                      value={formik.values.productName}
                      onChange={formik.handleChange}
                    />

                    {formik.touched.productName &&
                      formik.errors.productName && (
                        <div className="text-red-500 text-xs">
                          *
                          {typeof formik.errors.productName === "string"
                            ? formik.errors.productName
                            : ""}
                        </div>
                      )}
                  </div>
                  <div className="mt-3">
                    <CustomInput
                      label="Strength"
                      placeholder="Enter Strength"
                      name="strength"
                      value={formik.values.strength}
                      onChange={formik.handleChange}
                    />

                    {formik.touched.strength && formik.errors.strength && (
                      <div className="text-red-500 text-xs">
                        *
                        {typeof formik.errors.strength === "string"
                          ? formik.errors.strength
                          : ""}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <CustomSelect
                      options={categoryOptions}
                      value={formik.values.category}
                      onChange={(val) => formik.setFieldValue("category", val)}
                      placeholder="Category"
                    />

                    {formik.touched.category && formik.errors.category && (
                      <div className="text-red-500 text-xs">
                        *
                        {typeof formik.errors.category === "string"
                          ? formik.errors.category
                          : ""}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <CustomSelect
                      options={medicineForms}
                      value={formik.values.isfrom}
                      onChange={(val) => formik.setFieldValue("isfrom", val)}
                      placeholder="From"
                    />

                    {formik.touched.isfrom && formik.errors.isfrom && (
                      <div className="text-red-500 text-xs">
                        *
                        {typeof formik.errors.isfrom === "string"
                          ? formik.errors.isfrom
                          : ""}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <CustomSelect
                      options={statusOptions}
                      value={formik.values.isStatus}
                      onChange={(val) => formik.setFieldValue("isStatus", val)}
                      placeholder="Status"
                    />

                    {formik.touched.isStatus && formik.errors.isStatus && (
                      <div className="text-red-500 text-xs">
                        *
                        {typeof formik.errors.isStatus === "string"
                          ? formik.errors.isStatus
                          : ""}
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:w-[calc(50%-16px)] w-full">
                  <p className="text-base font-normal text-heading">
                    Set Amount
                  </p>
                  <div className="mt-3">
                    <CustomInput
                      placeholder="50"
                      label="Amount"
                      name="amount"
                      value={formik.values.amount}
                      onChange={formik.handleChange}
                    />

                    {formik.touched.amount && formik.errors.amount && (
                      <div className="text-red-500 text-xs">
                        *
                        {typeof formik.errors.amount === "string"
                          ? formik.errors.amount
                          : ""}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <ImagePicker
                      label="Product Image"
                      placeholder="Upload Image Here..."
                      fileType="Products"
                      type="image"
                      value={formik.values.productImage}
                      onChange={(val) =>
                        formik.setFieldValue("productImage", val)
                      }
                    />

                    {formik.touched.productImage &&
                      formik.errors.productImage && (
                        <div className="text-red-500 text-xs">
                          *
                          {typeof formik.errors.productImage === "string"
                            ? formik.errors.productImage
                            : ""}
                        </div>
                      )}
                  </div>{" "}
                  <div className="mt-3">
                    <CustomInput
                      placeholder="Wirte the number of item in 1 pack"
                      label="Pack Size"
                      name="packSize"
                      value={formik.values.packSize}
                      onChange={formik.handleChange}
                    />

                    {formik.touched.packSize && formik.errors.packSize && (
                      <div className="text-red-500 text-xs">
                        *
                        {typeof formik.errors.packSize === "string"
                          ? formik.errors.packSize
                          : ""}
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
                  ) : editingProduct ? (
                    "Update Product"
                  ) : (
                    "Add Product"
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
                Are you sure you want to delete this <strong>Product</strong>
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
                {isloadingDelete ? <Spin indicator={antIcon} /> : " Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      {openImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl xl:mx-0 mx-5 w-[300px] xl:h-auto max-h-[90vh] overflow-x-auto xl:p-6 p-4 shadow-xl relative">
            <div className="flex justify-end cursor-pointer mb-2">
              <IoClose onClick={() => setOpenImage(false)} />
            </div>

            <img
              src={viewImage}
              alt="Product"
              className="max-h-[80vh] w-auto mx-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
