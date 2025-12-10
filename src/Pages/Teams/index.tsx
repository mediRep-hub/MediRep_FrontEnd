// import { Icon } from "@iconify/react";
// import SearchDateRange from "../../Components/SearchBar/SearchDateRange";
// import { SearchSelection } from "../../Components/SearchBar/SearchSelection";
// import { useEffect, useState } from "react";
// import { IoIosArrowDown, IoMdCloseCircle } from "react-icons/io";
// import CustomSelect from "../../Components/Select";
// import CustomInput from "../../Components/CustomInput";
// import MultiSelect from "../../Components/MultiSelect";
// import { Avatar, Spin } from "antd";
// import { notifyError } from "../../Components/Toast";
// import { useFormik } from "formik";
// import { RiAlertFill } from "react-icons/ri";
// import { Loading3QuartersOutlined } from "@ant-design/icons";
// import Pagination from "../../Components/Pagination";
// import { useQuery } from "@tanstack/react-query";
// import { getAllAccounts } from "../../api/adminServices";

import { Icon } from "@iconify/react";
import SearchDateRange from "../../Components/SearchBar/SearchDateRange";
import { SearchSelection } from "../../Components/SearchBar/SearchSelection";

// const areaOptions: string[] = [
//   "All",
//   "Lahore",
//   "Islamabad",
//   "BahawalPur",
//   "Karachi",
// ];
// export default function Teams() {
//   const [addTeamModel, setAddTeamModel] = useState(false);
//   const [editingTeam, setEditingTeam] = useState<any>(null);
//   const [isloading, setLoading] = useState(false);
//   const [deleteConfirmation, setDeleteConfirmation] = useState(false);
//   const [selectedTeam, setSelectedTeam] = useState<any>(null);
//   const [selectedMR, setSelectedMR] = useState<string>("");
//   const [selectedArea, setSelectedArea] = useState<string>("");
//   const [isloadingDelete, setLoadingDelete] = useState(false);
//   const [selectedDate, setSelectedDate] = useState<{
//     start: string;
//     end: string;
//   }>({
//     start: "",
//     end: "",
//   });
//   const { data: allMr } = useQuery({
//     queryKey: ["AllAccount"],
//     queryFn: () => getAllAccounts(),
//     staleTime: 5 * 60 * 1000,
//   });
//   const AllMR = allMr?.data?.admins ?? [];

//   useEffect(() => {
//     document.title = "MediRep | Teams";
//   }, []);
//   const antIcon = (
//     <Loading3QuartersOutlined style={{ fontSize: 24, color: "white" }} spin />
//   );

