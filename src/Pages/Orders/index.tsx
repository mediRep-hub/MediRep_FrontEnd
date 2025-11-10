import { LuDownload } from "react-icons/lu";
import CustomTable from "../../Components/CustomTable";
import { useNavigate } from "react-router-dom";
import { BiMessageDetail } from "react-icons/bi";
import { getAllOrders } from "../../api/orderServices";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

const titles = [
  "Order ID",
  "Order Date",
  "MR Name",
  "Doctor/Pharmacy Name",
  "Strategy Name",
  "Order Type",
  "Amount",
  "Details",
];

export default function Orders() {
  const { data: orders } = useQuery({
    queryKey: ["GetORder"],
    queryFn: () => getAllOrders(),
    staleTime: 5 * 60 * 1000,
  });
  const navigate = useNavigate();

  const handleGODetails = (item: any) => {
    navigate("/orderDetails", { state: { order: item } });
  };

  let allOrders = orders?.data;
  let tableData: any = [];
  allOrders?.map((v: any) => {
    tableData.push([
      v?.orderId,
      v?.createdAt ? dayjs(v.createdAt).format("DD MMM, YYYY") : "-",
      v?.mrName,
      v?.customerName,
      v?.strategyName,
      v?.orderType,
      <p className="text-[12px]">
        Rs:
        <span className="text-sm ml-1">{v?.amount}</span>{" "}
      </p>,
      <button
        className="flex gap-2 items-center cursor-pointer"
        onClick={() => {
          handleGODetails(v);
        }}
      >
        <BiMessageDetail size={16} className="inline text-[#7d7d7d] mr-2" />
        <p>Details</p>
      </button>,
    ]);
  });

  return (
    <div>
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap gap-4 justify-between">
          <p className="text-heading font-medium text-[22px] sm:text-[24px]">
            Orders
          </p>
          <button className="h-[55px] w-full md:w-[180px] bg-[#E5EBF7] rounded-[6px] gap-3 cursor-pointer flex justify-center items-center">
            <LuDownload size={20} className="text-primary" />
            <p className="text-primary text-base font-medium">Download</p>
          </button>
        </div>

        <div className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(90vh-127px)] xl:h-[calc(90vh-162px)] h-auto">
          <p className="text-[#7D7D7D] font-medium text-sm">Orders List</p>
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(85vh-147px)] xl:h-[calc(65vh-55px)] mt-4 overflow-y-auto scrollbar-none"
          >
            <CustomTable titles={titles} data={tableData} />
          </div>
        </div>
      </div>
    </div>
  );
}
