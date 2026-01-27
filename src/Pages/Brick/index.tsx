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
  "Area’s Name",
  "No of Doctors/Pharmacy",
  "Action",
];

export default function Brick() {
  const [openModel, setOpenModel] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedPharmacies, setSelectedPharmacies] = useState<string[]>([]);
  const [bricksData, setBricksData] = useState(initialBricksData);

  const { data: pharmaciesData } = useQuery({
    queryKey: ["pharmacies"],
    queryFn: () => getAllPharmacies({ page: 1, limit: 100 }),
  });

  const pharmacyOptions =
    pharmaciesData?.data?.data?.map((pharmacy: any) => pharmacy.name) || [];

  useEffect(() => {
    document.title = "MediRep | Brick";
  }, []);

  const handleEdit = (brick: any) => {
    setEditingProduct(brick);
    setSelectedAreas(brick.areaNames || []);
    setSelectedPharmacies(brick.Pharmacies || []);
    setOpenModel(true);
  };

  const handleDelete = (brickId: string) => {
    const updatedBricks = bricksData.filter((b) => b.brickId !== brickId);
    setBricksData(updatedBricks);
  };

  const handleSave = () => {
    if (!editingProduct) {
      const newBrick = {
        brickId: Date.now().toString(),
        brickName: (
          document.getElementsByName("brickName")[0] as HTMLInputElement
        ).value,
        city: (document.getElementsByName("city")[0] as HTMLInputElement).value,
        areaNames: selectedAreas,
        Pharmacies: selectedPharmacies,
      };
      setBricksData([...bricksData, newBrick]);
    } else {
      const updatedBricks = bricksData.map((b) =>
        b.brickId === editingProduct.brickId
          ? {
              ...b,
              brickName: (
                document.getElementsByName("brickName")[0] as HTMLInputElement
              ).value,
              city: (document.getElementsByName("city")[0] as HTMLInputElement)
                .value,
              areaNames: selectedAreas,
              Pharmacies: selectedPharmacies,
            }
          : b,
      );
      setBricksData(updatedBricks);
    }

    setEditingProduct(null);
    setSelectedAreas([]);
    setSelectedPharmacies([]);
    setOpenModel(false);
  };

  const tableData = bricksData.map((brick: any) => [
    brick.brickId,
    brick.brickName,
    brick.city,
    brick.areaNames?.join(", ") || "",
    brick.Pharmacies.length,
    <div className="flex items-center gap-2">
      <TbEdit
        size={18}
        className="text-primary cursor-pointer"
        onClick={() => handleEdit(brick)}
      />
      <Icon
        color="#E90761"
        height="18"
        width="20"
        icon="mingcute:delete-fill"
        className="cursor-pointer"
        onClick={() => handleDelete(brick.brickId)}
      />
    </div>,
  ]);

  return (
    <>
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap gap-4 justify-between items-start">
          <p className="text-heading w-full lg:w-auto font-medium text-[22px] sm:text-[24px]">
            Brick
          </p>

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
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="bg-white rounded-xl xl:mx-0 mx-5 w-[1000px] max-h-[90vh] overflow-x-auto xl:p-6 p-4 shadow-xl relative"
          >
            <div>
              <div className="flex items-center justify-between ">
                <p className="text-[24px] text-heading capitalize font-semibold">
                  {editingProduct ? "Edit Brick" : "Add Brick"}
                </p>
                <IoMdCloseCircle
                  size={20}
                  onClick={() => setOpenModel(false)}
                  className="cursor-pointer text-primary"
                />
              </div>

              <div className="flex flex-wrap mt-5 gap-8">
                <div className="md:w-[calc(50%-16px)] space-y-4 w-full">
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
                </div>

                <div className="md:w-[calc(50%-16px)] space-y-4 w-full">
                  <MultiSelect
                    label="Area"
                    options={aeraSelection}
                    value={selectedAreas}
                    onChange={setSelectedAreas}
                    placeholder="Enter Area Names"
                  />
                  <MultiSelect
                    label="Pharmacies"
                    options={pharmacyOptions}
                    value={selectedPharmacies}
                    onChange={setSelectedPharmacies}
                    placeholder="Enter Pharmacies"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-5 ">
                <button
                  className="bg-primary text-white px-6 py-2 rounded"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
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
