import { useEffect, useState } from "react";
import { MdOutlineTrendingDown, MdOutlineTrendingUp } from "react-icons/md";
import { Avatar } from "antd";
import { FaPercentage } from "react-icons/fa";
import { GiAchievement } from "react-icons/gi";
import LineChart from "../../Components/LineChart";
import { GoDotFill } from "react-icons/go";
import ProgressBar from "../../Components/ProgressBar";
import { FiTarget } from "react-icons/fi";
import { HiUsers } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllRequisition } from "../../api/requisitionServices";

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
  const [activeIndex, setActiveIndex] = useState(0);

  const activeData = AllRequisition?.[activeIndex] || {};
  return (
    <div
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
      className="bg-secondary md:h-[calc(100vh-129px)] overflow-y-auto h-auto rounded-xl p-4 flex flex-col gap-2"
    >
      <div className="flex gap-2 items-stretch flex-wrap">
        <div className="lg:w-[calc(25%-6px)] md:w-[calc(50%-16px)] h-[130px] w-full  flex flex-col justify-between rounded-xl text-primary p-4 bg-white">
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

        <div className="lg:w-[calc(25%-6px)] md:w-[calc(50%-16px)] h-[130px] w-full  flex flex-col justify-between rounded-xl text-[#28A745] p-4 bg-white">
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

        <div className="lg:w-[calc(25%-6px)] md:w-[calc(50%-16px)] h-[130px] w-full  flex flex-col justify-between rounded-xl text-[#C47301] p-4 bg-white">
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

        <div className="lg:w-[calc(25%-6px)] md:w-[calc(50%-16px)] h-[130px] w-full   rounded-xl text-[#9C27B0] p-4 bg-white">
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
      <div className="flex flex-wrap  items-stretch gap-2">
        <div className="lg:w-[calc(75%-2px)] h-[52vh] w-full bg-white rounded-xl py-5 pr-5">
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
          <div className="h-[90%] md:h-[100%]">
            <LineChart />
          </div>
        </div>
        <div className="lg:w-[calc(25%-6px)] h-[52vh] w-full bg-[#E5EBF7] rounded-xl p-4">
          <p className="text-heading  text-xs  mb-4">MR Activity by Type</p>

          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="relative overflow-y-scroll hide-scrollbar h-[calc(49vh-30px)]"
          >
            {[
              "New Doctor Meetings — 48",
              "Follow-up Meetings — 32",
              "Product Presentations — 21",
              "Samples Distributed — 65",
              "Call/Visit Duration Logged — 112 hrs",
              "Orders Taken — 39",
              "New Doctor Meetings — 48",
              "Follow-up Meetings — 32",
              "Product Presentations — 21",
              "Samples Distributed — 65",
              "Call/Visit Duration Logged — 112 hrs",
              "Orders Taken — 39",
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
                <span className="ml-3 xl:text-xs lg:text-xs md:text-sm text-xs text-heading pl-4">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <div className="flex flex-wrap items-stretch gap-2">
          <div className="lg:w-[calc(75%-2px)] w-full">
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
            <div className="flex flex-wrap items-stretch gap-2">
              {AllRequisition?.slice(0, 3).map((v: any, ind: number) => (
                <div
                  key={ind}
                  onClick={() => setActiveIndex(ind)}
                  className={`lg:w-[calc(33.33%-5.33px)] border-[1px] w-full p-4 rounded-xl cursor-pointer ${
                    activeIndex === ind
                      ? "border-primary bg-[#F0F8FF]"
                      : "border-[#D4D4D4] bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 items-center">
                      <Avatar
                        src={v?.doctor?.image}
                        className="h-10 w-10 object-cover rounded-full"
                      />
                      <p className="text-heading font-semibold text-xs">
                        {v?.doctorName || "Unknown Doctor"}
                      </p>
                    </div>

                    <p
                      className={`inline-block rounded-[3px] px-2 font-normal text-sm border ${
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
                    <div className="grid 2xl:grid-cols-2 xl:grid-cols-2 lg:grid-col-auto gap-3 mt-3">
                      {[
                        {
                          value: v?.product,
                          icon: (
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 12 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M3.29499 0.592888C4.91681 -0.197631 6.81223 -0.19763 8.43405 0.592889L8.51881 0.634204C10.4829 1.59156 11.729 3.58523 11.729 5.77022C11.729 7.95717 10.4807 9.95227 8.51394 10.9086L8.42906 10.9499C6.81 11.7372 4.91904 11.7372 3.29998 10.9499L3.21509 10.9086C1.24833 9.95227 0 7.95717 0 5.77022C0 3.58523 1.24613 1.59156 3.21022 0.634203L3.29499 0.592888ZM8.87475 3.1511C9.44059 2.87641 9.44099 2.0704 8.87541 1.79516L6.19065 0.488628C5.98474 0.388426 5.74423 0.388305 5.53823 0.4883C4.97961 0.759457 4.9772 1.55446 5.53416 1.829L8.21228 3.1491C8.42096 3.25196 8.66545 3.2527 8.87475 3.1511ZM5.54403 4.46174C5.74641 4.56023 5.98277 4.56054 6.18543 4.4626C6.73672 4.19614 6.73951 3.41189 6.19012 3.14152L3.48303 1.80928C3.27782 1.70829 3.03749 1.70764 2.83174 1.80752C2.27505 2.07774 2.27465 2.8707 2.83107 3.14148L5.54403 4.46174ZM4.1461 4.76959C2.6478 4.03928 0.902233 5.13033 0.902233 6.79714V7.38571C0.902233 8.24828 1.39417 9.03533 2.16953 9.41326C3.66784 10.1436 5.4134 9.05252 5.4134 7.38571V6.79714C5.4134 5.93457 4.92147 5.14752 4.1461 4.76959ZM6.31563 7.38571C6.31563 9.05252 8.0612 10.1436 9.5595 9.41326C10.3349 9.03533 10.8268 8.24828 10.8268 7.38571V6.79714C10.8268 5.13033 9.08124 4.03928 7.58294 4.76959C6.80757 5.14752 6.31563 5.93457 6.31563 6.79714V7.38571Z"
                                fill="#0755E9"
                              />
                            </svg>
                          ),
                        },
                        {
                          value: v?.quantity,
                          icon: (
                            <svg
                              width="18"
                              height="16"
                              viewBox="0 0 14 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9.51862 2.78488C9.84114 2.62669 10.2187 2.62635 10.5415 2.78397L11.7516 3.37484C13.0962 4.03136 13.949 5.39682 13.949 6.89312V7.19135C13.949 8.69199 13.0917 10.0624 11.7432 10.7208C10.6625 11.2485 9.39768 11.2514 8.31512 10.7274L6.64542 9.91921C6.31423 9.7589 6.10385 9.42334 6.10385 9.05539C6.10385 8.34723 5.36312 7.88298 4.7258 8.19169L4.43057 8.33469C4.10984 8.49004 3.73566 8.49009 3.41488 8.33482L2.21334 7.75323C0.858132 7.09725 -0.00195228 5.72339 1.76895e-05 4.21777L0.000410931 3.91722C0.00236982 2.42007 0.856427 1.05462 2.20177 0.397719C3.28782 -0.132573 4.5577 -0.132572 5.64375 0.397719L7.30484 1.20878C7.63365 1.36934 7.84265 1.70279 7.84382 2.0687C7.84609 2.77807 8.59019 3.24025 9.22708 2.92787L9.51862 2.78488ZM10.5103 5.69531C11.3327 5.29442 11.3315 4.12198 10.5082 3.72285C10.2061 3.57641 9.85356 3.57641 9.55147 3.72285C8.72815 4.12198 8.7269 5.29442 9.54936 5.69531C9.85261 5.84312 10.207 5.84312 10.5103 5.69531ZM4.40322 2.71856C5.22569 2.31767 5.22443 1.14523 4.40111 0.746108C4.09902 0.599662 3.7465 0.599662 3.44441 0.746108C2.62109 1.14523 2.61984 2.31767 3.4423 2.71856C3.74555 2.86638 4.09997 2.86638 4.40322 2.71856ZM2.75091 3.33266C1.88364 2.91104 0.874 3.54154 0.872237 4.50587L0.870734 5.32774C0.869816 5.82973 1.1563 6.28796 1.60799 6.50698C2.4766 6.92816 3.48654 6.29546 3.48654 5.33013V4.50825C3.48654 4.00789 3.20091 3.55143 2.75091 3.33266ZM4.35898 6.02377C4.35898 6.66923 5.03344 7.09296 5.61494 6.81282C5.918 6.66683 6.11067 6.36016 6.11067 6.02377V4.9274C6.11067 4.6341 6.27842 4.36665 6.54246 4.23896L6.56551 4.22781C6.81652 4.10643 6.97554 3.8517 6.97436 3.57288C6.9721 3.03947 6.41342 2.69152 5.93369 2.92474L5.09603 3.33197C4.64516 3.55117 4.35898 4.0085 4.35898 4.50983V6.02377ZM8.85797 6.30941C7.9907 5.88778 6.98106 6.51829 6.97929 7.48261L6.97779 8.30448C6.97687 8.80648 7.26336 9.2647 7.71505 9.48373C8.58366 9.9049 9.5936 9.27221 9.5936 8.30687V7.485C9.5936 6.98464 9.30797 6.52818 8.85797 6.30941ZM10.466 8.30397C10.466 9.26909 11.4773 9.90043 12.3444 9.47667C12.7924 9.25772 13.0765 8.80263 13.0765 8.30396V7.48381C13.0765 6.51985 12.0675 5.88846 11.2006 6.30993C10.7513 6.52838 10.466 6.98417 10.466 7.48381V8.30397Z"
                                fill="#0755E9"
                              />
                            </svg>
                          ),
                        },
                        {
                          value: v?.duration,
                          icon: (
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 13 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M6.37578 4.61962C6.37578 5.22871 6.62175 5.81199 7.05789 6.23717L8.45465 7.59881C8.59802 7.73857 8.59809 7.96901 8.4548 8.10886C8.31646 8.24387 8.0957 8.24394 7.95728 8.109L6.40122 6.59207C5.92344 6.12631 5.65399 5.48734 5.65399 4.8201V2.70635C5.65399 2.50703 5.81557 2.34545 6.01489 2.34545C6.2142 2.34545 6.37578 2.50703 6.37578 2.70635V4.61962ZM6.01489 11.7273C2.69287 11.7273 0 9.10212 0 5.86364C0 2.62515 2.69287 0 6.01489 0C9.33691 0 12.0298 2.62515 12.0298 5.86364C12.0298 9.10212 9.33691 11.7273 6.01489 11.7273ZM6.01489 11.0236C7.41871 11.0236 8.76503 10.48 9.75768 9.51231C10.7503 8.54462 11.308 7.23215 11.308 5.86364C11.308 4.49512 10.7503 3.18265 9.75768 2.21497C8.76503 1.24728 7.41871 0.703636 6.01489 0.703636C4.61107 0.703636 3.26475 1.24728 2.2721 2.21497C1.27945 3.18265 0.721787 4.49512 0.721787 5.86364C0.721787 7.23215 1.27945 8.54462 2.2721 9.51231C3.26475 10.48 4.61107 11.0236 6.01489 11.0236Z"
                                fill="#0755E9"
                              />
                            </svg>
                          ),
                        },
                        {
                          value: v?.amount,
                          icon: (
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 13 13"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M4.56509 8.06876H6.87851C7.38746 8.06876 7.80388 7.66282 7.80388 7.16667C7.80388 6.67051 7.38746 6.26457 6.87851 6.26457H5.95314C5.44419 6.26457 5.02778 5.85862 5.02778 5.36247C5.02778 4.86632 5.44419 4.46037 5.95314 4.46037H8.26656M6.41583 3.10723V4.15997M6.41583 7.61772V9.42191M12.4307 6.26457C12.4307 7.8197 11.797 9.31114 10.669 10.4108C9.54099 11.5104 8.01108 12.1282 6.41583 12.1282C4.82058 12.1282 3.29067 11.5104 2.16266 10.4108C1.03465 9.31114 0.40094 7.8197 0.40094 6.26457C0.40094 4.70944 1.03465 3.218 2.16266 2.11835C3.29067 1.01871 4.82058 0.400932 6.41583 0.400932C8.01108 0.400932 9.54099 1.01871 10.669 2.11835C11.797 3.218 12.4307 4.70944 12.4307 6.26457Z"
                                stroke="#0755E9"
                                strokeWidth="0.801865"
                                strokeMiterlimit="10"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ),
                        },
                      ].map((item, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          {item.icon}
                          <p className="text-xs font-medium leading-[12px] text-heading">
                            {item.value || "-"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-[calc(25%-6px)] min-h-[190px] relative border-[#D4D4D4] border-[1px] w-full bg-white rounded-xl p-[16px]">
            <div className="flex gap-2 items-center justify-between">
              <p className="text-heading font-semibold text-xs">
                {activeData?.doctorName || "Unknown Doctor"}
              </p>
              <Avatar src={activeData?.doctor?.image} className="h-10 w-10" />
            </div>
            <div className="flex justify-between items-center mt-2">
              <div>
                <p className="text-[#7D7D7D] text-[10px] font-normal">
                  Prescriptions Goal
                </p>
                <p className="text-heading text-sm font-semibold">
                  {activeData?.quantity || 0}
                </p>
              </div>
              <div>
                <p className="text-[#7D7D7D] text-[10px] font-normal">Amount</p>
                <p className="text-heading text-sm font-semibold">
                  {activeData?.amount || 0}
                </p>
              </div>
            </div>
            <div className="absolute md:bottom-4 bottom-0 left-1/2 transform -translate-x-1/2">
              <ProgressBar
                percentage={activeData?.percentage || 0}
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
