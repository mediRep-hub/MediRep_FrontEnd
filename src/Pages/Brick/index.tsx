import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import CustomTable from "../../Components/CustomTable";
import { TbEdit } from "react-icons/tb";
import { IoMdCloseCircle } from "react-icons/io";
import CustomInput from "../../Components/CustomInput";
import MultiSelect from "../../Components/MultiSelect";
import { useQuery } from "@tanstack/react-query";
import { getAllPharmacies } from "../../api/pharmacyServices";
import { Spin } from "antd";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import CustomSelect from "../../Components/Select";
import { getAllAccounts } from "../../api/adminServices";
import { getAllDoctorsLIst } from "../../api/doctorServices";
import SearchByName from "../../Components/SearchBar/searchByName";
import { useFormik } from "formik";
import { notifyError, notifySuccess } from "../../Components/Toast";
import * as Yup from "yup";
import { createBrick } from "../../api/brickServices";
import { getAllBricks } from "../../api/brickServices";
import { deleteBrick } from "../../api/brickServices";
import { getAllProducts } from "../../api/productServices";
import { updateBrick } from "../../api/brickServices";

const aeraSelection = [
  "Johar Town",
  "DHA",
  "Model Town",
  "Thokar Niaz Baig",
  "Gulberg",
  "Shahdara",
  "Clifton",
  "PECHS",
  "Defence",
  "Blue Area",
  "F-6",
  "G-10",
  "Gulgasht",
  "Boharwala",
  "Boson Town",
];

const titles = [
  "Brick ID",
  "Brick Name",
  "City",
  "Mr Name",
  "Area’s Name",
  "Product",
  "No of Pharmacy",
  "No of Doctors",
  "Action",
];

export default function Brick() {
  const [openModel, setOpenModel] = useState(false);
<<<<<<< HEAD
  const [editingBrick, setEditingBrick] = useState<any>(null);
  const [searchBrickName, setSearchBrickName] = useState("");
  const [deleteID, setDeleteID] = useState<string | null>(null);
  const [isloading, setLoading] = useState(false);
  const [isloadingDelete, setLoadingDelete] = useState(false);
=======
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingBrick, setEditingBrick] = useState<any>(null);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedPharmacies, setSelectedPharmacies] = useState<string[]>([]);
  const [selectedDoctors, setSelectedDoctors] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedMR, setSelectedMR] = useState("");
  const [searchBrickName, setSearchBrickName] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [bricksData, setBricksData] = useState(initialBricksData);
  const [isloadingDelete, setLoadingDelete] = useState(false);
  // const [deletestore, setDeletestore] = useState<string | null>(null);
>>>>>>> e8cb3959cd46869330e75c23f2e638375c4bcd70
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const { data: pharmaciesData } = useQuery({
    queryKey: ["pharmacies"],
    queryFn: () => getAllPharmacies({ page: 1, limit: 100 }),
  });
  const { data: doctorss } = useQuery({
    queryKey: ["AllDoctors"],
    queryFn: () => getAllDoctorsLIst(),
  });
  const { data: allMr } = useQuery({
    queryKey: ["AllAccount"],
    queryFn: () => getAllAccounts(),
    staleTime: 5 * 60 * 1000,
  });
<<<<<<< HEAD
  const { data: Products } = useQuery({
    queryKey: ["allProducts"],
    queryFn: () => getAllProducts(),
  });
  console.log("Products Data:", Products);
=======
>>>>>>> e8cb3959cd46869330e75c23f2e638375c4bcd70

  const {
    data,
    isLoading: bricksLoading,
    refetch,
  } = useQuery({
    queryKey: ["bricks", searchBrickName],
    queryFn: () => getAllBricks(searchBrickName),
  });
<<<<<<< HEAD

