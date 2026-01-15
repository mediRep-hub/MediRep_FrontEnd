// import { useState, useEffect } from "react";
// import dayjs, { Dayjs } from "dayjs";
// import TimePicker from "../../Components/TimePicker";
// import {
//   GetCompanyTimingAPI,
//   setCompanyTimingAPI,
// } from "../../api/attendanceServices";
// import CustomInput from "../../Components/CustomInput";
// import { useQuery } from "@tanstack/react-query";
// import { notifyError, notifySuccess } from "../../Components/Toast";

// export default function Setting() {
//   const [startTime, setStartTime] = useState<Dayjs | null>(null);
//   const [endTime, setEndTime] = useState<Dayjs | null>(null);
//   const [lateAfterMinutes, setLateAfterMinutes] = useState<number>(0);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     document.title = "MediRep | Setting";
//   }, []);
//   const { data } = useQuery({
//     queryKey: ["GetCompanyTimingAPI"],
//     queryFn: GetCompanyTimingAPI,
//     staleTime: 5 * 60 * 1000,
//   });

//   // Set default values when data is loaded
//   useEffect(() => {
//     if (data?.data?.timing) {
//       setStartTime(dayjs(data.data?.timing.startTime, "HH:mm"));
//       setEndTime(dayjs(data.data?.timing.endTime, "HH:mm"));
//       setLateAfterMinutes(data.data?.timing.lateAfterMinutes || 0);
//     }
//   }, [data]);

//   const handleSubmit = async () => {
//     if (!startTime || !endTime) {
//       notifyError("Please select both start and end time.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const payload = {
//         startTime: startTime.format("HH:mm"),
//         endTime: endTime.format("HH:mm"),
//         lateAfterMinutes,
//       };

//       const response = await setCompanyTimingAPI(payload);
//       notifySuccess("Company timing updated successfully!");
//       console.log("Response:", response.data);
//     } catch (error: any) {
//       console.error(error);
//       notifyError(error.response?.data?.message || "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-[#F7F7F7] md:h-[calc(100vh-129px)] h-auto rounded-xl p-4">
//       <div className="bg-[#E5EBF7] p-4 rounded-xl h-auto">
//         <div
//           style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//           className="scroll-smooth bg-white p-4 rounded-xl 2xl:h-[calc(82vh-0px)] xl:h-[calc(70vh-0px)] overflow-y-auto scrollbar-none"
//         >
//           <p className="mb-2 text-lg font-semibold">Office Timing</p>

//           <div className="flex gap-5 pt-3 w-200">
//             <TimePicker
//               placeholder="Select Start Time"
//               label="Start Time"
//               value={startTime}
//               onChange={(val: Dayjs | null) => setStartTime(val)}
//             />
//             <TimePicker
//               placeholder="Select End Time"
//               label="End Time"
//               value={endTime}
//               onChange={(val: Dayjs | null) => setEndTime(val)}
//             />
//             <CustomInput
//               label="Late After (minutes)"
//               value={lateAfterMinutes}
//               onChange={(e) => setLateAfterMinutes(Number(e.target.value))}
//             />
//           </div>

//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="h-10 px-4 py-2 mt-4 text-white bg-blue-600 rounded cursor-pointer hover:bg-blue-700"
//           >
//             {loading ? "Saving..." : "Save Timing"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