//   const antIcon22 = (
//     <Loading3QuartersOutlined style={{ fontSize: 50, color: "#0755E9" }} spin />
//   );
//   const formik = useFormik({
//     initialValues: {
//       name: "",
//       email: "",
//     },
//     onSubmit: (values) => {
//       console.log(values);
//     },
//   });
//   return (
//     <>
//       <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
//         <div className="flex flex-wrap gap-4 justify-between items-start">
//           <p className="text-heading w-full lg:w-auto font-medium text-[22px] sm:text-[24px]">
//             Teams
//           </p>
//           <div className="flex flex-wrap w-auto md:w-full lg:w-auto items-center gap-3">
//             <div className="lg:w-[200px] 2xl:w-[300px] md:w-[calc(33%-8px)] w-full">
//               <SearchSelection
//                 placeholder="Select MR"
//                 options={[
//                   "All",
//                   ...AllMR.filter(
//                     (mr: any) => mr?.position === "MedicalRep(MR)"
//                   ).map((mr: any) => mr?.name),
//                 ]}
//                 value={selectedMR}
//                 onChange={(val) => {
//                   setSelectedMR(val);
//                 }}
//               />
//             </div>{" "}
//             <div className="lg:w-[200px] 2xl:w-[300px] md:w-[calc(33%-8px)] md:mt-0 mt-2 w-full">
//               <SearchSelection
//                 placeholder="Select Area"
//                 options={areaOptions}
//                 value={selectedArea}
//                 onChange={(val) => {
//                   setSelectedArea(val);
//                 }}
//               />
//             </div>{" "}
//             <div className="lg:w-[200px] 2xl:w-[300px] md:w-[calc(33%-8px)] md:mt-0 mt-2 w-full">
//               <SearchDateRange
//                 onChange={(range: { start: string; end: string }) => {
//                   setSelectedDate(range);
//                 }}
//               />
//             </div>
//           </div>
//           <button
//             onClick={() => {
//               setAddTeamModel(true);
//               setEditingTeam(null);
//             }}
//             className="h-[55px] w-full md:w-[200px] bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
//           >
//             <Icon
//               icon="mingcute:add-fill"
//               height="20"
//               width="20"
//               color="#fff"
//             />
//             <p className="text-white text-base font-medium">Create Team</p>
//           </button>
//         </div>
//         <div className="bg-[#E5EBF7] flex-wrap flex gap-4 mt-4 rounded-[12px] p-4 2xl:h-[calc(75.7vh-0px)] xl:h-[calc(64vh-0px)] h-auto ">
//           <div className="lg:w-[calc(25%-8px)] w-full">
//             <div className="flex justify-between items-center">
//               <p className="text-[#7D7D7D] font-medium text-sm">Teams List</p>
//               <Pagination
//               // currentPage={page}
//               // totalItems={result?.totalItems}
//               // itemsPerPage={limit}
//               // onPageChange={(newPage) => setPage(newPage)}
//               />
//             </div>
//             {/* {isFetching ? (
//               <div className="mt-5 flex justify-center">
//                 <Spin indicator={antIcon22} />
//               </div>
//             ) : AllTeam && AllTeam.length > 0 ? (
//               <div
//                 style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//                 className="scroll-smooth 2xl:h-[calc(68vh-0px)] xl:h-[calc(53vh-0px)] mt-4 overflow-y-auto scrollbar-none"
//               >
//                 {AllTeam.map((mr: any, index: number) => (
//                   <div
//                     key={mr._id || index}
//                     className={`bg-white p-5 first:mt-0 mt-4 rounded-xl cursor-pointer ${
//                       selectedTeam?._id === mr._id
//                         ? "border-2 border-primary"
//                         : "border-2 border-white"
//                     }`}
//                     onClick={() => {
//                       setSelectedTeam(mr);
//                       setDoctorPage(1);
//                     }}
//                   >
//                     <div className="flex items-start justify-between">
//                       <Avatar size={42} src={mr?.mrName?.image} />
//                       <div className="flex items-center gap-2">
//                         <Icon
//                           color="#E90761"
//                           height="18"
//                           width="20"
//                           icon="mingcute:delete-fill"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             setDeleteConfirmation(true);
//                             setEditingProduct(mr);
//                           }}
//                         />
//                       </div>
//                     </div>
//                     <p className="text-[#131313] capitalize text-sm mt-3">
//                       {typeof mr.mrName === "string"
//                         ? mr.mrName
//                         : mr.mrName?.name || "--"}
//                     </p>
//                     <p className="text-primary text-sm ">
//                       MR ID: {mr?.mrName?.adminId}
//                     </p>
//                     <p className="text-[#131313] text-sm ">
//                       Brick Name: {mr.brickName}
//                     </p>
//                     <p className="text-[#131313] text-sm ">
//                       MR Status:{" "}
//                       <span className="text-primary">
//                         {mr?.mrStatus?.completedCalls}
//                       </span>
//                       /{mr?.mrStatus?.totalCalls}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="mt-5 text-center text-heading text-base">
//                 No data found
//               </div>
//             )} */}
//             <p className="my-5 text-center">No Data</p>
//           </div>
//           <div className="lg:w-[calc(75%-8px)] w-full">
//             <div className="flex justify-between items-center">
//               <p className="text-[#7D7D7D] font-medium text-sm">Call List</p>
//               <Pagination
//               // currentPage={doctorPage}
//               // totalItems={selectedBrick?.doctorList?.length || 0}
//               // itemsPerPage={doctorLimit}
//               // onPageChange={(newPage) => setDoctorPage(newPage)}
//               />
//             </div>