=======
>>>>>>> e8cb3959cd46869330e75c23f2e638375c4bcd70
  useEffect(() => {
    document.title = "MediRep | Brick";
  }, []);

  const brickSchema = Yup.object({
    // brickId: Yup.string().required("Brick ID is required"),
    brickName: Yup.string().required("Brick Name is required"),
    city: Yup.string().required("City is required"),
    mrName: Yup.string().required("MR Name is required"),
    areas: Yup.array().min(1, "Select at least one Area"),
    pharmacies: Yup.array().min(1, "Select at least one Pharmacy"),
    doctors: Yup.array().min(1, "Select at least one Doctor"),
    products: Yup.array().min(1, "Select at least one Product"),
  });
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      brickId: editingBrick?.brickId || "",
      brickName: editingBrick?.brickName || "",
      city: editingBrick?.city || "",
      mrName: editingBrick?.mrName || "",
      areas: editingBrick?.areas || [],
      pharmacies: editingBrick?.pharmacies || [],
      doctors: editingBrick?.doctors || [],
      products: editingBrick?.products || [],
    },
    validationSchema: brickSchema,
    onSubmit: (values) => {
      setLoading(true);
      if (editingBrick) {
        updateBrick(editingBrick._id, values)
          .then(() => {
            notifySuccess("Brick updated successfully");
            setOpenModel(false);
            setEditingBrick(null);
            formik.resetForm();
            refetch();
          })
          .catch((error) => {
            console.error(error);
            notifyError("Failed to update brick.");
          })
          .finally(() => setLoading(false));
      } else {
        createBrick(values)
          .then(() => {
            notifySuccess("Brick added successfully");
            setOpenModel(false);
            formik.resetForm();
            refetch();
          })
          .catch((error) => {
            console.error(error);
            notifyError("Failed to add brick.");
          })
          .finally(() => setLoading(false));
      }
    },
  });

  const productOptions =
    Products?.data?.data?.map((d: any) => d.productName) || [];
  const pharmacyOptions =
    pharmaciesData?.data?.data?.map((p: any) => p.name) || [];
  const doctorOptions = doctorss?.data?.data?.map((d: any) => d.name) || [];
  const AllMR =
    allMr?.data?.admins?.filter(
      (mr: any) => mr?.position === "MedicalRep(MR)",
    ) || [];

  const handleDelete = () => {
    if (!deleteID) return;
    setLoadingDelete(true);
    deleteBrick(deleteID)
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

  const handleDeleteClick = (id: string) => {
    setDeleteID(id);
    setDeleteConfirmation(true);
  };

  const bricksList = Array.isArray(data?.data) ? data.data : [];
  const tableData = bricksList.map((brick: any) => [
    brick.brickId,
    brick.brickName,
    brick.city,
    brick.mrName,
    brick.areas?.join(", "),
    brick.products?.join(", "),
    brick.pharmacies?.length || 0,
    brick.doctors?.length || 0,
    <div className="flex gap-2">
      <TbEdit
        size={18}
        className="cursor-pointer text-primary"
        onClick={() => {
          setEditingBrick(brick);
          setOpenModel(true);
        }}
      />
      <Icon
        icon="mingcute:delete-line"
        color="#E90761"
        height="18"
        width="20"
        className="cursor-pointer"
        onClick={() => handleDeleteClick(brick._id)}
      />
    </div>,
  ]);

  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 24, color: "white" }} spin />
  );

  return (
    <>
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap md:flex-nowrap gap-4 justify-between items-start">
          <p className="text-heading w-full lg:w-auto font-medium text-[22px] sm:text-[24px]">
            Brick
          </p>
          <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
            <div className="md:w-[250px] w-full">
              <SearchByName
                name="Brick Name:"
                onSearch={(value) => setSearchBrickName(value)}
              />
            </div>
            <button
              onClick={() => {
                setEditingBrick(null);
                formik.resetForm();
                setOpenModel(true);
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
        </div>

        <div className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(75.7vh-0px)] xl:h-[calc(64vh-0px)] h-auto ">
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(72.4vh-0px)] xl:h-[calc(59vh-0px)]  overflow-y-auto scrollbar-none"
          >
            {bricksLoading ? (
              <Spin indicator={antIcon} />
            ) : (
              <CustomTable titles={titles} data={tableData} />
            )}
          </div>
        </div>
      </div>

      {openModel && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[1000px] max-h-[90vh] p-6">
            <div className="flex justify-between">
              <p className="text-xl font-semibold">
                {editingBrick ? "Edit Brick" : "Add Brick"}
              </p>
              <IoMdCloseCircle
                className="cursor-pointer text-primary"
                onClick={() => setOpenModel(false)}
              />
            </div>

            <div className="grid grid-cols-2 gap-6 mt-5">
              <div className="space-y-4">
                <div>
                  <CustomInput
                    label="Brick Name"
                    name="brickName"
                    value={formik.values.brickName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />

                  {formik.touched.brickName && formik.errors.brickName && (
                    <p className="text-red-500 text-xs">
                      {formik.errors.brickName}
                    </p>
                  )}
                </div>
                <div>
                  <CustomInput
                    label="City"
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />

                  {formik.touched.city && formik.errors.city && (
                    <p className="text-red-500 text-xs">{formik.errors.city}</p>
                  )}
                </div>
                <CustomSelect
                  placeholder="Mr Name"
                  value={formik.values.mrName}
                  onChange={(value) => {
                    formik.setFieldValue("mrName", value);
                  }}
                  options={AllMR.map((mr: any) => mr.name)}
                />
              </div>

              <div className="space-y-4">
                <MultiSelect
                  label="Areas"
                  options={aeraSelection}
                  value={formik.values.areas}
                  onChange={(value) => formik.setFieldValue("areas", value)}
                />
                <MultiSelect
                  label="Pharmacies"
                  options={pharmacyOptions}
                  value={formik.values.pharmacies}
                  onChange={(value) =>
                    formik.setFieldValue("pharmacies", value)
                  }
                />
                <MultiSelect
                  label="Doctors"
                  options={doctorOptions}
                  value={formik.values.doctors}
                  onChange={(value) => formik.setFieldValue("doctors", value)}
                />
                <MultiSelect
                  label="Products"
                  options={productOptions}
                  value={formik.values.products}
                  onChange={(value) => formik.setFieldValue("products", value)}
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleSave}
                className="bg-primary text-white w-[150px] h-[50px] rounded"
              >
                {isloading
                  ? editingBrick
                    ? "Updating..."
                    : "Saving..."
                  : editingBrick
                    ? "Update"
                    : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl xl:mx-0 mx-5 w-[500px] h-auto overflow-x-auto shadow-xl relative">
            <div className="bg-[#E90761]/10 p-4">
              <p className="text-base text-[#131313]">Delete Brick</p>
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
                Are you sure to delete this brick?
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
