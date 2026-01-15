import { Loading3QuartersOutlined } from "@ant-design/icons";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { Avatar, Spin } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaCalendar } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";

export default function BricksDetail() {
  const location = useLocation();
  const doctor = location.state?.doctor;
  const [isLoaction, setLoaction] = useState(false);

  useEffect(() => {
    document.title = "MediRep | Brick Details";
  }, []);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBrNjsUsrJ0Mmjhe-WUKDKVaIsMkZ8iQ4A",
  });
  const navigate = useNavigate();
  const handleGOBack = () => {
    navigate("/bricks");
  };
  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 24, color: "white" }} spin />
  );
  return (
    <div>
      {" "}
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap  gap-4 items-center">
          <div
            onClick={handleGOBack}
            className="h-11 w-11 cursor-pointer rounded-lg border-[#D2D2D2] border-[1px] flex justify-center items-center"
          >
            <FaArrowLeft size={16} color="#000000" />
          </div>

          <p className="text-heading font-medium text-[22px] sm:text-[24px]">
            Brick Details
          </p>
        </div>
        <div className="bg-[#E5EBF7]  mt-4 rounded-[12px] p-4 2xl:h-[calc(76.8vh-0px)] lg:h-[calc(66vh-0px)] h-auto ">
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="scroll-smooth mt-5 p-6 md:gap-0 gap-5 bg-white border border-primary rounded-lg 2xl:h-[calc(71.5vh-0px)] xl:h-[calc(58vh-0px)] overflow-y-auto scrollbar-none"
          >
            <div className="flex justify-between flex-wrap gap-5">
              <div className="flex gap-3 items-center">
                <Avatar size={45} src={doctor?.mrImage} />
                <div>
                  <p className="text-heading font-medium text-sm">
                    {doctor?.mrName}
                  </p>
                  <p className="text-primary text-[12px] font-medium">
                    {" "}
                    {doctor?.mrId}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendar className="text-primary" />
                <p className="text-primary text-sm">
                  Next Visit{" "}
                  {doctor?.nextVisitDate
                    ? dayjs(doctor.nextVisitDate).format("DD MMM YYYY")
                    : "--"}
                </p>
              </div>
              <button
                onClick={() => {
                  setLoaction(true);
                }}
                className="bg-primary text-white rounded-lg h-[50px] md:w-[180px] w-full cursor-pointer"
              >
                Check in location
              </button>
            </div>
            <div className="mt-7">
              <div className="flex items-center gap-5 ">
                <p className="w-[200px] text-[#7D7D7D] text-sm">Call ID:</p>
                <p className="w-[200px] sm:w-full text-heading text-sm">
                  {doctor?.callId}
                </p>
              </div>
              <div className="flex items-center gap-5 mt-2">
                <p className="w-[200px] text-[#7D7D7D] text-sm">Doctor Name:</p>
                <p className="w-[200px] sm:w-full text-heading text-sm">
                  {doctor?.name}
                </p>
              </div>{" "}
              <div className="flex items-center gap-5 mt-2">
                <p className="w-[200px] text-[#7D7D7D] text-sm">
                  Doctor Address:
                </p>
                <p className="w-[200px] sm:w-full text-heading text-sm">
                  {doctor?.address}
                </p>
              </div>{" "}
              <div className="flex items-center gap-5 mt-2">
                <p className="w-[200px] text-[#7D7D7D] text-sm">Brick Name:</p>
                <p className="w-[200px] sm:w-full text-heading text-sm">
                  {doctor?.brickName}
                </p>
              </div>{" "}
              <div className="flex items-center gap-5 mt-2">
                <p className="w-[200px] text-[#7D7D7D] text-sm">Date:</p>
                <p className="w-[200px] sm:w-full text-heading text-sm">
                  {doctor?.date ? dayjs(doctor.date).format("DD/MM/YYYY") : "-"}
                </p>
              </div>{" "}
              <div className="flex items-center gap-5 mt-2">
                <p className="w-[200px] text-[#7D7D7D] text-sm">Check in:</p>
                <p className="w-[200px] sm:w-full text-heading text-sm">
                  {doctor?.checkIn}
                </p>
              </div>{" "}
              <div className="flex items-center gap-5 mt-2">
                <p className="w-[200px] text-[#7D7D7D] text-sm">Check out:</p>
                <p className="w-[200px] sm:w-full text-heading text-sm">
                  {doctor?.checkOut}
                </p>
              </div>{" "}
              <div className="flex items-center gap-5 mt-2">
                <p className="w-[200px] text-[#7D7D7D] text-sm">Duration:</p>
                <p className="w-[200px] sm:w-full text-heading text-sm">
                  {doctor?.duration}
                </p>
              </div>{" "}
              <div className="flex items-center gap-5 mt-2">
                <p className="w-[200px] text-[#7D7D7D] text-sm">
                  Product Discussed:
                </p>
                <p className="w-[200px] sm:w-full text-heading text-sm">
                  {doctor?.productDiscussed}
                </p>
              </div>{" "}
              <div className="flex items-center gap-5 mt-2">
                <p className="w-[200px] text-[#7D7D7D] text-sm">
                  Doctor Response:
                </p>
                <p className="w-[200px] sm:w-full text-heading text-sm">
                  {doctor?.doctorResponse}
                </p>
              </div>{" "}
              <div className="flex items-center gap-5 mt-2">
                <p className="w-[200px] text-[#7D7D7D] text-sm">
                  Promotional Material Given:
                </p>
                <p className="w-[200px] sm:w-full text-heading text-sm">
                  {doctor?.promotionalMaterialGiven}
                </p>
              </div>{" "}
              <div className="flex items-center gap-5 mt-2">
                <p className="w-[200px] text-[#7D7D7D] text-sm">
                  Follow-up Required:
                </p>
                <p className="w-[200px] sm:w-full text-heading text-sm">
                  {doctor?.followUpRequired}
                </p>
              </div>{" "}
              <div className="flex items-center gap-5 mt-2">
                <p className="w-[200px] text-[#7D7D7D] text-sm">
                  Doctor Purchase Intrest:
                </p>
                <p className="w-[200px] sm:w-full text-heading text-sm">
                  {doctor?.doctorPurchaseInterest}
                </p>
              </div>{" "}
              <div className="flex items-center gap-5 mt-2">
                <p className="w-[200px] text-[#7D7D7D] text-sm">
                  Key Discussion Points:
                </p>
                <p className="w-[200px] sm:w-full text-heading text-sm">
                  {doctor?.keyDiscussionPoints}
                </p>
              </div>{" "}
              <div className="flex items-center gap-5 mt-2">
                <p className="w-[200px] text-[#7D7D7D] text-sm">
                  Doctor’s Concerns:
                </p>
                <p className="w-[200px] sm:w-full text-heading text-sm">
                  {doctor?.doctorConcerns}
                </p>
              </div>{" "}
            </div>
          </div>
        </div>
      </div>
      {isLoaction && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="bg-white rounded-xl xl:mx-0 mx-5 w-[1000px] max-h-[90vh] overflow-x-auto xl:p-6 p-4 shadow-xl relative"
          >
            <div className="flex items-center justify-between ">
              <p className="text-[24px] text-heading capitalize font-semibold">
                Check out Location
              </p>
              <IoMdCloseCircle
                size={20}
                onClick={() => setLoaction(false)}
                className="cursor-pointer text-primary"
              />
            </div>

            <div className="mt-5">
              {!isLoaded ? (
                <Spin indicator={antIcon} />
              ) : (
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "400px" }}
                  center={{
                    lat: doctor?.checkInLocation?.lat || 0,
                    lng: doctor?.checkInLocation?.lng || 0,
                  }}
                  zoom={15}
                >
                  <Marker
                    position={{
                      lat: doctor?.checkInLocation?.lat || 0,
                      lng: doctor?.checkInLocation?.lng || 0,
                    }}
                  />
                </GoogleMap>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
