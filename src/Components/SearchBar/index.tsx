import { Avatar } from "antd";
import Notification from "../Notifications";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getAllAccounts } from "../../api/adminServices";
import { setIsFilter } from "../../redux/userSlice";
const areaOptions: string[] = [
  "All Area",
  "Lahore",
  "Karachi",
  "Islamabad",
  "Faisalabad",
  "Multan",
];

const dateOptions: string[] = [
  "Today",
  "Last 7 Days",
  "Last 30 Days",
  "This Month",
  "Custom Range",
];

export default function SearchBar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.user);

  const [selectedMR, setSelectedMR] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const { data: allMr } = useQuery({
    queryKey: ["AllAccount"],
    queryFn: () => getAllAccounts(),
    staleTime: 5 * 60 * 1000,
  });
  const AllMR = allMr?.data?.admins || [];
  useEffect(() => {
    if (AllMR.length > 0 && !selectedMR) {
      const firstMR =
        AllMR.find((mr: any) => mr.position === "MedicalRep(MR)")?.name || "";
      setSelectedMR(firstMR);
      dispatch(setIsFilter({ key: "mr", value: firstMR }));
    }
    if (!selectedArea) {
      setSelectedArea(areaOptions[0]);
      dispatch(setIsFilter({ key: "area", value: areaOptions[0] }));
    }
    if (!selectedDate) {
      setSelectedDate(dateOptions[0]);
      dispatch(setIsFilter({ key: "date", value: dateOptions[0] }));
    }
  }, [AllMR, dispatch]);

  return (
    <div className="bg-secondary p-4 rounded-[8px] w-full xl:h-20 flex xl:justify-end lg:justify-start justify-end">
      <div className="flex flex-wrap items-center w-full lg:w-auto ">
        <div className="cursor-pointer mr-4">
          <Notification />
        </div>
        <div className="w-full md:w-[250px] mt-4 md:mt-0 h-14 bg-white rounded-[12px] px-2 flex gap-3 items-center">
          <Avatar src={user?.image} size={40} />
          <div>
            <p className="text-primary text-sm leading-[14px] w-[150px] truncate">
              {user?.position}
            </p>
            <p className="text-heading text-sm leading-[14px]">{user?.name}</p>
            <p className="text-[12px] text-[#979797] leading-[12px]">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
