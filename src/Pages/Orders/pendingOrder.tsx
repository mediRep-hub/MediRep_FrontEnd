import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CustomTable from "../../Components/CustomTable";
import Pagination from "../../Components/Pagination";
import { acceptOrder, getAllOrders } from "../../api/orderServices";
import SearchDateRange from "../../Components/SearchBar/SearchDateRange";
import { SearchSelection } from "../../Components/SearchBar/SearchSelection";
import { getAllAccounts } from "../../api/adminServices";
import { notifyError, notifySuccess } from "../../Components/Toast";
import { Icon } from "@iconify/react";

const titles = [
  "Order ID",
  "MR Name",
  "Doctor/Pharmacy Name",
  "Distributor Name",
  "Discount Request",
  "Amount",
  "Action",
];

interface Order {
  _id: string;
  orderId: string;
  mrName: string;
  pharmacyId: { name: string; discount?: { value: number } };
  distributorName: string;
  total: number;
  IStatus: boolean;
  discount?: number;
}

export default function PendingOrders() {
  const [selectedMR, setSelectedMR] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<{
    start: string;
    end: string;
  }>({ start: "", end: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const queryClient = useQueryClient();

  const { data: allMr } = useQuery({
    queryKey: ["AllAccount"],
    queryFn: () => getAllAccounts(),
    staleTime: 5 * 60 * 1000,
  });

  const AllMR = allMr?.data?.admins ?? [];

  const { data, isFetching } = useQuery({
    queryKey: [
      "GetOrder",
      currentPage,
      selectedMR,
      selectedDate.start,
      selectedDate.end,
      "pending",
    ],
    queryFn: () =>
      getAllOrders(
        currentPage,
        itemsPerPage,
        selectedMR,
        selectedDate.start || undefined,
        selectedDate.end || undefined,
        "pending"
      ),
    staleTime: 5 * 60 * 1000,
  });

  const allOrders: Order[] = Array.isArray(data?.data.data)
    ? data.data.data
    : [];
  const paginationInfo = {
    currentPage: data?.data.page || 1,
    itemsPerPage,
    totalItems: data?.data.totalItems || 0,
    totalPages: data?.data.totalPages || 1,
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  const tableData = allOrders
    .filter((order) => order.IStatus === false)
    .map((order) => [
      order.orderId,
      order.mrName,
      order.pharmacyId.name,
      order.distributorName,
      <p>{order?.discount}%</p>,
      <p key={`amount-${order.orderId}`} className="text-[12px]">
        Rs: {order.total}
      </p>,
      <StatusDropdown
        key={order._id}
        initialValue={order.IStatus}
        order={order}
        onStatusChange={async (orderId, duration, discount) => {
          try {
            await acceptOrder({ orderId, duration, discount });

            queryClient.invalidateQueries({
              predicate: (query) =>
                query.queryKey[0] === "GetOrder" &&
                query.queryKey[1] === currentPage &&
                query.queryKey[2] === selectedMR,
            });

            notifySuccess("Order Approved & Pharmacy Discount Updated");
          } catch (error: any) {
            notifyError("Failed to update status: " + error.message);
          }
        }}
      />,
    ]);

  return (
    <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
      <div className="flex flex-wrap gap-4 justify-between items-start">
        <p className="text-heading font-medium text-[22px] sm:text-[24px]">
          Pending Orders
        </p>
        <div className="flex flex-wrap w-full lg:w-auto items-center gap-3">
          <div className="w-full md:w-[300px]">
            <SearchSelection
              placeholder="Select MR"
              options={[
                "All",
                ...AllMR.filter(
                  (mr: any) => mr?.position === "MedicalRep(MR)"
                ).map((mr: any) => mr?.name),
              ]}
              value={selectedMR}
              onChange={(val) => setSelectedMR(val === "All" ? "" : val)}
            />
          </div>
          <div className="w-full md:w-[300px] md:mt-0 mt-2">
            <SearchDateRange
              onChange={(range: { start: string; end: string }) =>
                setSelectedDate(range)
              }
            />
          </div>
        </div>
      </div>

      <div className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(76.5vh-0px)] xl:h-[calc(64vh-0px)] h-auto">
        <div className="flex justify-between items-center">
          <p className="text-[#7D7D7D] font-medium text-sm">Orders List</p>
          <Pagination
            currentPage={paginationInfo.currentPage}
            itemsPerPage={paginationInfo.itemsPerPage}
            totalItems={paginationInfo.totalItems}
            onPageChange={handlePageChange}
          />
        </div>
        <div className="scroll-smooth bg-white rounded-xl mt-4 overflow-y-auto scrollbar-none 2xl:h-[calc(69vh-0px)] xl:h-[calc(53vh-0px)]">
          <CustomTable
            titles={titles}
            data={tableData}
            isFetching={isFetching}
          />
        </div>
      </div>
    </div>
  );
}

interface StatusDropdownProps {
  initialValue: boolean;
  order: Order;
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
  const [discount, setDiscount] = useState<number>(order.discount ?? 0);

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
          <div className="bg-white rounded-xl w-[400px] p-6">
            <p className="text-lg font-medium mb-4">Set Duration & Discount</p>
            <div className="flex flex-col gap-3 mb-4">
              <label>
                Duration (Days)
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full border p-2 rounded mt-1"
                />
              </label>
              <label>
                Discount (%)
                <input
                  type="number"
                  value={discount}
                  disabled
                  className="w-full border p-2 rounded mt-1"
                />
              </label>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded bg-green-600 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
