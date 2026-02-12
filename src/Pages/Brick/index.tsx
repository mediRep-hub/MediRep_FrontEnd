import { Icon } from "@iconify/react";
import CustomTable from "../../Components/CustomTable";
import { IoMdCloseCircle } from "react-icons/io";
import CustomInput from "../../Components/CustomInput";
import MultiSelect from "../../Components/MultiSelect";
import { Spin } from "antd";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import CustomSelect from "../../Components/Select";
import SearchByName from "../../Components/SearchBar/searchByName";
import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { createBrick } from "../../api/brickServices";
import { getAllBricks } from "../../api/brickServices";
import { deleteBrick } from "../../api/brickServices";
import { updateBrick } from "../../api/brickServices";
import { useEffect, useState } from "react";
import { getAllProductsMR } from "../../api/productServices";
import { getAllDoctorsLIst } from "../../api/doctorServices";
import { getAllAccounts } from "../../api/adminServices";
import { TbEdit } from "react-icons/tb";
import { getAllPharmacies } from "../../api/pharmacyServices";
import { notifyError, notifySuccess } from "../../Components/Toast";
import { BrickSchema } from "../../utils/validation";
import { useDebounce } from "../../Components/Debounce";

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
export interface Brick {
  _id: string;
  brickName: string;
  city: string;
  mrName: string;
  areas: string[];
  pharmacies: string[];
  doctors: string[];
  products: string[];
}
export default function Brick() {
  const [openModel, setOpenModel] = useState(false);
  const [editingBrick, setEditingBrick] = useState<Brick | null>(null);
  const [loading, setloading] = useState(false);
  const [isloadingDelete, setLoadingDelete] = useState(false);
  const [searchBrickName, setSearchBrickName] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const debouncedBrickName = useDebounce(searchBrickName, 500);

  const { data: allMr } = useQuery({
    queryKey: ["AllAccount"],
    queryFn: () => getAllAccounts(),
    staleTime: 5 * 60 * 1000,
  });
  let limit = 100;

  const { data: pharmacies } = useQuery({
    queryKey: ["pharmacies", limit],
    queryFn: () => getAllPharmacies({ limit }),
  });

  const { data: doctorss } = useQuery({
    queryKey: ["AllDoctors"],
    queryFn: () => getAllDoctorsLIst(),
  });

  const { data: Products } = useQuery({
    queryKey: ["getAllProductsMR"],
    queryFn: () => getAllProductsMR(),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: BrickData,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["bricks", debouncedBrickName],
    queryFn: () => getAllBricks(debouncedBrickName),
  });

  useEffect(() => {
    document.title = "MediRep | Brick";
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      brickName: editingBrick?.brickName ?? "",
      city: editingBrick?.city ?? "",
      mrName: editingBrick?.mrName ?? "",
      areas: editingBrick?.areas ?? [],
      pharmacies: editingBrick?.pharmacies ?? [],
      doctors: editingBrick?.doctors ?? [],
      products: editingBrick?.products ?? [],
    },
    validationSchema: BrickSchema,
    onSubmit: (values) => {
      setloading(true);
      if (editingBrick) {
        updateBrick(editingBrick._id, values)
          .then(() => {
            notifySuccess("Brick Updated Successfully");
            setOpenModel(false);
            setEditingBrick(null);
            formik.resetForm();
            refetch();
          })
          .catch((error) => {
            console.error(error);
            notifyError("Failed to Update Brick.");
          })
          .finally(() => setloading(false));
      } else {
        createBrick(values)
          .then(() => {
            notifySuccess("Brick Added Successfully");
            setOpenModel(false);
            formik.resetForm();
            refetch();
          })
          .catch((error) => {
            console.error(error);
            notifyError("Failed to Add Brick.");
          })
          .finally(() => setloading(false));
      }
    },
  });
  const productOptions =
    Products?.data?.data?.map((d: any) => d.productName) || [];
  const pharmacyOptions = pharmacies?.data?.data?.map((p: any) => p.name) || [];
  const doctorOptions = doctorss?.data?.data?.map((d: any) => d.name) || [];
  const AllMR =
    allMr?.data?.admins?.filter(
      (mr: any) => mr?.position === "MedicalRep(MR)",
    ) || [];

  const tableData = BrickData?.data?.map((brick: any) => [
    brick.brickId,
    brick.brickName,
    brick.city,
    brick.mrName,
    brick.areas?.join(", ") || "-",
    brick.products?.join(", ") || "-",
    brick.pharmacies?.length || 0,
    brick.doctors?.length || 0,
    <div className="flex gap-2">
      <TbEdit
        onClick={() => {
          setEditingBrick(brick);
          setOpenModel(true);
        }}
        size={18}
        className="cursor-pointer text-primary"
      />
      <Icon
        icon="mingcute:delete-line"
        color="#E90761"
        height="18"
        width="20"
        className="cursor-pointer"
        onClick={() => {
          setEditingBrick(brick);
          setDeleteConfirmation(true);
        }}
      />
    </div>,
  ]);

  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 24, color: "white" }} spin />
  );
  const handleDelete = () => {
    const id = editingBrick?._id;
    if (!id) return notifyError("Invalid Brick ID");

    setLoadingDelete(true);
    deleteBrick(id)
      .then(() => {
        notifySuccess("Brick Deleted Successfully");
        setDeleteConfirmation(false);
        refetch();
      })
      .catch(() => notifyError("Failed to Delete Brick"))
      .finally(() => setLoadingDelete(false));
  };
  return (
    <>
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap md:flex-nowrap gap-4 justify-between items-start">
          <p className="text-heading w-full lg:w-auto font-medium text-[22px] sm:text-[24px]">
            Brick
          </p>
          <div className="flex w-full lg:w-auto flex-wrap md:flex-nowrap items-center gap-4">
            <div className="md:w-[250px] w-full">
              <SearchByName
                name="Brick Name:"
                onChange={(val) => {
                  setSearchBrickName(val);
                }}
              />
            </div>
            <button
              onClick={() => {
                setOpenModel(true);
                setEditingBrick(null);
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
          <p className="text-[#7D7D7D] font-medium text-sm">Brick List</p>
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="scroll-smooth bg-white mt-4 rounded-xl 2xl:h-[calc(68.5vh-0px)] xl:h-[calc(59vh-0px)]  overflow-y-auto scrollbar-none"
          >
            <CustomTable
              titles={titles}
              data={tableData}
              isFetching={isFetching}
            />
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
                {editingBrick ? "Update Brick" : "Add Brick"}
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
            <form onSubmit={formik.handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 ">
                <div className="space-y-4">
                  <div>
                    <CustomInput
                      label="Brick Name"
                      placeholder="Enter Brick Name"
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
                      placeholder="Enter City"
                      name="city"
                      value={formik.values.city}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />

                    {formik.touched.city && formik.errors.city && (
                      <p className="text-red-500 text-xs">
                        {formik.errors.city}
                      </p>
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
                    onChange={(value) =>
                      formik.setFieldValue("products", value)
                    }
                  />
                </div>
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
                  className="h-[55px] md:w-[200px] w-full bg-primary text-white rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
                >
                  {loading ? (
                    <Spin indicator={antIcon} />
                  ) : editingBrick ? (
                    "Update Brick"
                  ) : (
                    "Add Brick"
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