//             <div
//               style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//               className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(68vh-0px)] xl:h-[calc(53vh-0px)] mt-4 overflow-y-auto scrollbar-none"
//             >
//               <p className="my-5 text-center">No Data</p>
//               {/* <table className="w-full border-collapse min-w-[700px]">
//                 <thead className="sticky top-0 z-[1] h-[56px] bg-white">
//                   <tr>
//                     {titles?.map((title, index) => (
//                       <th
//                         key={index}
//                         className="border-b border-primary px-5 py-2 text-[12px] font-medium text-heading text-left bg-white"
//                       >
//                         {title}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {isFetching ? (
//                     <tr>
//                       <td
//                         colSpan={titles.length}
//                         className="py-5 text-center text-[#7d7d7d]"
//                       >
//                         <Spin indicator={antIcon} />
//                       </td>
//                     </tr>
//                   ) : doctorList.length > 0 ? (
//                     doctorList.map((doc: any, rowIndex: number) => (
//                       <tr
//                         key={rowIndex}
//                         className="hover:bg-[#E5EBF7] h-[56px] hover:text-black cursor-pointer"
//                         onClick={() => handleGoTODetails(doc)}
//                       >
//                         <td className="px-5 py-2 min-w-[120px]   border-b-[0.5px] text-[13px] border-primary">
//                           {doc.callId}
//                         </td>
//                         <td className="px-5 py-2 min-w-[120px] border-b-[0.5px] text-[13px] border-primary">
//                           {doc.doctor?.name || "--"}
//                         </td>
//                         <td className="px-5 py-2 min-w-[120px] border-b-[0.5px] text-[13px] border-primary">
//                           <p
//                             className={`inline-block px-2 py-0.5 capitalize  rounded-sm font-medium text-sm border ${
//                               doc.status === "pending"
//                                 ? "text-[#E90761] border-[#E90761]"
//                                 : doc.status === "close"
//                                 ? "text-[#0BA69C] border-[#0BA69C]"
//                                 : doc.status === "check In"
//                                 ? "text-[#FF9500] border-[#FF9500]"
//                                 : "text-heading border-heading"
//                             }`}
//                           >
//                             {doc.status}
//                           </p>
//                         </td>
//                         <td className="px-5 py-2 min-w-[120px] border-b-[0.5px] text-[13px] border-primary">
//                           <div className="flex gap-3">
//                             <FiClock
//                               size={16}
//                               className="inline text-[#7d7d7d]"
//                             />{" "}
//                             {doc.checkIn || "--"}
//                           </div>
//                         </td>
//                         <td className="px-5 py-2 min-w-[150px] border-b-[0.5px] text-[13px] border-primary">
//                           <div className="flex gap-3">
//                             <FiClock
//                               size={16}
//                               className="inline text-[#7d7d7d]"
//                             />{" "}
//                             {doc.checkOut || "--"}
//                           </div>
//                         </td>
//                         <td className="px-5 py-2 min-w-[150px] border-b-[0.5px] text-[13px] border-primary">
//                           <div
//                             className="flex gap-3 items-center"
//                             onClick={(e) => {
//                               SetViewdetails(true);
//                               e.stopPropagation();
//                             }}
//                           >
//                             <Icon
//                               icon="iconoir:notes"
//                               height="16"
//                               width="16"
//                               color="#7d7d7d"
//                             />
//                             Details
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td
//                         colSpan={titles.length}
//                         className="px-3 py-6 text-center text-heading"
//                       >
//                         No data found
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table> */}
//             </div>
//           </div>
//         </div>
//       </div>

