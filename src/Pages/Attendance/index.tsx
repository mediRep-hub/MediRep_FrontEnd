import { useQuery } from "@tanstack/react-query";
import CustomTable from "../../Components/CustomTable";
import {
  createDailyAttendance,
  getAllAttendance,
  updateAttendanceAdmin,
} from "../../api/attendanceServices";
import dayjs, { Dayjs } from "dayjs";
import { TbEdit } from "react-icons/tb";
import { useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import TimePicker from "../../Components/TimePicker";
import { useFormik } from "formik";
import { Spin } from "antd";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { notifyError, notifySuccess } from "../../Components/Toast";
import SearchById from "../../Components/SearchBar/searchById";
import SearchByName from "../../Components/SearchBar/searchByName";

import type { AxiosResponse } from "axios";
import { useDebounce } from "../../Components/Debounce";
import { Icon } from "@iconify/react";

const titles = [
  "Employee Id",
  "Employee Name",
  // "Employee Role",
  "Date",
  "CheckIn",
  "CheckOut",
  "Checkout Location",
  "Status",
  "Action",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function Attendance() {
  useEffect(() => {
    document.title = "MediRep | Attendance";
  }, []);

  const [activeTab, setActiveTab] = useState<"Field Staff" | "Office Staff">(
    "Field Staff"
  );

  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [rotated, setRotated] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [openModel, setOpenModel] = useState(false);
  const [isloading, setLoading] = useState(false);
  const [isloadingAttendance, setLoadingAttendance] = useState(false);

  const debouncedSearchId = useDebounce(searchId, 500);
  const debouncedSearchName = useDebounce(searchName, 500);
  const handleClickRefech = () => {
    setRotated(true);
    refetch();
    setTimeout(() => setRotated(false), 500);
  };

  const searchValue = debouncedSearchId || debouncedSearchName;
  const getStatusClasses = (status: string) => {
    switch (status) {
      case "Present":
        return "text-green-600 border border-green-600";
      case "Absent":
        return "text-red-600 border border-red-600";
      case "Late":
        return "text-orange-500 border border-orange-500";
      case "On Leave":
        return "text-blue-600 border border-blue-600";
      default:
        return "text-gray-500 border border-gray-500";
    }
  };

  const [selectedMonthYear, setSelectedMonthYear] = useState<{
    month: number;
    year: number;
  }>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const { data, refetch, isFetching } = useQuery<AxiosResponse<any>>({
    queryKey: ["Attendance", searchValue, selectedMonthYear],
    queryFn: () =>
      getAllAttendance({
        search: searchValue,
        month: selectedMonthYear.month,
        year: selectedMonthYear.year,
      }),
    placeholderData: (previousData) => previousData,
  });

  const filteredData = data?.data.filter((v: any) => {
    if (activeTab === "Office Staff")
      return v.employee.employeeType === "Office Staff";
    if (activeTab === "Field Staff")
      return v.employee.employeeType === "Field Staff";
    if (activeTab === "Admin") return v.employee.employeeType === "Admin";
    return true;
  });

  const tableData =
    filteredData?.map((v: any) => [
      v.employee?.employeeId,
      v.employee.employeeName,
      // <p>
      //   {v.employee.employeeRole === "mr"
      //     ? "Medical Rep"
      //     : v.employee.employeeRole === "am"
      //     ? "Area Manager"
      //     : v.employee.employeeRole === "rm"
      //     ? "Regional Manager"
      //     : v.employee.employeeRole === "hr"
      //     ? "HR"
      //     : v.employee.employeeRole === "admin"
      //     ? "Admin"
      //     : "Unknown Role"}
      // </p>,
      v.date ? dayjs(v.date).format("YYYY-MM-DD") : "--",
      v.checkIn?.time ? dayjs(v.checkIn.time).format("HH:mm") : "--",
      v.checkOut?.time ? dayjs(v.checkOut.time).format("HH:mm") : "--",

      <GeoAddress
        lat={v.checkOut?.location?.lat}
        lng={v.checkOut?.location?.lng}
      />,

      <p
        className={`px-2 py-0.5 rounded inline-block text-center ${getStatusClasses(
          v?.status
        )}`}
      >
        {v?.status}
      </p>,
      <button
        disabled={v.status == "On Leave"}
        className="text-[#0755E9] disabled:text-[#7d7d7d]/48"
      >
        <TbEdit
          key={v._id}
          size={18}
          className="cursor-pointer "
          onClick={() => {
            setEditing(v);
            setOpenModel(true);
          }}
        />
      </button>,
    ]) || [];

  const formik = useFormik<{
    checkIn: Dayjs | null;
    checkOut: Dayjs | null;
  }>({
    enableReinitialize: true,
    initialValues: {
      checkIn: editing?.checkIn?.time ? dayjs(editing.checkIn.time) : null,
      checkOut: editing?.checkOut?.time ? dayjs(editing.checkOut.time) : null,
    },
    onSubmit: (values) => {
      setLoading(true);

      const payload = {
        checkInTime: values.checkIn ? values.checkIn.toISOString() : undefined,

        checkOutTime: values.checkOut
          ? values.checkOut.toISOString()
          : undefined,
      };

      updateAttendanceAdmin(editing._id, payload)
        .then(() => {
          notifySuccess("Attendance updated successfully");
          setOpenModel(false);
          setEditing(null);
          formik.resetForm();
          refetch();
        })
        .catch(() => notifyError("Failed to update Attendance"))
        .finally(() => setLoading(false));
    },
  });

  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 24, color: "white" }} spin />
  );

  const handleGenerateAttendance = async () => {
    setLoadingAttendance(true);
    try {
      const res = await createDailyAttendance();

      notifySuccess(
        res.data?.message || "Daily attendance generated successfully"
      );
      refetch();
    } catch (error: any) {
      console.error("Generate attendance error:", error);

      notifyError(
        error.response?.data?.message || "Failed to generate daily attendance"
      );
    } finally {
      setLoadingAttendance(false);
    }
  };
  return (
    <div className="bg-[#F7F7F7] md:h-[calc(100vh-129px)] h-auto rounded-xl p-4">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 md:flex-nowrap">
          <div className="flex flex-wrap w-full gap-3 sm:w-auto md:flex-nowrap">
            <div
              onClick={handleClickRefech}
              className="flex items-center justify-center h-10 bg-[#E5EBF7] rounded-md cursor-pointer min-w-10"
            >
              <Icon
                icon="ion:reload-outline"
                className={`text-xl ${
                  rotated ? "animate-spin" : ""
                } transition-transform duration-200`}
              />
            </div>
            <div className="w-[calc(100%-60px)] md:w-[180px] lg:w-[192px] xl:w-auto 2xl:w-auto">
              <MonthYearPickerNumber
                value={selectedMonthYear}
                onChange={setSelectedMonthYear}
              />{" "}
            </div>
          </div>
          <div className="flex flex-wrap gap-3 md:flex-nowrap">
            <div className="w-full md:w-53 lg:w-auto">
              {" "}
              <SearchById value={searchId} onChange={setSearchId} />
            </div>
            <div className="w-full md:w-53 lg:w-auto">
              <SearchByName value={searchName} onChange={setSearchName} />
            </div>
          </div>
        </div>
      </div>{" "}
      <div className="flex flex-wrap items-center justify-between w-full gap-4 mt-4 xl:flex-nowrap md:w-auto">
        <div className="flex flex-wrap w-full gap-4 mb-4 md:w-auto md:mb-0 ">
          {["Field Staff", "Office Staff", "Admin"].map((role) => (
            <div
              key={role}
              onClick={() => setActiveTab(role as any)}
              className={`cursor-pointer rounded-t-2xl rounded-b-2xl md:rounded-b-none h-10 md:h-14 flex justify-center items-center sm:w-[120px] xl:w-[120px] w-full ${
                activeTab === role
                  ? "bg-[#E5EBF7] text-black"
                  : "bg-white text-[#7d7d7d]"
              }`}
            >
              <p className="text-xs font-medium lg:text-sm">{role}</p>
            </div>
          ))}
        </div>
        <button
          onClick={handleGenerateAttendance}
          className="h-10 md:mb-0 mb-4  text-white w-full md:w-[180px] bg-[#0755E9] rounded-md gap-3 cursor-pointer flex justify-center items-center"
        >
          {isloadingAttendance ? (
            <Spin indicator={antIcon} />
          ) : (
            "Generate Attendance"
          )}
        </button>
      </div>{" "}
      <div
        className={`bg-[#E5EBF7] p-4 rounded-xl h-auto  ${
          activeTab === "Field Staff" ? "rounded-tl-none" : ""
        }`}
      >
        <p className="text-[#7D7D7D] font-medium text-sm">Employee’s List</p>

        <div
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="mt-2 overflow-y-auto bg-white rounded-xl 2xl:h-[calc(67.2vh-0px)] xl:h-[calc(48vh-0px)]"
        >
          <CustomTable
            titles={titles}
            data={tableData}
            isFetching={isFetching}
          />
        </div>
      </div>
      {openModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="relative mx-3 bg-white rounded-xl w-[600px]">
            <div className="flex justify-between p-6 bg-[#E5EBF7] rounded-t-xl">
              <p className="text-xl font-medium">Updated Attendance</p>
              <IoMdCloseCircle
                size={22}
                onClick={() => setOpenModel(false)}
                className="cursor-pointer text-[#0755E9]"
              />
            </div>

            <form onSubmit={formik.handleSubmit} className="p-6">
              <div className="space-y-4">
                <TimePicker
                  label="CheckIn"
                  value={formik.values.checkIn}
                  onChange={(checkIn) =>
                    formik.setFieldValue("checkIn", checkIn)
                  }
                />

                <TimePicker
                  label="Check out"
                  value={formik.values.checkOut}
                  onChange={(checkOut) =>
                    formik.setFieldValue("checkOut", checkOut)
                  }
                />
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="h-10 md:w-50 w-full cursor-pointer bg-[#0755E9] text-white rounded-md flex justify-center items-center"
                >
                  {isloading ? (
                    <Spin indicator={antIcon} />
                  ) : (
                    "Updated Attendaence"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 20 }, (_, i) => currentYear - 10 + i);
interface MonthYearPickerProps {
  value: { month: number; year: number }; // month is number now
  onChange: (val: { month: number; year: number }) => void;
}

const MonthYearPickerNumber: React.FC<MonthYearPickerProps> = ({
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  const handleMonthChange = (month: number) => {
    onChange({ ...value, month });
  };

  const handleYearChange = (year: number) => {
    onChange({ ...value, year });
  };

  return (
    <div className="relative inline-block w-full h-10 lg:w-45">
      <div
        className="flex items-center justify-between px-3 py-2 text-sm text-[#131313] border border-[#0755E9] rounded-lg cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2">
          <Icon icon="mdi:calendar" width={20} height={20} color="#0755E9" />
          <span>{`${value.month}-${value.year}`}</span>
        </div>
        <Icon
          icon={open ? "mdi:chevron-up" : "mdi:chevron-down"}
          width={20}
          height={20}
        />
      </div>

      {open && (
        <div className="absolute z-50 flex w-full gap-2 p-3 mt-1 text-xs bg-[#E5EBF7] rounded shadow-lg">
          <select
            className="flex-1 p-1 w-10 border border-[#0755E9] rounded"
            value={value.month}
            onChange={(e) => handleMonthChange(Number(e.target.value))}
          >
            {months.map((m, i) => (
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </select>

          <select
            className="flex-1 p-1 border-[#0755E9] border rounded"
            value={value.year}
            onChange={(e) => handleYearChange(Number(e.target.value))}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

interface GeoAddressProps {
  lat: number;
  lng: number;
}

const GeoAddress: React.FC<GeoAddressProps> = ({ lat, lng }) => {
  const [address, setAddress] = useState<string>("Loading...");

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&result_type=street_address&language=en&key=AIzaSyBrNjsUsrJ0Mmjhe-WUKDKVaIsMkZ8iQ4A`
        );
        const data = await res.json();
        if (data.status === "OK" && data.results.length > 0) {
          setAddress(data.results[0].formatted_address);
        } else {
          setAddress("--");
        }
      } catch (error) {
        console.error(error);
        setAddress("Error fetching address");
      }
    };

    fetchAddress();
  }, [lat, lng]);

  return <p>{address}</p>;
};
