import { Avatar } from "antd";
import { MdEdit, MdPhone, MdEmail } from "react-icons/md";
import { FaClock, FaDotCircle } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoBulb } from "react-icons/io5";

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
    <div className="bg-white py-4 px-5 rounded-xl h-auto">
      <div className="flex justify-between flex-wrap items-start">
        <div className="flex items-center gap-3 md:w-auto w-full">
          <Avatar
            src={doctor?.image}
            className="w-10 h-10 border-[0.5px] border-[#7d7d7d]"
          />
          <div>
            <p className="leading-1 text-heading font-medium text-sm">
              {doctor?.name}
            </p>
            <p className="leading-1 text-primary font-medium text-xs">
              {doctor?.docId}
            </p>
          </div>
        </div>
        {/* <div
          className={`px-2 py-1 rounded-sm flex justify-center items-center 
    ${doctor?.profileType === "Doctor" ? "bg-primary" : "bg-[#0BA69C]"}`}
        >
          <p className="text-sm text-white leading-[100%]">
            {" "}
            {doctor?.profileType}
          </p>
        </div> */}

        <div
          className="group w-12 bg-white h-12 ml-auto md:ml-0 mt-4 md:mt-0  rounded-md border border-primary cursor-pointer flex items-center justify-center hover:bg-primary transition-all duration-300"
          onClick={() => {
            if (doctor._id) {
              onEdit(doctor._id);
              setdeleteID(doctor._id);
              setAddDoctor(true);
            }
          }}
        >
          <MdEdit
            size={24}
            className="text-primary group-hover:text-white transition-all duration-300"
          />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {doctor?.specialty && (
          <div className="flex gap-3 items-center">
            <IoBulb color="#7d7d7d" />
            <p className="text-heading text-xs font-normal">
              {doctor?.specialty}
            </p>
          </div>
        )}
        <div className="flex gap-3 items-center">
          <MdPhone color="#7d7d7d" />
          <p className="text-heading text-xs font-normal">{doctor?.phone}</p>
        </div>
        <div className="flex gap-3 items-center">
          <FaLocationDot color="#7d7d7d" />
          <p className="text-heading text-xs font-normal">
            {doctor?.location?.address}
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <FaClock color="#7d7d7d" />
          <p className="text-heading text-xs font-normal">
            {doctor?.startTime} - {doctor?.endTime}
          </p>
        </div>{" "}
        <div className="flex gap-3 items-center">
          <MdEmail color="#7d7d7d" />
          <p className="text-heading text-xs font-normal">{doctor?.email}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-end justify-between mt-5">
        <div>
          <p className="text-primary text-xs font-medium">Affiliation</p>
          <ul className="list-none space-y-1 mt-2 ">
            <li className="flex items-start gap-2 text-xs font-normal  text-heading">
              <FaDotCircle size={8} className="text-[#7d7d7d] mt-1" />
              {doctor?.affiliation}
            </li>
          </ul>
        </div>

        <div className="xl:mt-0 mt-5">
          <div className="relative inline-block">
            <div className="absolute -top-2 left-4 bg-primary px-2 py-[2px] rounded-sm">
              <p className="text-white leading-[12px] font-normal text-xs">
                Region
              </p>
            </div>
            <button className="h-[55px] w-[150px] text-[#0ECABE] border-[#0ECABE] border bg-white rounded-[6px] gap-3 flex justify-center items-center">
              {doctor?.region}
            </button>
          </div>

          {/* <div className="flex items-center gap-3 mt-4">
            <FaCalendar className="text-primary" />
            <p className="text-primary text-xs  font-normal">
              Next Visit {doctor?.nextVisit}
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}
