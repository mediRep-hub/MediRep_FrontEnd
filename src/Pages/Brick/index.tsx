import { Icon } from "@iconify/react";
import CustomTable from "../../Components/CustomTable";
import { IoMdCloseCircle } from "react-icons/io";
import CustomInput from "../../Components/CustomInput";
import MultiSelect from "../../Components/MultiSelect";
import { Spin } from "antd";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import CustomSelect from "../../Components/Select";
import SearchByName from "../../Components/SearchBar/searchByName";
import { useState } from "react";

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
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [isloadingDelete] = useState(false);

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
            <CustomTable titles={titles} />
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
                />
              </div>

              <div className="space-y-4">
                <MultiSelect
                  label="Areas"
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
                />
              </div>
            </div>

            <div className="flex justify-end mt-6 xl:p-6 p-4 gap-4">
              <button
                onClick={() => setOpenModel(false)}
                className="h-[55px] md:w-[100px] w-full bg-[#F2FAFD] text-[#131313] rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
              >
                Cancel
              </button>
              <button className="bg-primary text-white w-[150px] h-[50px] px-6 py-2 rounded">
                Create Brick
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
