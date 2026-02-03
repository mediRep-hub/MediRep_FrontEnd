import { Avatar } from "antd";
import { MdPhone, MdEmail } from "react-icons/md";
import { FaClock, FaDotCircle } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoBulb } from "react-icons/io5";
import { Icon } from "@iconify/react";

interface DoctorCardProps {
  doctor: any;
  setdeleteID: any;
  onEdit: (id: string) => void;
  setAddDoctor: any;
}

export default function DoctorCard({
  doctor,
  onEdit,
  setdeleteID,
  setAddDoctor,
}: DoctorCardProps) {
  return (
    <>
      <div className="bg-white py-4 px-5 rounded-xl h-auto">
        <div className="flex justify-between flex-wrap gap-2 items-start">
          <div className="flex items-center gap-3">
            <Avatar
              src={doctor?.image}
              className="min-w-10 h-10 border-[0.5px] border-[#7d7d7d]"
            />
            <div>
              <div className="flex gap-3">
                <p className="leading-[100%] text-heading font-medium text-sm">
                  {doctor?.name}
                </p>{" "}
              </div>
              <p className="leading-1 text-primary font-medium text-xs">
                {doctor?.docId || doctor?.pharmacyId}
              </p>
              {doctor?.PMDC && (
                <p className="text-[#E90761] leading-[100%] text-xs font-normal">
                  {doctor?.PMDC}
                </p>
              )}{" "}
            </div>
          </div>
          {doctor?.doctorClass && (
            <div
              className={`px-2 py-0.5 mt-3 md:mt-0 rounded-sm ${
                doctor.doctorClass === "Class A"
                  ? "bg-[#0BA69C]"
                  : doctor.doctorClass === "Class B"
                    ? "bg-primary"
                    : doctor.doctorClass === "Class C"
                      ? "bg-[#AC7F5E]"
                      : "bg-gray-700"
              }`}
            >
              <p className="leading-1 text-white font-medium md:text-sm text-xs">
                {doctor.doctorClass}
              </p>
            </div>
          )}
          {doctor?.channel && (
            <div
              className={`px-2 py-0.5 mt-3 md:mt-0 rounded-sm ${
                doctor.channel === "Chain Pharmacy"
                  ? "bg-[#0BA69C]"
                  : doctor.channel === "RT"
                    ? "bg-primary"
                    : doctor.channel === "Wholesale"
                      ? "bg-[#AC7F5E]"
                      : "bg-gray-700"
              }`}
            >
              <p className="leading-1 text-white font-medium md:text-sm text-xs">
                {doctor.channel}
              </p>
            </div>
          )}

          <div
            className="group w-12 bg-white h-12 ml-auto md:ml-0 mt-0 md:mt-0  rounded-md border border-primary cursor-pointer flex items-center justify-center hover:bg-primary transition-all duration-300"
            onClick={() => {
              if (doctor._id) {
                onEdit(doctor._id);
                setdeleteID(doctor._id);
                setAddDoctor(true);
              }
            }}
          >
            <Icon
              icon="line-md:edit-filled"
              height="24"
              width="24"
              className="text-primary group-hover:text-white transition-all duration-300"
            />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {doctor?.DSL && (
            <div className="flex gap-3 items-center">
              <Icon
                icon="material-symbols:license-rounded"
                color="#7d7d7d"
                className="min-w-[12px]"
              />
              <p className="text-heading text-xs font-normal">{doctor?.DSL}</p>
            </div>
          )}{" "}
          {doctor?.specialty && (
            <div className="flex gap-3 items-center">
              <IoBulb color="#7d7d7d" className="min-w-[12px]" />
              <p className="text-heading text-xs font-normal">
                {doctor?.specialty}
              </p>
            </div>
          )}{" "}
          <div className="flex gap-3 items-center">
            <MdPhone color="#7d7d7d" className="min-w-[12px]" />
            <p className="text-heading text-xs font-normal">{doctor?.phone}</p>
          </div>
          <div className="flex gap-3 items-center">
            <FaLocationDot color="#7d7d7d" className="min-w-[12px]" />
            <p className="text-heading text-xs font-normal">
              {doctor?.location?.address}
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <FaClock color="#7d7d7d" className="min-w-[12px]" />
            <p className="text-heading text-xs font-normal">
              {doctor?.startTime} - {doctor?.endTime}
            </p>
          </div>{" "}
          <div className="flex gap-3 items-center">
            <MdEmail color="#7d7d7d" className="min-w-[12px]" />
            <p className="text-heading text-xs font-normal">{doctor?.email}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between mt-5">
          <div>
            <p className="text-primary text-xs font-medium">Affiliation</p>
            <ul className="list-none space-y-1 mt-2 ">
              <li className="flex items-start gap-2 text-xs font-normal text-heading">
                <FaDotCircle size={8} className="text-[#7d7d7d] mt-1" />
                {doctor?.affiliation}
              </li>
            </ul>
          </div>

          <div className="xl:mt-0 mt-5 md:w-auto w-full">
            <div className="relative inline-block w-full">
              <div className="absolute -top-2 left-4 bg-primary px-2 py-[2px] rounded-sm">
                <p className="text-white leading-[12px] font-normal text-xs">
                  City
                </p>
              </div>
              <button className="h-[55px] md:w-[150px] w-full text-[#0ECABE] border-[#0ECABE] border bg-white rounded-[6px] gap-3 flex justify-center items-center">
                {doctor?.city}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
