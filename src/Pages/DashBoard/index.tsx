import { useEffect } from "react";
import { MdOutlineTrendingDown, MdOutlineTrendingUp } from "react-icons/md";
import { Avatar } from "antd";
import { FaPercentage, FaTablets } from "react-icons/fa";
import { CiDollar } from "react-icons/ci";
import { IoTimeOutline } from "react-icons/io5";
import { GiAchievement, GiPill } from "react-icons/gi";
import dummay from "../../../src/assets/dummay.jpg";
import LineChart from "../../Components/LineChart";
import { GoDotFill } from "react-icons/go";
import ProgressBar from "../../Components/ProgressBar";
import { FiTarget } from "react-icons/fi";
import { HiUsers } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllRequisition } from "../../api/requisitionServices";

import aa from "../../assets/product.png";
import bb from "../../assets/unit.png";
import cc from "../../assets/time.png";
import dd from "../../assets/amount.png";
export default function DashBoard() {
  useEffect(() => {
    document.title = "MediRep | Dashboard";
  }, []);
  const navigate = useNavigate();
  const handleGOtoSeeAll = () => {
    navigate("/requisition");
  };
  const { data } = useQuery({
    queryKey: ["AllRequisition"],
    queryFn: () => getAllRequisition(),
    staleTime: 5 * 60 * 1000,
  });
  let AllRequisition = data?.data;
  console.log("🚀 ~ DashBoard ~ AllRequisition:", AllRequisition);
  return (
    <div
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
      className="bg-secondary md:h-[calc(100vh-129px)] overflow-y-auto h-auto rounded-xl p-4 flex flex-col gap-4"
    >
      <div className="flex gap-4 items-stretch flex-wrap">
        <div className="lg:w-[calc(25%-12px)] md:w-[calc(50%-16px)] h-[130px] w-full  flex flex-col justify-between rounded-xl text-primary p-4 bg-white">
          <div className="flex justify-between items-center">
            <p className="text-sm font-normal text-[#7D7D7D]">Target</p>
            <div className="h-9 w-9 rounded-full bg-primary/10 flex justify-center items-center">
              <FiTarget size={18} className="text-primary" />
            </div>
          </div>
          <p className="xl:text-xl lg:text-lg  font-semibold mt-3">
            <span className="text-base">Rs.</span>500,000
          </p>
        </div>

        <div className="lg:w-[calc(25%-12px)] md:w-[calc(50%-16px)] h-[130px] w-full  flex flex-col justify-between rounded-xl text-[#28A745] p-4 bg-white">
          <div className="flex justify-between items-center">
            <p className="text-sm font-normal text-[#7D7D7D]">Achievement</p>
            <div className="h-9 w-9 rounded-full bg-[#28A745]/10 flex justify-center items-center">
              <GiAchievement size={18} color="#28A745" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <p className="xl:text-xl lg:text-lg  font-semibold ">PKR 375,000</p>
            <p className="text-sm font-normal">-0.03%</p>
            <MdOutlineTrendingUp color="#28A745" size={18} />
          </div>
        </div>

        <div className="lg:w-[calc(25%-12px)] md:w-[calc(50%-16px)] h-[130px] w-full  flex flex-col justify-between rounded-xl text-[#C47301] p-4 bg-white">
          <div className="flex justify-between items-center">
            <p className="text-sm font-normal text-[#7D7D7D]">Percentage</p>
            <div className="h-9 w-9 rounded-full bg-[#C47301]/10 flex justify-center items-center">
              <FaPercentage size={18} color="#C47301" />
            </div>
          </div>{" "}
          <div className="flex items-baseline gap-2 mt-3">
            <p className="xl:text-xl lg:text-lg  font-semibold ">75%</p>
            <p className="text-sm font-normal">-0.03%</p>
            <MdOutlineTrendingDown color="#C47301" size={18} />
          </div>
        </div>

        <div className="lg:w-[calc(25%-12px)] md:w-[calc(50%-16px)] h-[130px] w-full   rounded-xl text-[#9C27B0] p-4 bg-white">
          <div className="flex justify-between items-center">
            <p className="text-sm font-normal text-[#7D7D7D]">
              Engagement with KOL
            </p>
            <div className="h-9 w-9 rounded-full bg-[#9C27B0]/10 flex justify-center items-center">
              <HiUsers size={18} color="#9C27B0" />
            </div>
          </div>
          <div className="flex justify-between items-center mt-5">
            <div>
              <p className="xl:text-xl lg:text-lg  leading-5 font-semibold">
                220
              </p>
              <p className="text-xs font-normal">Meetings</p>
            </div>
            <div className="border-l-[1px] border-[#9C27B0] h-10"></div>
            <div>
              <p className="xl:text-xl lg:text-lg  leading-5 font-semibold">
                220
              </p>
              <p className="text-xs font-normal">Meetings</p>
            </div>
            <div className="border-l-[1px] border-[#9C27B0] h-10"></div>
            <p className="xl:text-xl lg:text-lg  font-semibold">60%</p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-stretch gap-4">
        <div className="lg:w-[calc(70%-8px)] w-full bg-white rounded-xl py-5 pr-5">
          <div className="flex flex-wrap xl:gap-5 gap-3 items-center pl-5 mb-4">
            <p className="xl:text-xl md:w-auto w-full sm:text-xl font-semibold text-heading">
              Performance
            </p>
            <div className="h-3 border-[#7d7d7d] border-l-[1px]"></div>
            <div className="flex items-center gap-2">
              <GoDotFill color="#0755E9" />
              <p className="text-sm  font-medium text-heading">Target</p>
            </div>{" "}
            <div className="flex items-center gap-2">
              <GoDotFill color="#14CCC2" />
              <p className="text-sm font-medium text-heading">Achievement</p>
            </div>
          </div>
          <LineChart />
        </div>
        <div className="lg:w-[calc(30%-8px)] w-full bg-[#E5EBF7] rounded-xl p-4">
          <p className="text-heading text-xs mb-4">MR Activity by Type</p>

          <div className="relative">
            {[
              "New Doctor Meetings — 48",
              "Follow-up Meetings — 32",
              "Product Presentations — 21",
              "Samples Distributed — 65",
              "Call/Visit Duration Logged — 112 hrs",
              "Orders Taken — 39",
            ].map((item, index, arr) => (
              <div
                key={index}
                className="relative flex  items-center mb-5 last:mb-0"
              >
                <div className="absolute left-0 top-1/2 -translate-y-1/2">
                  <div className="h-3 w-3 rounded-full bg-white border-[1px] border-primary relative z-10"></div>

                  {index !== arr.length - 1 && (
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-px h-8 bg-primary"></div>
                  )}
                </div>
                <span className="ml-3 xl:text-sm lg:text-xs md:text-sm text-xs text-heading pl-4">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <div className="flex flex-wrap items-stretch gap-4 ">
          <div className="lg:w-[calc(70%-8px)] w-full ">
            <div className="mb-3 flex justify-between items-center">
              <p className="font-medium text-heading text-base leading-3">
                Requisitions
              </p>
              <p
                onClick={handleGOtoSeeAll}
                className="cursor-pointer font-normal text-primary text-sm underline"
              >
                See All
              </p>
            </div>
            <div className="flex flex-wrap items-stretch gap-4 ">
              {AllRequisition?.map((v: any, ind: number) => (
                <div
                  key={ind}
                  className="lg:w-[calc(33.33%-10.66px)] border-[#D4D4D4] border-[1px] w-full bg-white p-4 rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 items-center">
                      <Avatar
                        src={v?.image || dummay}
                        className="h-10 w-10 object-cover rounded-full"
                      />
                      <p className="text-heading font-semibold text-xs">
                        {v?.doctorName || "Unknown Doctor"}
                      </p>
                    </div>

                    <p
                      className={`inline-block rounded-[3px] px-2  font-normal text-sm border ${
                        v?.status === "Pending"
                          ? "text-[#E90761] border-[#E90761]"
                          : v?.status === "Approved"
                          ? "text-primary border-primary"
                          : v?.status === "Rejected"
                          ? "text-[#FF9500] border-[#FF9500]"
                          : v?.status === "Paid"
                          ? "text-[#0BA69C] border-[#0BA69C]"
                          : "text-gray-500 border-gray-500"
                      }`}
                    >
                      {v?.status}
                    </p>
                  </div>

                  <div className="mt-5">
                    <p className="text-xs font-normal leading-[12px] text-[#7d7d7d]">
                      Requisition Details
                    </p>
                    <div className="grid 2xl:grid-cols-2 lg:grid-col-auto gap-3 mt-3">
                      {[
                        { value: v?.product, img: aa },
                        { value: v?.quantity, img: bb },
                        { value: v?.duration, img: cc },
                        { value: v?.amount, img: dd },
                      ].map((item, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <img
                            src={item.img}
                            alt={item.value}
                            className="w-5 h-auto"
                          />
                          <p className="text-xs font-medium leading-[12px] text-heading">
                            <span className="text-[#7d7d7d]">
                              {item.value || "-"}
                            </span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-[calc(30%-8px)] min-h-[190px] relative border-[#D4D4D4] border-[1px] w-full bg-white rounded-xl p-[16px]">
            <div className="flex gap-2 items-center justify-between">
              <p className="text-heading font-semibold text-xs">
                Dr. Ahmad Khan
              </p>{" "}
              <Avatar src={dummay} className="h-10 w-10" />
            </div>
            <div className="flex justify-between items-center mt-2">
              <div>
                <p className="text-[#7D7D7D] text-[10px] font-normal">
                  Prescriptions Goal
                </p>
                <p className="text-heading text-sm font-semibold">500</p>
              </div>
              <div>
                <p className="text-[#7D7D7D] text-[10px] font-normal">Amount</p>
                <p className="text-heading text-sm font-semibold">150,000</p>
              </div>
            </div>
            <div className="absolute md:bottom-4 bottom-0 left-1/2 transform -translate-x-1/2">
              <ProgressBar
                percentage={64}
                size={200}
                strokeWidth={15}
                backgroundColor="#E5EAFC"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