//       {addTeamModel && (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
//           <div
//             style={{
//               scrollbarWidth: "none",
//               msOverflowStyle: "none",
//             }}
//             className="bg-white rounded-xl xl:mx-0 mx-5 w-[1000px] max-h-[90vh] overflow-x-auto xl:p-6 p-4 shadow-xl relative"
//           >
//             <div className="flex items-center justify-between ">
//               <p className="text-[24px] text-heading capitalize font-medium">
//                 {editingTeam === null ? "Create Team" : "Update  Team"}
//               </p>
//               <IoMdCloseCircle
//                 size={20}
//                 onClick={() => {
//                   setAddTeamModel(false);
//                 }}
//                 className="cursor-pointer text-primary"
//               />
//             </div>
//             <p className="text-base font-normal text-[#979797]">
//               Define focused visit strategies for the team.
//             </p>
//             <form onSubmit={formik.handleSubmit}>
//               <div className="flex flex-wrap mt-5 gap-8">
//                 <div className="md:w-[calc(50%-16px)] w-full">
//                   <p className="text-base font-normal text-heading">
//                     Brick Details
//                   </p>
//                   <div className="mt-3">
//                     <CustomSelect
//                     // options={selectRegionOptions}
//                     // value={formik.values.region}
//                     // onChange={(val) => formik.setFieldValue("region", val)}
//                     // placeholder="Region"
//                     />
//                     {/* {formik.touched.region && formik.errors.region && (
//                       <div className="text-red-500 text-xs">
//                         *{String(formik.errors.region)}
//                       </div>
//                     )} */}
//                   </div>
//                   <div className="mt-3">
//                     <CustomSelect
//                     // options={cityOptions}
//                     // value={formik.values.area}
//                     // onChange={(val) => formik.setFieldValue("area", val)}
//                     // placeholder="Area"
//                     />
//                     {/* {formik.touched.area && formik.errors.area && (
//                       <div className="text-red-500 text-xs">
//                         *{String(formik.errors.area)}
//                       </div>
//                     )} */}
//                   </div>
//                   <div className="mt-3">
//                     <CustomInput
//                       label="Brick Name"
//                       name="brickName"
//                       placeholder="Write The Team Name "
//                       // value={formik.values.brickName}
//                       // onChange={formik.handleChange}
//                     />
//                     {/* {formik.touched.brickName && formik.errors.brickName && (
//                       <div className="text-red-500 text-xs">
//                         *{String(formik.errors.brickName)}
//                       </div>
//                     )} */}
//                   </div>
//                   <div className="mt-3">
//                     <CustomSelect
//                     // options={selectRouteOptions}
//                     // value={formik.values.route}
//                     // onChange={(val) => formik.setFieldValue("route", val)}
//                     // placeholder="Route Status"
//                     />
//                     {/* {formik.touched.route && formik.errors.route && (
//                       <div className="text-red-500 text-xs">
//                         *{String(formik.errors.route)}
//                       </div>
//                     )} */}
//                   </div>
//                 </div>
//                 <div className="md:w-[calc(50%-16px)] w-full">
//                   <p className="text-base font-normal text-heading">
//                     Set Doctors
//                   </p>
//                   <div className="mt-3">
//                     <CustomSelect
//                     // options={selectDaysOptions}
//                     // value={formik.values.day}
//                     // onChange={(val) => formik.setFieldValue("day", val)}
//                     // placeholder="Select Day"
//                     />
//                     {/* {formik.touched.day && formik.errors.day && (
//                       <div className="text-red-500 text-xs">
//                         *{String(formik.errors.day)}
//                       </div>
//                     )} */}
//                   </div>
//                   <div className="mt-3">
//                     {/* <CustomSelectMR
//                       options={[
//                         ...AllMR.filter(
//                           (mr: any) => mr?.position === "MedicalRep(MR)"
//                         ).map((mr: any) => ({
//                           label: mr.name,
//                           value: mr._id,
//                         })),
//                       // ]}
//                       value={formik.values.mrName}
//                       onChange={(val) => formik.setFieldValue("mrName", val)}
//                       placeholder="Select MR"
//                     /> */}

