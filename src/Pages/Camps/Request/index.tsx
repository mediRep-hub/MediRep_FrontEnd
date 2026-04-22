import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CustomTable from "../../../Components/CustomTable";
import type { AxiosResponse } from "axios";
import { getAllCamps, updateCampStatus } from "../../../api/campsServices";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { notifyError, notifySuccess } from "../../../Components/Toast";
import { IoMdCloseCircle } from "react-icons/io";
import Dummay from "../../../assets/Holiday SVG.png";
import { useNavigate } from "react-router-dom";

const titles = [
  "Camp Type",
  "Sample Type",
  "Camp Time",
  "Camp Start Date",
  "Camp End Date",
  "Action",
  "Mr Name",
  "Brick Code",
  "Total Patient",
  "Doctors",
  "Chemists",
  "Products",

  "Datails",
];

const statusList = ["pending", "approved", "completed", "rejected"];

const statusConfig: any = {
  approved: "text-green-700 bg-green-100",
  completed: "text-blue-700 bg-blue-100",
  pending: "text-yellow-700 bg-yellow-100",
  rejected: "text-red-700 bg-red-100",
};

export default function CampRequest() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const [pendingStatus, setPendingStatus] = useState<{
    id: string;
    status: string;
  } | null>(null);

  const { data: allcamps } = useQuery<AxiosResponse<any>>({
    queryKey: ["getAllCamps"],
    queryFn: () => getAllCamps(),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    placeholderData: (previous) => previous,
  });

  const camps = allcamps?.data?.data || [];
  const { mutate: changeStatus, isPending } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateCampStatus(id, status),

    onSuccess: () => {
      notifySuccess("Status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllCamps"] });
    },

    onError: (error: any) => {
      notifyError(error?.response?.data?.message || "Update failed");
    },
  });

  const handleStatusSelect = (id: string, status: string) => {
    setPendingStatus({ id, status });
    setOpenIndex(null);
  };
  const handleSave = () => {
    if (!pendingStatus) return;

    const cleanStatus = pendingStatus.status.toLowerCase().trim();

    if (!statusList.includes(cleanStatus)) {
      notifyError("Invalid status selected");
      setPendingStatus(null);
      return;
    }

    changeStatus({
      id: pendingStatus.id,
      status: cleanStatus,
    });

    setPendingStatus(null);
  };

  const handleClose = () => {
    setPendingStatus(null);
  };

  const handleGoDetails = (item: any) => {
    navigate("/camps/request/requestDetail", {
      state: item,
    });
  };
  const data =
    camps?.map((item: any, index: number) => {
      const status = item?.status?.toLowerCase() || "pending";

      return [
        item?.campType || "-",
        item?.sampleType || "-",
        item?.campTime || "-",
        item?.campStartDate
          ? dayjs(item.campStartDate).format("DD MMM YYYY")
          : "-",
        item?.campEndDate ? dayjs(item.campEndDate).format("DD MMM YYYY") : "-",
        <div className="relative" key={item._id}>
          <div
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className={`cursor-pointer px-3 py-2 rounded-md flex items-center justify-between gap-2 capitalize ${
              statusConfig[status] || "text-gray-600 bg-gray-100"
            } ${openIndex === index ? " ring-0" : ""}`}
          >
            {status}

            <Icon
              icon="akar-icons:chevron-down"
              className={`transition-transform ${
                openIndex === index ? "rotate-180" : ""
              }`}
            />
          </div>

          {openIndex === index && (
            <div className="absolute z-10 py-1.5 mt-1 w-40 bg-white border rounded-lg shadow">
              {statusList.map((s) => (
                <div
                  key={s}
                  onClick={() => handleStatusSelect(item._id, s)}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100 capitalize "
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>,
        item?.mrType || item?.mrName || "-",
        item?.brickCode || "-",

        item?.patients.length || "0",
        item?.doctors.length || "0",
        item?.chemists.length || "0",
        item?.products.length || "0",

        <button
          className="flex gap-2 items-center"
          onClick={() => handleGoDetails(item)}
        >
          <Icon icon="iconoir:notes" height="16" width="16" color="#7d7d7d" />
          Details
        </button>,
      ];
    }) || [];
  useEffect(() => {
    document.title = "MediRep | Camps Request";
  }, []);
  return (
    <>
      <div className="bg-secondary md:h-[calc(100vh-129px)] rounded-[12px] p-4">
        <p className="text-heading font-medium text-[22px]">Camps Requests</p>

        <div className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4">
          <p className="text-[#7D7D7D] font-medium text-sm">Camps List</p>

          <div className="bg-white mt-4 rounded-xl h-[71vh] overflow-y-auto">
            <CustomTable titles={titles} data={data} />
          </div>
        </div>
      </div>
      {pendingStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#E5EBF7] mx-3 rounded-xl w-120">
            <div className="flex justify-between p-6">
              <p className="text-xl font-medium">
                Confirm Status {pendingStatus.status}
              </p>
              <IoMdCloseCircle
                size={22}
                onClick={handleClose}
                className="cursor-pointer text-[#0755E9]"
              />
            </div>
            <div className="p-6 bg-white rounded-b-xl">
              <img src={Dummay} className="h-auto mx-auto mb-5 w-30" />

              <p className="text-[#131313] md:text-xl text-base text-center">
                Are you sure you want to confirm the {pendingStatus.status}{" "}
                status?
              </p>
              <p className="text-[#7d7d7d] md:text-sm text-xs text-center">
                Once you confirm the approval it will not be revert
              </p>

              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 cursor-pointer bg-[#F2FAFD] rounded hover:bg-[#F2FAFD]"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  disabled={isPending}
                  className="px-4 py-2 rounded bg-green-600 text-white"
                >
                  {isPending ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
