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

  const [bricksData, setBricksData] = useState(initialBricksData);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deletestore, setDeletestore] = useState<any>(null);
  const [isloadingDelete] = useState(false);

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

  // ---------------- EDIT ----------------
  const handleEdit = (brick: any) => {
    setEditingProduct(brick);
    setSelectedAreas(brick.areaNames || []);
    setSelectedPharmacies(brick.Pharmacies || []);
    setSelectedDoctors(brick.doctors || []);
    setSelectedProducts(brick.products || []);
    setSelectedMR(brick.mrName || "");
    setOpenModel(true);
  };

  // ---------------- DELETE ----------------
  const handleDelete = (brickId: any) => {
    setBricksData(bricksData.filter((b) => b.brickId !== brickId));
    setDeleteConfirmation(false);
    setDeletestore(null);
  };

  // ---------------- SAVE ----------------
  const handleSave = () => {
    const brickPayload = {
      brickName: (
        document.getElementsByName("brickName")[0] as HTMLInputElement
      ).value,
      city: (document.getElementsByName("city")[0] as HTMLInputElement).value,
      mrName: selectedMR,
      areaNames: selectedAreas,
      Pharmacies: selectedPharmacies,
      doctors: selectedDoctors,
      products: selectedProducts,
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

    // RESET
    setEditingProduct(null);
    setSelectedAreas([]);
    setSelectedPharmacies([]);
    setSelectedDoctors([]);
    setSelectedProducts([]);
    setSelectedMR("");
    setOpenModel(false);
  };

  // ---------------- TABLE ----------------
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
          setDeletestore(brick.brickId);
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
        <div className="flex flex-wrap gap-4 justify-between items-start">
          <p className="text-heading w-full lg:w-auto font-medium text-[22px] sm:text-[24px]">
            Brick
          </p>
          <div className="flex items-center gap-4">
            <div className="md:w-[250px] w-full">
              <SearchByName name="Brick Name:" />
            </div>
            <button
              onClick={() => {
                setEditingProduct(null);
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
            <CustomTable titles={titles} data={tableData} />
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
                  options={AllMR.map((mr: any) => mr.name)}
                />
              </div>

              <div className="space-y-4">
                <MultiSelect
                  label="Areas"
                  options={aeraSelection}
                  value={selectedAreas}
                  onChange={setSelectedAreas}
                />
                <MultiSelect
                  label="Pharmacies"
                  options={pharmacyOptions}
                  value={selectedPharmacies}
                  onChange={setSelectedPharmacies}
                />
                <MultiSelect
                  label="Doctors"
                  options={doctorOptions}
                  value={selectedDoctors}
                  onChange={setSelectedDoctors}
                />
                <MultiSelect
                  label="Products"
                  options={productOptions}
                  value={selectedProducts}
                  onChange={setSelectedProducts}
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleSave}
                className="bg-primary text-white w-[150px] h-[50px] px-6 py-2 rounded"
              >
                Save
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

// const CustomSelectMR = ({
//   options = [],
//   value,
//   onChange,
//   placeholder = "Select MR",
//   firstSelected = false,
// }: {
//   options: { label: string; value: string }[];
//   value?: string | null;
//   onChange?: (value: string) => void;
//   placeholder?: string;
//   firstSelected?: boolean;
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [selected, setSelected] = useState<string | null>(value || null);

//   useEffect(() => {
//     setSelected(value || null);
//   }, [value]);

//   useEffect(() => {
//     if (firstSelected && options.length > 0 && !value) {
//       setSelected(options[0].value);
//       onChange?.(options[0].value);
//     }
//   }, [options, value, onChange, firstSelected]);

//   const handleSelect = (option: { label: string; value: string }) => {
//     setSelected(option.value);
//     onChange?.(option.value);
//     setIsOpen(false);
//   };

//   return (
//     <div className="relative w-full">
//       <label className="absolute -top-2 left-5 bg-white px-1 text-xs text-[#7d7d7d]">
//         {placeholder}
//       </label>
//       <div
//         className="flex items-center h-14 justify-between bg-white px-4 py-2 border-[0.5px] border-primary rounded-md cursor-pointer"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <span
//           className={`text-sm ${selected ? "text-heading" : "text-[#7d7d7d]"}`}
//         >
//           {selected
//             ? options.find((opt) => opt.value === selected)?.label
//             : "Select the Options"}
//         </span>
//         <IoIosArrowDown
//           className={`transition-transform duration-200 text-primary ${
//             isOpen ? "rotate-180" : "rotate-0"
//           }`}
//         />
//       </div>
//       {isOpen && options.length > 0 && (
//         <ul
//           style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//           className="absolute mt-1 w-full bg-[#E5EBF7] border border-gray-200 rounded-md shadow-xl z-10 max-h-60 overflow-y-auto"
//         >
//           {options.map((option, index) => (
//             <li
//               key={index}
//               className={`px-4 flex items-center h-[56px] text-sm cursor-pointer ${
//                 selected === option.value
//                   ? "bg-primary text-white"
//                   : "text-heading hover:bg-gray-100"
//               }`}
//               onClick={() => handleSelect(option)}
//             >
//               {option.label}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };
