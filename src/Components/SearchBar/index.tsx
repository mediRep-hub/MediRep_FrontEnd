import { Avatar } from "antd";
import Notification from "../Notifications";
import { useState } from "react";
import SearchSelection from "./SearchSelection";
import { useAuth } from "../../Context/AuthContext";
const mrOptions: string[] = [
  "MR Ali",
  "MR Bilal",
  "MR Hassan",
  "MR Ahmad",
  "MR Zubair",
];

const areaOptions: string[] = [
  "All Aera",
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
  const [selectedMR, setSelectedMR] = useState("");
  const { admin } = useAuth();
  return (
    <>
      <div className="bg-secondary p-4 rounded-[8px] w-full xl:h-20 md:justify-start xl:justify-between h-auto flex flex-wrap lg:items-center items-start xl-flex-row flex-col-reverse lg:flex-row">
        <div className="flex flex-wrap lg:mt-0 mt-4  w-full lg:w-[65%] items-center gap-4">
          <div className="xl:w-[calc(33%-10px)] lg:w-[calc(32%-10px)] lg:mt-0 mt-3  w-full">
            <SearchSelection
              placeholder="Select MR"
              options={mrOptions}
              firstSelected={true}
              value={selectedMR}
              onChange={setSelectedMR}
            />{" "}
          </div>{" "}
          <div className="xl:w-[calc(33%-10px)] lg:w-[calc(32%-10px)] w-full">
            <SearchSelection
              placeholder="Area Selection"
              options={areaOptions}
              firstSelected={true}
              value={selectedMR}
              onChange={setSelectedMR}
            />{" "}
          </div>{" "}
          <div className="xl:w-[calc(33%-10px)] lg:w-[calc(32%-10px)] w-full">
            <SearchSelection
              placeholder="Date Range"
              firstSelected={true}
              options={dateOptions}
              value={selectedMR}
              onChange={setSelectedMR}
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center w-full lg:w-auto">
          <div className="cursor-pointer">
            <Notification />
          </div>

          <div className="w-auto mt-4  lg:mt-0 xl:mt-0 md:ml-4 md:mt-0 ml-0 h-12 bg-white rounded-[12px] px-2 flex gap-3 items-center">
            <Avatar src={admin?.image} size={40} />
            <div>
              <p className="text-primary text-sm leading-[14px]">
                {admin?.position}
              </p>{" "}
              <p className="text-heading text-sm leading-[14px]">
                {" "}
                {admin?.name}
              </p>{" "}
              <p className="text-[12px] text-[#979797] leading-[12px]">
                {admin?.email}
              </p>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* <div className="relative">
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          <LuSearch size={16} />
        </span>
        <input
          type="text"
          placeholder="Search"
          className="h-12  xl:min-w-[254px] w-[93%] md:w-full pl-10 pr-4 rounded-full bg-white text-gray-800 
               border-none outline-none focus:ring-0 focus:border-none"
        />
      </div>
      <div className="h-12 xl:ml-4 md:ml-4 cursor-pointer mt-4 md:mt-0 xl:mt-0 rounded-full min-w-[94px] flex items-center justify-center gap-3 bg-white">
        <RiListCheck size={16} />
        <p className="text-heading text-sm font-medium">Today</p>
      </div> */}
    </>
  );
}
