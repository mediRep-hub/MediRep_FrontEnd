import { Icon } from "@iconify/react";
import CustomTable from "../../../Components/CustomTable";
import { MonthYearPicker } from "../../../Components/FilterMonthYear";
import { useState } from "react";
import CustomSelect from "../../../Components/Select";
const titles = [
  "Expense ID",
  "MR Name",
  "Brick Name",
  "Expense Name",
  "Date",
  "Food Expense",
  "Hotel Expense",
  "Meeting Expense",
  "Other Expense",
  "Total Expense",
  "Status",
];

const rawData = [
  {
    id: "EXP007",
    mr: "Ali Al Ghafli",
    brick: "Canal Road",
    expenseName: "Multan trip for Cardio New",
    date: "(Jan 22 – Jan 27), 2026",
    food: 12785100,
    hotel: 11500000,
    meeting: 10250000,
    other: 2503232,
    total: 2502323,
    status: true,
  },
  {
    id: "EXP008",
    mr: "Usman Ali",
    brick: "Gulgasht",
    expenseName: "Lahore medical visit",
    date: "(Feb 01 – Feb 05), 2026",
    food: 8200000,
    hotel: 7950000,
    meeting: 7800000,
    other: 1200000,
    total: 1150000,
    status: false,
  },
  {
    id: "EXP009",
    mr: "Sara Khan",
    brick: "Model Town",
    expenseName: "Karachi trip for conference",
    date: "(Mar 10 – Mar 15), 2026",
    food: 15000000,
    hotel: 14500000,
    meeting: 14000000,
    other: 3500000,
    total: 3400000,
    status: true,
  },
];

export default function MRWiseExpense() {
  const [data, setData] = useState(rawData);

  // Map rawData to Data array for CustomTable
  const tableData = data.map((row) => [
    row.id,
    row.mr,
    row.brick,
    row.expenseName,
    row.date,
    <p>
      <span className="text-xs">Rs:</span>
      {row.food.toLocaleString()}
    </p>,
    <p>
      <span className="text-xs">Rs:</span>
      {row.hotel.toLocaleString()}
    </p>,
    <p>
      <span className="text-xs">Rs:</span>
      {row.meeting.toLocaleString()}
    </p>,
    <p>
      <span className="text-xs">Rs:</span>
      {row.other.toLocaleString()}
    </p>,
    <p>
      <span className="text-xs">Rs:</span>
      {row.total.toLocaleString()}
    </p>,
    <StatusDropdown
      initialValue={row.status}
      order={{ _id: row.id, discount: 0 }}
      onStatusChange={(id, duration, discount) => {
        console.log("Status Changed:", id, duration, discount);
        // Update state dynamically
        setData((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: true } : r)),
        );
      }}
    />,
  ]);

  return (
    <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
      <div className="flex flex-wrap md:flex-nowrap gap-4 justify-between items-center">
        <div className="flex flex-wrap md:flex-nowrap w-full items-center gap-4">
          <p className="text-heading leading-[100%] w-full lg:w-[230px] font-medium text-[22px] sm:text-[24px]">
            MR Wise Expense
          </p>
          <div className="w-full">
            <MonthYearPicker />
          </div>
        </div>
        <div className="flex w-full md:w-auto flex-wrap md:flex-nowrap items-center gap-4">
          <button className="h-[55px] w-full md:w-[140px] lg:w-[180px] bg-[#E5EBF7] rounded-[6px] gap-3 cursor-pointer flex justify-center items-center">
            <Icon
              icon="solar:download-broken"
              height="24"
              width="24"
              color="#0755E9"
            />
            <p className="text-primary text-base font-medium">Download</p>
          </button>{" "}
          <button className="h-[55px] w-full md:w-[170px] lg:w-[200px] bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center">
            <Icon
              icon="mingcute:add-fill"
              height="20"
              width="20"
              color="#fff"
            />
            <p className="text-white text-base font-medium">Generate Reports</p>
          </button>
        </div>
      </div>
      <div className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(76vh-0px)] xl:h-[calc(64vh-0px)] h-auto ">
        <p className="text-[#7D7D7D] font-medium text-sm">Plan Summary</p>
        <div
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(69vh-0px)] xl:h-[calc(53vh-0px)]  mt-4 overflow-y-auto scrollbar-none"
        >
          <CustomTable titles={titles} data={tableData} />
        </div>
      </div>
    </div>
  );
}

interface StatusDropdownProps {
  initialValue: boolean;
  order: any;
  onStatusChange: (orderId: string, duration: number, discount: number) => void;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({
  initialValue,
  order,
  onStatusChange,
}) => {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState(initialValue);
  const [duration, setDuration] = useState<number>(0);
  console.log("🚀 ~ StatusDropdown ~ setDuration:", setDuration);
  const [discount, setDiscount] = useState<number>(order.discount ?? 0);
  console.log(setDiscount);

  const handleApproveClick = () => {
    setModalOpen(true);
    setOpen(false);
  };

  const handleSave = () => {
    if (duration > 0 && discount >= 0) {
      onStatusChange(order._id, duration, discount);
      setStatus(true);
      setModalOpen(false);
    }
  };

  return (
    <div className="relative w-40">
      <div
        onClick={() => setOpen(!open)}
        className={`border p-2 rounded cursor-pointer flex justify-between items-center ${
          status ? "bg-green-100 text-green-800" : "bg-[#F0D5D1] text-[#D96F79]"
        }`}
      >
        {status ? "Approved" : "Pending"}
        <Icon icon="formkit:down" height={20} width={20} />
      </div>

      {open && (
        <div className="absolute left-0 w-full border bg-white rounded shadow mt-1 z-20">
          {!status && (
            <div
              onClick={handleApproveClick}
              className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between"
            >
              <span className="text-green-800">Approve</span>
            </div>
          )}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-[500px]">
            <div className="bg-[#E5EBF7] rounded-t-xl p-4">
              <p className="text-lg font-medium">Set Time Duration</p>
            </div>
            <div className="flex flex-col gap-3 p-4 mb-4">
              <CustomSelect placeholder="Select Time" />
            </div>
            <div className="flex justify-between gap-3 p-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-8 bg-secondary h-[48px] py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-8 h-[48px] py-2 rounded bg-primary text-white"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
