import { Icon } from "@iconify/react";
import PieCharts, { Barchart } from "../Components/Charts";
import type { AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";
import { getAllCamps, getAllDashboardStats } from "../../../api/campsServices";
import { MonthYearPicker } from "../../../Components/FilterMonthYear";
import { useEffect, useState } from "react";
import { IoIosArrowDown, IoMdCloseCircle } from "react-icons/io";
import CustomSelect from "../../../Components/Select";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { Spin } from "antd";

export default function CampDashboard() {
  const [animate, setAnimate] = useState(false);
  const [filters, setFilters] = useState({
    brickCode: "",
    campType: "",
    sampleType: "",
    chemist: "",
    doctor: "",
    products: "",
  });
  const [selectedMonthYear, setSelectedMonthYear] = useState<any>(null);
  const { data: allstats, isFetching } = useQuery({
    queryKey: [
      "getAllDashboardStats",
      selectedMonthYear?.startDate,
      selectedMonthYear?.endDate,
      filters.brickCode,
      filters.campType,
      filters.sampleType,
      filters.doctor,
      filters.chemist,
      filters.products,
    ],
    queryFn: () => {
      const params: any = {};

      if (selectedMonthYear?.startDate && selectedMonthYear?.endDate) {
        params.from = selectedMonthYear.startDate;
        params.to = selectedMonthYear.endDate;
      }

      if (filters.brickCode) params.brickCode = filters.brickCode;
      if (filters.campType) params.campType = filters.campType;
      if (filters.sampleType) params.sampleType = filters.sampleType;

      if (filters.doctor) params.doctor = filters.doctor;
      if (filters.chemist) params.chemist = filters.chemist;

      // IMPORTANT FIX
      if (filters.products) params.product = filters.products;

      return getAllDashboardStats(params);
    },
  });
  const [isFilter, setFilter] = useState(false);
  const stats = allstats?.data?.data ?? {};
  console.log("🚀 ~ stats:", stats);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 10);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    document.title = "MediRep | Dashboard";
  }, []);
  const percentage = stats?.percentage ?? {
    planned: 0,
    executed: 0,
    doctors: 0,
    chemists: 0,
    products: 0,
    patients: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  };
  const cards = [
    {
      title: "Planned Camps",
      count: stats?.approved,
      icon: "icon-park-solid:plan",
      parcentage: percentage?.planned ?? 0,
      bgcolor: "#4F46E5",
    },
    {
      title: "Executed Camps",
      count: stats?.executed,
      icon: "mdi:campfire",
      parcentage: percentage?.executed ?? 0,
      bgcolor: "#22C55E",
    },
    {
      title: "Total Doctors",
      count: stats?.totalDoctors,
      icon: "healthicons:doctor-male",
      parcentage: percentage?.doctors ?? 0,
      bgcolor: "#131313",
    },
    {
      title: "Total Territories",
      count: stats?.totalTerritories,
      icon: "mdi:map-marker-radius",
      parcentage: percentage?.planned ?? 0,
      bgcolor: "#131313",
    },
    {
      title: "Total Patients",
      count: stats?.totalPatients,
      icon: "fa6-solid:bed-pulse",
      parcentage: percentage?.patients ?? 0,
      bgcolor: "#131313",
    },
    {
      title: "Total Chemists",
      count: stats?.totalChemists,
      icon: "mdi:flask-outline",
      parcentage: percentage?.chemists ?? 0,
      bgcolor: "#131313",
    },
    {
      title: "Total Products",
      count: stats?.totalProducts,
      icon: "mdi:package-variant-closed",
      parcentage: percentage?.products ?? 0,
      bgcolor: "#131313",
    },
    {
      title: "Rejected Camps",
      count: stats?.rejected,
      icon: "mdi:package-variant-closed",
      parcentage: percentage?.rejected ?? 0,
      bgcolor: "#EF4444",
    },
  ];
  const pieData = [
    {
      name: "Approved",
      value: stats?.approved || 0,
    },
    {
      name: "Executed",
      value: stats?.executed || 0,
    },
    {
      name: "Pending",
      value: stats?.pending || 0,
    },
    {
      name: "Rejected",
      value: stats?.approved || 0,
    },
  ];
  const barData = [...(stats?.barData || [])]
    .map((item: any) => {
      const approved = item.approved || 0;
      const executed = item.completed || 0; // 👈 rename here
      const pending = item.pending || 0;
      const rejected = item.rejected || 0;

      return {
        name: item.brickCode,

        approved,
        executed, // 👈 use executed everywhere
        pending,
        rejected,

        totalCamps: approved + executed + pending + rejected,
      };
    })
    .sort((a, b) => b.totalCamps - a.totalCamps);
  const totalCamps =
    (stats?.approved || 0) + (stats?.executed || 0) + (stats?.pending || 0);
  const { data: allcamps } = useQuery<AxiosResponse<any>>({
    queryKey: ["getAllCamps"],
    queryFn: () => getAllCamps(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const camps = allcamps?.data?.data || [];

  const antIcon22 = (
    <Loading3QuartersOutlined style={{ fontSize: 80, color: "#0755E9" }} spin />
  );
  const uniqueStrings = (arr: (string | undefined | null)[]) =>
    Array.from(new Set(arr.filter((v): v is string => typeof v === "string")));
  const handleClearFilters = () => {
    const resetFilters = {
      brickCode: "",
      campType: "",
      sampleType: "",
      chemist: "",
      doctor: "",
      products: "",
    };

    setFilters(resetFilters);

    setSelectedMonthYear(null);
  };
  const chemistOptions: SelectOption[] = Array.from(
    new Map<string, SelectOption>(
      camps
        .flatMap((c: any) => c.chemists || [])
        .map((i: any) => [i._id, { label: i.name, value: i._id }]),
    ).values(),
  );
  const doctorOptions: SelectOption[] = Array.from(
    new Map<string, SelectOption>(
      camps
        .flatMap((c: any) => c.doctors || [])
        .map((i: any) => [i._id, { label: i.name, value: i._id }]),
    ).values(),
  );
  const productOptions: SelectOption[] = Array.from(
    new Map(
      camps
        .flatMap((c: any) => c.products || [])
        .map((p: any) => {
          const prod = p.productId;
          if (!prod?._id) return null;

          return [prod._id, { label: prod.productName, value: prod._id }];
        })
        .filter(Boolean) as [string, SelectOption][],
    ).values(),
  );
  return (
    <>
      {isFetching ? (
        <div
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          className="bg-secondary lg:h-[calc(100vh-129px)] flex justify-center overflow-y-auto h-auto rounded-[12px] p-4"
        >
          <Spin indicator={antIcon22} className="mt-10" />
        </div>
      ) : (
        <div
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          className="bg-secondary lg:h-[calc(100vh-129px)] overflow-y-auto h-auto rounded-[12px] p-4"
        >
          <div className="flex flex-wrap gap-3 items-center justify-between ">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-heading font-medium text-[22px]">
                Camps Dashboard
              </p>{" "}
              <MonthYearPicker
                value={selectedMonthYear}
                onChange={(val) => {
                  setSelectedMonthYear({
                    startDate: val?.startDate,
                    endDate: val?.endDate,
                  });
                }}
              />
            </div>
            <button
              onClick={() => {
                setFilter(true);
              }}
              className="h-14 md:w-[128px] w-full bg-primary rounded-md items-center  text-white justify-center gap-2 flex"
            >
              <Icon icon="jam:filter" className="text-2xl" />
              <p>Filters</p>
            </button>
          </div>
          <div className="flex flex-wrap  gap-3 pb mt-3">
            <div className="grid xl:grid-cols-4 2xl:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 w-full 2xl:w-[calc(70%-6px)] xl:w-[calc(75%-6px)]  gap-3">
              {cards.map((item, index) => (
                <div
                  style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
                  key={index}
                  className="w-full  justify-between rounded-md p-4 bg-white"
                >
                  <div className="flex  items-center gap-2  ">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex justify-center items-center">
                      <Icon icon={item.icon} className="text-primary text-lg" />
                    </div>

                    <p className="text-base font-normal text-[#131313]">
                      {item.title}
                    </p>
                  </div>

                  <p
                    className="xl:text-2xl text-center lg:text-3xl text-2xl font-medium mt-2"
                    style={{ color: item.bgcolor }}
                  >
                    {item.count}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div
                      className={`flex items-center gap-3 py-1 px-2 rounded-xl ${
                        Number(item.parcentage) < 0
                          ? "text-red-500 bg-red-100"
                          : "text-green-500 bg-green-100"
                      }`}
                    >
                      <Icon
                        icon={
                          Number(item.parcentage) < 0
                            ? "solar:graph-down-linear"
                            : "solar:graph-up-linear"
                        }
                        className="text-xl"
                      />
                      <p className="text-sm">{item.parcentage.toFixed(1)}%</p>
                    </div>
                    <p className="xl:text-[10px] 2xl:text-sm text-[#131313]">
                      From Last Month
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
              className="bg-white rounded-xl items-end w-full 2xl:w-[calc(30%-6px)] xl:w-[calc(25%-6px)]"
            >
              <PieCharts pieData={pieData} total={totalCamps} />
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-3">
            <div
              className="bg-white rounded-xl  w-full "
              style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
            >
              {" "}
              <Barchart data={barData} />
            </div>
            {/* <div className="bg-white rounded-xl w-full lg:w-[calc(35%-6px)] p-4 flex flex-col h-[400px]">
          <h2 className="text-sm font-semibold mb-3">
            Top 10 Employees on Leaderboard
          </h2>

          <div className="flex items-center border-b-[0.5px] border-[#7d7d7d]/34 justify-between pb-2">
            <p className="font-semibold text-sm">Employee</p>
            <p className="font-semibold text-sm">Total Points</p>
          </div>

          <div
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="flex-1 overflow-y-auto"
          >
            {employees.map((emp, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-gray-100"
              >
                <p className="font-normal text-sm text-[#272727]/60">
                  {emp.name}
                </p>
                <p className="font-normal text-sm text-[#272727]/60">
                  {emp.points}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t-[0.5px] border-[#7d7d7d]/34 pt-3">
            <p className="font-semibold text-sm">Total</p>
            <p className="font-semibold text-sm">{totalPoints}</p>
          </div>
        </div> */}
          </div>
        </div>
      )}
      {isFilter && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-end items-center z-50">
          <div
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className={`bg-white
          rounded-xl md:rounded-tl-xl md:rounded-bl-xl md:rounded-tr-none md:rounded-br-none
          xl:mx-0 mx-5 md:mx-0
          w-[500px] h-[90vh] md:h-[100vh] overflow-y-auto
          shadow-xl relative
          transform transition-transform duration-500 ease-in-out flex flex-col justify-between
          ${animate ? "translate-x-0" : "translate-x-full"}
        `}
          >
            <div>
              <div className="flex items-center xl:p-6 p-4  bg-[#E5EBF7] justify-between">
                <p className="text-[24px] text-heading capitalize font-semibold">
                  Select Filters
                </p>
                <div className="h-[35px] group w-[35px] p-2 rounded-full  hover:shadow-[rgba(99,99,99,0.25)_0px_4px_12px_2px] flex items-center justify-center">
                  <div className="group-hover:bg-white">
                    <IoMdCloseCircle
                      size={24}
                      onClick={() => {
                        setFilter(false);
                      }}
                      className="cursor-pointer text-primary"
                    />
                  </div>
                </div>
              </div>
              <div className="flex-1 xl:p-6 p-4 space-y-3">
                <CustomSelect
                  placeholder="Brick Code"
                  value={filters.brickCode}
                  options={uniqueStrings(camps.map((i: any) => i.brickCode))}
                  onChange={(val) =>
                    setFilters((prev) => ({ ...prev, brickCode: val }))
                  }
                />
                <CustomSelect
                  placeholder="Camp Type"
                  value={filters.campType}
                  options={uniqueStrings(camps.map((i: any) => i.campType))}
                  onChange={(val) =>
                    setFilters((prev) => ({ ...prev, campType: val }))
                  }
                />
                <CustomSelect
                  placeholder="Sample Type"
                  value={filters.sampleType}
                  options={uniqueStrings(camps.map((i: any) => i.sampleType))}
                  onChange={(val) =>
                    setFilters((prev) => ({ ...prev, sampleType: val }))
                  }
                />
                <CustomSelectNew
                  placeholder="Chemists"
                  value={filters.chemist}
                  options={chemistOptions}
                  onChange={(val) =>
                    setFilters((prev) => ({ ...prev, chemist: val }))
                  }
                />{" "}
                <CustomSelectNew
                  placeholder="Doctor"
                  value={filters.doctor}
                  options={doctorOptions}
                  onChange={(val) =>
                    setFilters((prev) => ({ ...prev, doctor: val }))
                  }
                />{" "}
                <CustomSelectNew
                  placeholder="Products"
                  value={filters.products}
                  options={productOptions}
                  onChange={(val) =>
                    setFilters((prev) => ({ ...prev, products: val }))
                  }
                />
              </div>
            </div>
            <div className="xl:p-6 p-4">
              <button
                onClick={handleClearFilters}
                className="bg-[#E5EBF7] h-14 cursor-pointer w-full rounded-lg text-[#131313]"
              >
                Clear Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
interface SelectOption {
  label: string;
  value: string;
}

interface CustomSelectNewProps {
  options?: SelectOption[];
  value?: string | null;
  onChange?: (value: string) => void;
  placeholder?: string;
}

function CustomSelectNew({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
}: CustomSelectNewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<SelectOption | null>(null);

  useEffect(() => {
    const found = options.find((opt) => opt.value === value);
    setSelected(found || null);
  }, [value, options]);

  const handleSelect = (option: SelectOption) => {
    setSelected(option);
    onChange?.(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <label className="absolute -top-2 left-5 bg-white px-1 text-xs text-[#7D7D7D]">
        {placeholder}
      </label>

      <div
        className="flex items-center h-14 justify-between bg-white px-4 py-2 border-[0.5px] border-primary rounded-md cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={`text-sm capitalize ${
            selected ? "text-heading" : "text-[#7d7d7d]/50 text-sm font-normal"
          }`}
        >
          {selected?.label || "Select the Options"}
        </span>

        <IoIosArrowDown
          className={`transition-transform duration-200 text-primary ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>

      {isOpen && (
        <ul className="absolute mt-1 w-full bg-[#E5EBF7] border rounded-md shadow-xl z-[9999] max-h-60 overflow-y-auto">
          {options.map((option: any, index: number) => (
            <li
              key={index}
              className={`px-4 h-[56px] flex items-center cursor-pointer ${
                option === selected
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100 text-heading"
              }`}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