//                     {/* {formik.touched.mrName && formik.errors.mrName && (
//                       <div className="text-red-500 text-xs">
//                         *{String(formik.errors.mrName)}
//                       </div>
//                     )} */}
//                   </div>
//                   <div className="mt-3">
//                     {/* <MultiSelect
//                       options={AllDOctors.map((doc: any) => doc.name)}
//                       value={formik.values.doctorList}
//                       onChange={(val) =>
//                         formik.setFieldValue("doctorList", val)
//                       }
//                       placeholder="Select Doctor"
//                     /> */}
//                     {/* {formik.touched.doctorList && formik.errors.doctorList && (
//                       <div className="text-red-500 text-xs">
//                         *{String(formik.errors.doctorList)}
//                       </div>
//                     )} */}
//                   </div>
//                 </div>
//               </div>
//               <div className="flex justify-end mt-5">
//                 <button
//                   type="submit"
//                   className="h-[55px] md:w-[200px] w-full bg-primary text-white rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
//                 >
//                   {isloading ? (
//                     <Spin indicator={antIcon} />
//                   ) : editingTeam === null ? (
//                     "Create Team"
//                   ) : (
//                     "Update Team"
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//       {deleteConfirmation && (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
//           <div className="bg-white rounded-xl xl:mx-0 mx-5 w-[500px] h-auto overflow-x-auto xl:p-6 p-4 shadow-xl relative">
//             <RiAlertFill className="text-[120px] text-yellow-500 text-center mx-auto mb-2" />
//             <div className="text-center">
//               <h2 className="text-xl font-semibold text-primary mt-5">
//                 Confirm Delete
//               </h2>
//               <p className="mb-6">
//                 Are you sure you want to delete this <strong>Brick</strong>
//               </p>
//             </div>
//             <div className="flex mt-5 justify-between gap-4">
//               <button
//                 onClick={() => {
//                   setDeleteConfirmation(false);
//                 }}
//                 className="px-7 py-2 bg-gray-200 rounded hover:bg-gray-300"
//               >
//                 Cancel
//               </button>
//               {/* <button
//                 onClick={handleDelete}
//                 disabled={isloadingDelete}
//                 className="px-7 py-2 bg-[#E90761] text-white rounded flex justify-center items-center"
//               >
//                 {isloadingDelete ? <Spin indicator={antIcon} /> : "Delete"}
//               </button> */}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

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

export default function Teams() {
  return (
    <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
      <div className="flex flex-wrap gap-4 justify-between items-start">
        <p className="text-heading w-full lg:w-auto font-medium text-[22px] sm:text-[24px]">
          Teams
        </p>
        <div className="flex flex-wrap w-auto md:w-full lg:w-auto items-center gap-3">
          <div className="lg:w-[200px] 2xl:w-[300px] md:w-[calc(33%-8px)] w-full">
            <SearchSelection />
          </div>{" "}
          <div className="lg:w-[200px] 2xl:w-[300px] md:w-[calc(33%-8px)] md:mt-0 mt-2 w-full">
            <SearchSelection placeholder="Select Area" />
          </div>{" "}
          <div className="lg:w-[200px] 2xl:w-[300px] md:w-[calc(33%-8px)] md:mt-0 mt-2 w-full">
            <SearchDateRange />
          </div>
        </div>
        <button className="h-[55px] w-full md:w-[200px] bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center">
          <Icon icon="mingcute:add-fill" height="20" width="20" color="#fff" />
          <p className="text-white text-base font-medium">Create Team</p>
        </button>
      </div>
      <div className="bg-[#E5EBF7] flex-wrap flex gap-4 mt-4 rounded-[12px] p-4 2xl:h-[calc(75.7vh-0px)] xl:h-[calc(64vh-0px)] h-auto "></div>
    </div>
  );
}
