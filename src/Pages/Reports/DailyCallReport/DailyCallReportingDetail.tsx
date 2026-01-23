import { FaArrowLeft } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { Avatar } from "antd";
import { GoogleMap, Marker } from "@react-google-maps/api";
import dayjs from "dayjs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const dummyDoctor = {
  mrImage:
    "data:image/jpeg;base64,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",

  doctorAvailability: "Yes",
  name: "Omar Rosser",
  code: "Re833434",
  department: "Cardiology",
  address: "154-D Architecture Society, Lahore",
  brickName: "Canal Road",
  date: new Date(),
  checkIn: "11:30 AM",
  checkOut: "12:15 PM",
  duration: "45 mins",
  productDiscussed: "Synflex, Medcore",
  doctorResponse: "Positive",
  promotionalMaterialGiven: "Brochure, Samples",
  followUpRequired: "Yes",
  doctorPurchaseInterest: "High",
  keyDiscussionPoints: "Pricing, Availability, Benefits",
  doctorConcerns: "Stock consistency",
  checkInLocation: {
    lat: 31.5204,
    lng: 74.3587,
  },
};

export default function CallDetails() {
  const [isLoaction, setLoaction] = useState(false);

  const navigate = useNavigate();
  const handleGOBack = () => {
    navigate("/dailyCallReport");
  };
  return (
    <div>
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div
            onClick={handleGOBack}
            className="h-11 w-11 cursor-pointer rounded-lg border-[#D2D2D2] border-[1px] flex justify-center items-center"
          >
            <FaArrowLeft size={16} color="#000000" />
          </div>

          <p className="text-heading font-medium text-[22px] sm:text-[24px]">
            Daily Call Details
          </p>
        </div>

        <div className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(76.8vh-0px)] lg:h-[calc(66vh-0px)] h-auto">
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="scroll-smooth mt-5 p-6 md:gap-0 gap-5 bg-white border border-primary rounded-lg 2xl:h-[calc(71.5vh-0px)] xl:h-[calc(58vh-0px)] overflow-y-auto scrollbar-none"
          >
            <div className="flex justify-between flex-wrap gap-5">
              <div className="flex gap-3 items-center">
                <Avatar size={45} src={dummyDoctor.mrImage} />
                <div>
                  <p className="text-heading font-medium text-sm">
                    {dummyDoctor.name}
                  </p>
                  <p className="text-primary text-[12px] font-medium">
                    {dummyDoctor.code}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setLoaction(true)}
                className="bg-primary text-white rounded-lg h-[50px] md:w-[180px] w-full cursor-pointer"
              >
                Check in location
              </button>
            </div>

            <div className="mt-7">
              {[
                { label: "Call ID:", value: "Call-2323123" },

                {
                  label: "Doctor Availability:",
                  value: dummyDoctor.doctorAvailability,
                },
                { label: "Doctor Name:", value: dummyDoctor.name },
                { label: "Doctor Address:", value: dummyDoctor.address },
                { label: "Brick Name:", value: dummyDoctor.brickName },
                {
                  label: "Date:",
                  value: dayjs(dummyDoctor.date).format("DD/MM/YYYY"),
                },
                { label: "Check in:", value: dummyDoctor.checkIn },
                { label: "Check out:", value: dummyDoctor.checkOut },
                { label: "Duration:", value: dummyDoctor.duration },
                {
                  label: "Product Discussed:",
                  value: dummyDoctor.productDiscussed,
                },
                {
                  label: "Doctor Response:",
                  value: dummyDoctor.doctorResponse,
                },
                {
                  label: "Promotional Material Given:",
                  value: dummyDoctor.promotionalMaterialGiven,
                },
                {
                  label: "Follow-up Required:",
                  value: dummyDoctor.followUpRequired,
                },
                {
                  label: "Doctor Purchase Interest:",
                  value: dummyDoctor.doctorPurchaseInterest,
                },
                {
                  label: "Key Discussion Points:",
                  value: dummyDoctor.keyDiscussionPoints,
                },
                {
                  label: "Doctor’s Concerns:",
                  value: dummyDoctor.doctorConcerns,
                },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-5 mt-2">
                  <p className="w-[200px] text-[#7D7D7D] text-sm">
                    {item.label}
                  </p>
                  <p className="w-[200px] sm:w-full text-heading text-sm">
                    {item.value}
                  </p>
                </div>
              ))}
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
            <div className="flex items-center justify-between">
              <p className="text-[24px] text-heading capitalize font-semibold">
                Check In Location
              </p>
              <IoMdCloseCircle
                size={20}
                onClick={() => setLoaction(false)}
                className="cursor-pointer text-primary"
              />
            </div>

            <div className="mt-5">
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "400px" }}
                center={{
                  lat: dummyDoctor.checkInLocation.lat,
                  lng: dummyDoctor.checkInLocation.lng,
                }}
                zoom={15}
              >
                <Marker
                  position={{
                    lat: dummyDoctor.checkInLocation.lat,
                    lng: dummyDoctor.checkInLocation.lng,
                  }}
                />
              </GoogleMap>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
