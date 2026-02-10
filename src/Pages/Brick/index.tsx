import { Icon } from "@iconify/react";
import CustomTable from "../../Components/CustomTable";
import { IoMdCloseCircle } from "react-icons/io";
import CustomInput from "../../Components/CustomInput";
import MultiSelect from "../../Components/MultiSelect";
import { Spin } from "antd";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import CustomSelect from "../../Components/Select";
import SearchByName from "../../Components/SearchBar/searchByName";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createBrick } from "../../api/brickServices";
import { getAllBricks } from "../../api/brickServices";
import { deleteBrick } from "../../api/brickServices";
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
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const { data: Products } = useQuery({
    queryKey: ["AllProducts"],
    queryFn: () => getAllProducts(),
    staleTime: 5 * 60 * 1000,
  });
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

  const {
    data,
    isLoading: bricksLoading,
    refetch,
  } = useQuery({
    queryKey: ["bricks", searchBrickName],
    queryFn: () => getAllBricks(searchBrickName),
  });
  useEffect(() => {
    document.title = "MediRep | Brick";
  }, []);

  const brickSchema = Yup.object({
    brickName: Yup.string().required("Brick Name is required"),
    city: Yup.string().required("City is required"),
    mrName: Yup.string().required("MR Name is required"),
    areaNames: Yup.array().min(1, "Select at least one Area"),
    Pharmacies: Yup.array().min(1, "Select at least one Pharmacy"),
    doctors: Yup.array().min(1, "Select at least one Doctor"),
    products: Yup.array().min(1, "Select at least one Product"),
  });
  const formik = useFormik({
    initialValues: {
      brickName: "",
      city: "",
      mrName: "",
      areaNames: [] as string[],
      Pharmacies: [] as string[],
      doctors: [] as string[],
      products: [] as string[],
    },
    enableReinitialize: true,
    validationSchema: brickSchema,
    onSubmit: async (values) => {
      if (editingBrick) {
        await updateBrickMutation.mutateAsync({
          id: editingBrick.brickId,
          values,
        });
      } else {
        await createBrickMutation.mutateAsync(values);
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

  const createBrickMutation = useMutation({
    mutationFn: createBrick,
    onSuccess: (newBrick: any) => {
      alert("Brick Created Successfully");
      setBricksData((prev) => [...prev, newBrick]);
      setOpenModel(false);
      formik.resetForm();
      setSearchBrickName("");
      refetch();
    },
  });

  const deleteBrickMutation = useMutation({
    mutationFn: (id: string) => deleteBrick(id),
    onSuccess: (_, id) => {
      alert("Brick Deleted Successfully");
      setBricksData((prev) => prev.filter((brick) => brick.brickId !== id)); // Remove row
      setDeleteConfirmation(false);
      setDeleteId(null);
    },
  });

  const updateBrickMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: any }) =>
      updateBrick(id, values),

    onSuccess: () => {
      alert("Brick Updated Successfully");
      formik.resetForm();
      setEditingBrick(null);
      setOpenModel(false);
      refetch();
    },

    onError: (err) => {
      console.error("Update failed:", err);
      alert("Update Failed");
    },
  });
  // ======= HANDLERS =======
  const handleEdit = (brick: any) => {
    setEditingProduct(brick);
    formik.setValues({
      brickName: brick.brickName || "",
      city: brick.city || "",
      mrName: brick.mrName || "",
      areaNames: brick.areaNames || [],
      Pharmacies: brick.Pharmacies || [],
      doctors: brick.doctors || [],
      products: brick.products || [],
    });
    setSelectedMR(brick.mrName || "");
    setSelectedAreas(brick.areaNames || []);
    setSelectedPharmacies(brick.Pharmacies || []);
    setSelectedDoctors(brick.doctors || []);
    setSelectedProducts(brick.products || []);
    setOpenModel(true);
  };

  const handleSave = async () => {
    const payload = {
      brickName: formik.values.brickName,
      city: formik.values.city,
      mrName: selectedMR || formik.values.mrName,
      areaNames: selectedAreas.length ? selectedAreas : formik.values.areaNames,
      Pharmacies: selectedPharmacies.length
        ? selectedPharmacies
        : formik.values.Pharmacies,
      doctors: selectedDoctors.length ? selectedDoctors : formik.values.doctors,
      products: selectedProducts.length
        ? selectedProducts
        : formik.values.products,
    };

    if (editingProduct) {
      await updateBrickMutation.mutateAsync({
        id: editingProduct.brickId,
        values: payload,
      });
    } else {
      await createBrickMutation.mutateAsync(payload);
    }

    // reset state
    formik.resetForm();
    setSelectedMR("");
    setSelectedAreas([]);
    setSelectedPharmacies([]);
    setSelectedDoctors([]);
    setSelectedProducts([]);
    setEditingProduct(null);
    setOpenModel(false);
  };
  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setDeleteConfirmation(true);
  };
  const handleDelete = async () => {
    if (!deleteId) return;
    setLoadingDelete(true);
    try {
      await deleteBrickMutation.mutateAsync(deleteId);
    } finally {
      setLoadingDelete(false);
    }
  };

  const tableData = bricksData.map((brick: any) => [
    brick.brickId,
    brick.brickName,
    brick.city,
    brick.mrName,
    brick.areaNames?.join(", ") || "-",
    brick.products?.join(", ") || "-",
    brick.Pharmacies?.length || 0,
    brick.doctors?.length || 0,
    <div className="flex gap-2">
      <TbEdit
        size={18}
        className="cursor-pointer text-primary"
        onClick={() => handleEdit(brick)}
      />
      <Icon
        icon="mingcute:delete-line"
        color="#E90761"
        height="18"
        width="20"
        className="cursor-pointer"
        onClick={() => {
          handleDeleteClick(brick.brickId);
          setDeleteConfirmation(true);
        }}
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
          <div className="flex w-full lg:w-auto  flex-wrap md:flex-nowrap items-center gap-4">
            <div className="md:w-[250px] w-full">
              <SearchByName
                name="Brick Name:"
                onSearch={(value: string) => {
                  setSearchBrickName(value);
                  refetch();
                }}
              />
            </div>
            <button
              onClick={() => {
                setEditingProduct(null);
                formik.resetForm();
                setSelectedAreas([]);
                setSelectedPharmacies([]);
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
<<<<<<< HEAD
            <CustomTable titles={titles} />
=======
            {bricksLoading ? (
              <Spin indicator={antIcon} />
            ) : (
              <CustomTable titles={titles} data={tableData} />
            )}
>>>>>>> fa73c409921f7133a05c37e0e8b5b50275cdef4b
          </div>
        </div>
      </div>

      {openModel && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="bg-white rounded-xl xl:mx-0 mx-5 w-[1000px] max-h-[90vh] overflow-x-auto  shadow-xl relative"
          >
            <div className="flex items-center justify-between bg-[#E5EBF7] xl:px-6 px-4 py-4">
              <p className="text-[24px] text-heading capitalize font-normal">
                {editingProduct ? "Edit Brick" : "Add Brick"}
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

<<<<<<< HEAD
            <div className="grid grid-cols-2 gap-6 mt-5 xl:p-6 p-4">
              <div className="space-y-4 ">
                <CustomInput
                  label="Brick Name"
                  placeholder="Enter Brick Name"
                  name="brickName"
                  defaultValue={editingProduct?.brickName || ""}
                />
                <CustomInput
                  label="City"
                  placeholder="Enter City"
                  name="city"
                  defaultValue={editingProduct?.city || ""}
                />
                <CustomSelect
                  placeholder="Mr Name"
                  value={selectedMR}
                  onChange={setSelectedMR}
=======
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
                    setSelectedMR(value);
                  }}
                  options={AllMR.map((mr: any) => mr.name)}
>>>>>>> fa73c409921f7133a05c37e0e8b5b50275cdef4b
                />
              </div>

              <div className="space-y-4">
                <MultiSelect
                  label="Areas"
<<<<<<< HEAD
                  value={selectedAreas}
                  onChange={setSelectedAreas}
                />
                <MultiSelect
                  label="Pharmacies"
                  value={selectedPharmacies}
                  onChange={setSelectedPharmacies}
                />
                <MultiSelect
                  label="Doctors"
                  value={selectedDoctors}
                  onChange={setSelectedDoctors}
                />
                <MultiSelect
                  label="Products"
                  value={selectedProducts}
                  onChange={setSelectedProducts}
=======
                  options={aeraSelection}
                  value={formik.values.areaNames}
                  onChange={(value) => formik.setFieldValue("areaNames", value)}
                />
                <MultiSelect
                  label="Pharmacies"
                  options={pharmacyOptions}
                  value={formik.values.Pharmacies}
                  onChange={(value) =>
                    formik.setFieldValue("Pharmacies", value)
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
>>>>>>> fa73c409921f7133a05c37e0e8b5b50275cdef4b
                />
              </div>
            </div>

            <div className="flex justify-end mt-6 xl:p-6 p-4 gap-4">
              <button
<<<<<<< HEAD
                onClick={() => setOpenModel(false)}
                className="h-[55px] md:w-[100px] w-full bg-[#F2FAFD] text-[#131313] rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
              >
                Cancel
              </button>
              <button className="bg-primary text-white w-[150px] h-[50px] px-6 py-2 rounded">
                Create Brick
=======
                onClick={handleSave}
                className="bg-primary text-white w-[150px] h-[50px] rounded"
              >
                {editingProduct
                  ? updateBrickMutation.isPending
                    ? "Updating..."
                    : "Update"
                  : createBrickMutation.isPending
                    ? "Saving..."
                    : "Save"}
>>>>>>> fa73c409921f7133a05c37e0e8b5b50275cdef4b
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
              <button className="px-7 h-[48px] py-2 bg-[#E90761] font-medium text-white rounded-md">
                {isloadingDelete ? <Spin indicator={antIcon} /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
