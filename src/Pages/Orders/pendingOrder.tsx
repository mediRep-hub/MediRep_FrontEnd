import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CustomTable from "../../Components/CustomTable";
import Pagination from "../../Components/Pagination";
import { getAllOrders, updateOrder } from "../../api/orderServices";
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
      "pending", // <-- add status to queryKey
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

  const allOrders: any[] = Array.isArray(data?.data.data) ? data.data.data : [];
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
      <p>{order.discount}%</p>,
      <p key={`amount-${order.orderId}`} className="text-[12px]">
        Rs: {order.total}
      </p>,
      <StatusDropdown
        initialValue={order.isStatus}
        orderId={order._id}
        onStatusChange={async (newStatus: boolean) => {
          try {
            await updateOrder(order._id, { IStatus: newStatus }); // update backend
            queryClient.invalidateQueries({
              predicate: (query) =>
                query.queryKey[0] === "GetOrder" &&
                query.queryKey[1] === currentPage &&
                query.queryKey[2] === selectedMR,
            });

            notifySuccess(
              newStatus
                ? "Status successfully Approved"
                : "Status changed to Pending"
            );
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
          Orders
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

      <div className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(75.5vh-0px)] xl:h-[calc(64vh-0px)] h-auto">
        <div className="flex justify-between items-center">
          <p className="text-[#7D7D7D] font-medium text-sm">Orders List</p>
          <Pagination
            currentPage={paginationInfo.currentPage}
            itemsPerPage={paginationInfo.itemsPerPage}
            totalItems={paginationInfo.totalItems}
            onPageChange={handlePageChange}
          />
        </div>
        <div className="scroll-smooth bg-white rounded-xl mt-4 overflow-y-auto scrollbar-none 2xl:h-[calc(68vh-0px)] xl:h-[calc(53vh-0px)]">
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

const StatusDropdown = ({ initialValue, onStatusChange }: any) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(initialValue);

  const handleSelect = async (val: boolean) => {
    setStatus(val);
    setOpen(false);
    if (onStatusChange) {
      await onStatusChange(val);
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
          <div
            onClick={() => handleSelect(false)}
            className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between"
          >
            <span className="text-[#D96F79]">Pending</span>
            {!status && <span>✔</span>}
          </div>
          <div
            onClick={() => handleSelect(true)}
            className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between"
          >
            <span className="text-green-800">Approved</span>
            {status && <span>✔</span>}
          </div>
        </div>
      )}
    </div>
  );
};
