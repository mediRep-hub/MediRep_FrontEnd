import React from "react";
import CustomTable from "../../../Components/CustomTable";

const titles = [
  "Camp Type",
  "Sample Type:",
  "Camp Time",
  "Camp Start Date",
  "Camp End Date",
  "Mr Type",
  "Brick Code",
  "Chemists",
  "Products",
  "Action",
];
const rawData = [
  [
    "Blood Sugar Camp",
    "Sample Kit",
    "09:00 AM",
    "2026-04-20",
    "2026-04-22",
    "Senior MR",
    "BR-001",
    5,
    "Panadol, Disprin",
    "Approved",
  ],
  [
    "SpO2 Camp",
    "Paid Sample",
    "10:00 AM",
    "2026-04-25",
    "2026-04-27",
    "Junior MR",
    "BR-002",
    3,
    "Brufen, Augmentin",
    "Completed",
  ],
  [
    "BMI Camp",
    "Free Sample",
    "11:00 AM",
    "2026-05-01",
    "2026-05-03",
    "Senior MR",
    "BR-003",
    8,
    "Flagyl, Metformin",
    "Rejected",
  ],
  [
    "HbA1c Camp",
    "Sample Kit",
    "12:00 PM",
    "2026-05-10",
    "2026-05-12",
    "Field MR",
    "BR-004",
    2,
    "Vitamin D, Calcium",
    "Approved",
  ],
  [
    "Hepatitis Rapid Camp",
    "Sample Kit",
    "01:00 PM",
    "2026-05-10",
    "2026-05-12",
    "Field MR",
    "BR-005",
    4,
    "ORS, Zinc",
    "Approved",
  ],
  [
    "Dengue Rapid Camp",
    "Sample Kit",
    "02:00 PM",
    "2026-05-10",
    "2026-05-12",
    "Field MR",
    "BR-006",
    6,
    "Cough Syrup, Antihistamine",
    "Rejected",
  ],
  [
    "Vitamin D Camp",
    "Sample Kit",
    "03:00 PM",
    "2026-05-10",
    "2026-05-12",
    "Field MR",
    "BR-007",
    7,
    "Panadol, Disprin",
    "Approved",
  ],
  [
    "Blood Pressure Camp",
    "Sample Kit",
    "09:30 AM",
    "2026-05-10",
    "2026-05-12",
    "Field MR",
    "BR-008",
    2,
    "Brufen, Augmentin",
    "Completed",
  ],
  [
    "General OPD Camp",
    "Sample Kit",
    "10:30 AM",
    "2026-05-10",
    "2026-05-12",
    "Field MR",
    "BR-009",
    9,
    "Flagyl, Metformin",
    "Approved",
  ],
  [
    "Bone Density Camp",
    "Sample Kit",
    "11:30 AM",
    "2026-05-10",
    "2026-05-12",
    "Field MR",
    "BR-010",
    16,
    "Vitamin D, Calcium",
    "Approved",
  ],
];
export default function CampRequest() {
  const data = rawData.map((item) => {
    const status = item[9];

    return [
      item[0], // Camp Name
      item[1], // Sample Type
      item[2], // Time
      item[3], // Start Date
      item[4], // End Date
      item[5], // MR Type
      item[6], // Brick Code
      item[7], // Chemists
      item[8], // Products

      // 🔥 Status with color
      <span
        className={
          status === "Approved"
            ? "text-green-600 font-semibold"
            : status === "Completed"
              ? "text-blue-600 font-semibold"
              : status === "Rejected"
                ? "text-red-600 font-semibold"
                : "text-gray-600"
        }
      >
        {status}
      </span>,
    ];
  });
  return (
    <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
      <p className="text-heading w-full lg:w-auto font-medium text-[22px] sm:text-[24px]">
        Camps Requests
      </p>
      <div className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(75.7vh-0px)] xl:h-[calc(64vh-0px)] h-auto ">
        <p className="text-[#7D7D7D] font-medium text-sm">Camps List</p>
        <div
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="scroll-smooth bg-white mt-4 rounded-xl 2xl:h-[calc(68.5vh-0px)] xl:h-[calc(59vh-0px)]  overflow-y-auto scrollbar-none"
        >
          <CustomTable titles={titles} data={data} />
        </div>
      </div>
    </div>
  );
}
