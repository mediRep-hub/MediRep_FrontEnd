import { Avatar } from "antd";
import Notification from "../Notifications";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getAllAccounts } from "../../api/adminServices";
import { setIsFilter } from "../../redux/userSlice";
import type { AxiosResponse } from "axios";

const areaOptions = [
  "All Area",
  "Lahore",
  "Karachi",
  "Islamabad",
  "Faisalabad",
  "Multan",
];

const dateOptions = [
  "Today",
  "Last 7 Days",
  "Last 30 Days",
  "This Month",
  "Custom Range",
];

export default function SearchBar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.user);

  const [selectedMR, setSelectedMR] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const { data: allMr } = useQuery<AxiosResponse<any>>({
    queryKey: ["AllAccount"],
    queryFn: () => getAllAccounts(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const AllMR = allMr?.data?.admins || [];

  useEffect(() => {
    if (AllMR.length > 0 && !selectedMR) {
      const firstMR =
        AllMR.find((mr: any) => mr.position === "MedicalRep(MR)")?.name || "";

      setSelectedMR(firstMR);
      dispatch(setIsFilter({ mr: firstMR }));
    }

    if (!selectedArea) {
      setSelectedArea(areaOptions[0]);
      dispatch(setIsFilter({ area: areaOptions[0] }));
    }

    if (!selectedDate) {
      setSelectedDate(dateOptions[0]);
      dispatch(setIsFilter({ date: dateOptions[0] }));
    }
  }, [AllMR]);

  return (
    <div className="bg-secondary px-4 rounded-[8px] w-full xl:h-20 h-[150px] md:h-[80px] flex xl:justify-end lg:justify-start justify-end">
      <div className="flex flex-wrap items-center w-full lg:w-auto ">
        <div className="cursor-pointer mr-4">
          <Notification />
        </div>

        <div className="w-full md:w-[250px] h-14 bg-white rounded-[12px] px-2 flex gap-3 items-center">
          <Avatar src={user?.image} size={40} />

          <div>
            <p className="text-primary text-sm truncate w-[150px]">
              {user?.position}
            </p>
            <p className="text-heading text-sm">{user?.name}</p>
            <p className="text-[12px] text-[#979797]">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
