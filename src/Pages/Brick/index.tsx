import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import CustomTable from "../../Components/CustomTable";
import { TbEdit } from "react-icons/tb";
import { IoMdCloseCircle } from "react-icons/io";
import CustomInput from "../../Components/CustomInput";
import MultiSelect from "../../Components/MultiSelect";
import { useQuery } from "@tanstack/react-query";
import { getAllPharmacies } from "../../api/pharmacyServices";
import { bricksData as initialBricksData } from "../../utils/brick";
import { Spin } from "antd";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import CustomSelect from "../../Components/Select";
import { getAllAccounts } from "../../api/adminServices";
import { getAllDoctorsLIst } from "../../api/doctorServices";
import { getAllProducts } from "../../api/productServices";
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

  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedPharmacies, setSelectedPharmacies] = useState<string[]>([]);
  const [selectedDoctors, setSelectedDoctors] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedMR, setSelectedMR] = useState("");

  const [searchBrickName, setSearchBrickName] = useState("");

  const [bricksData, setBricksData] = useState(initialBricksData);
  const [deletestore, setDeletestore] = useState<string | null>(null);
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

  // ---------------- GET BRICKS ----------------
  const {
    data: bricksApiData,
    isLoading: bricksLoading,
    refetch,
  } = useQuery({
    queryKey: ["bricks", searchBrickName],
    queryFn: () => getAllBricks(searchBrickName),
  });
  const bricksData = bricksApiData?.data || [];

  useEffect(() => {
    if (bricksApiData?.data) {
      setBricksData(
        bricksApiData.data.map((b: any) => ({
          ...b,
          areaNames: Array.isArray(b.areaNames) ? b.areaNames : [],
          Pharmacies: Array.isArray(b.Pharmacies) ? b.Pharmacies : [],
        })),
      );
    }
  }, [bricksApiData]);

  useEffect(() => {
    if (bricksApiData?.data) {
      setBricksData(bricksApiData.data);
    }
  }, [bricksApiData]);

  const brickSchema = Yup.object({
    brickName: Yup.string().required("Brick Name is required"),
    city: Yup.string().required("City is required"),
    mrName: Yup.string().required("MR Name is required"),
    areaNames: Yup.array().min(1, "Select at least one Area"),
    Pharmacies: Yup.array().min(1, "Select at least one Pharmacy"),
    doctors: Yup.array().min(1, "Select at least one Doctor"),
    products: Yup.array().min(1, "Select at least one Product"),
  });

  const createBrickMutation = useMutation({
    mutationFn: createBrick,
    onSuccess: () => {
      alert("Brick Created");
      setOpenModel(false);
      refetch();
    },
  });

  const { data: doctorss } = useQuery({
    queryKey: ["AllDoctors"],
    queryFn: () => getAllDoctorsLIst(),
  });
  const formik = useFormik({
    initialValues: {
      brickName: "",
      city: "",
      mrName: "",
      areaNames: [],
      Pharmacies: [],
      doctors: [],
      products: [],
    },

    enableReinitialize: true,

    onSubmit: (values) => {
      if (editingProduct) {
        updateBrickMutation.mutate({
          id: editingProduct.brickId,
          values,
        });
      } else {
        createBrickMutation.mutate(values);
      }
    },
  });

  const { data: bricksDataFromApi } = useQuery({
    queryKey: ["bricks", formik.values.brickName],
    queryFn: () => getAllBricks(formik.values.brickName),
  });
  useEffect(() => {
    if (bricksDataFromApi?.data) {
      setBricksData(bricksDataFromApi.data);
    }
  }, [bricksDataFromApi]);

  const { data: allMr } = useQuery({
    queryKey: ["AllAccount"],
    queryFn: () => getAllAccounts(),
    staleTime: 5 * 60 * 1000,
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

  useEffect(() => {
    document.title = "MediRep | Brick";
  }, []);

  const handleEdit = (brick: any) => {
    setEditingProduct(brick);

    formik.setValues({
      brickName: brick.brickName,
      city: brick.city,
      mrName: brick.mrName,
      areaNames: brick.areaNames || [],
      Pharmacies: brick.Pharmacies || [],
      doctors: brick.doctors || [],
      products: brick.products || [],
    });

    setOpenModel(true);
  };

  const deleteBrickMutation = useMutation({
    mutationFn: deleteBrick,
    onSuccess: () => {
      alert("Brick Deleted");
      setDeleteConfirmation(false);
      setDeletestore(null);
      refetch();
    },
  });

  const handleDelete = () => {
    if (!deletestore) return;
    deleteBrickMutation.mutate(deletestore);
  };

  const handleDeleteClick = (id: string) => {
    setDeletestore(id);
    setDeleteConfirmation(true);
  };

  const updateBrickMutation = useMutation({
    mutationFn: ({ id, values }: any) => updateBrick(id, values),
    onSuccess: () => {
      alert("Brick Updated");
      setEditingProduct(null);
      setOpenModel(false);
      refetch();
    },
  });

  const handleSave = () => {
    const brickPayload = {
      brickName: (
        document.getElementsByName("brickName")[0] as HTMLInputElement
      ).value,
      city: (document.getElementsByName("city")[0] as HTMLInputElement).value,
      mrName: selectedMR,
      areaNames: selectedAreas.length > 0 ? selectedAreas : [],
      Pharmacies: selectedPharmacies.length > 0 ? selectedPharmacies : [],
      doctors: selectedDoctors.length > 0 ? selectedDoctors : [],
      products: selectedProducts.length > 0 ? selectedProducts : [],
    };

    if (!editingProduct) {
      setBricksData([
        ...bricksData,
        { brickId: Date.now().toString(), ...brickPayload },
      ]);
    } else {
      setBricksData(
        bricksData.map((b) =>
          b.brickId === editingProduct.brickId ? { ...b, ...brickPayload } : b,
        ),
      );
    }

    setEditingProduct(null);
    setSelectedAreas([]);
    setSelectedPharmacies([]);
    setSelectedDoctors([]);
    setSelectedProducts([]);
    setSelectedMR("");
    setOpenModel(false);
  };

  const tableData = bricksData.map((brick: any) => [
    brick.brickId,
    brick.brickName,
    brick.city,
    brick.mrName,
    brick.areaNames?.join(", "),
    brick.products?.join(", "),
    brick.Pharmacies?.length || 0,
    brick.doctors?.length || 0,

    <div className="flex gap-2">
      <TbEdit className="cursor-pointer" onClick={() => handleEdit(brick)} />

      <Icon
        icon="mingcute:delete-line"
        className="cursor-pointer"
        onClick={() => {
          setDeletestore(brick.brickId);
          setDeleteConfirmation(true);
        }}
      />
    </div>,
  ]);

  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 24, color: "white" }} spin />
  );

  useEffect(() => {
    document.title = "MediRep | Brick";
  }, []);

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
                {editingProduct ? "Edit Brick" : "Add Brick"}
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
                  onChange={(value) => formik.setFieldValue("mrName", value)}
                  options={AllMR.map((mr: any) => mr.name)}
                />
              </div>

              <div className="space-y-4">
                <MultiSelect
                  label="Areas"
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
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                onClick={() => formik.handleSubmit()}
                className="bg-primary text-white w-[150px] h-[50px] rounded"
              >
                {editingProduct
                  ? updateBrickMutation.isPending
                    ? "Updating..."
                    : "Update"
                  : createBrickMutation.isPending
                    ? "Saving..."
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
                {deleteBrickMutation.isPending ? (
                  <Spin indicator={antIcon} />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
