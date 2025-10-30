import { Avatar } from "antd";
import dummyImg from "../../assets/dummay.jpg";
import { FaCalendar, FaDirections } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
});
export default function CallReportingDetail() {
  const location = useLocation();
  const { v } = location.state || {};
  const lat = v?.checkInLocation?.lat;
  const lng = v?.checkInLocation?.lng;
  const [openmap, setOpenMap] = useState(false);
  return (
    <div>
      {" "}
      <div className="bg-secondary lg:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <p className="text-heading font-medium text-[22px] sm:text-[24px]">
            Call Reporting Details
          </p>
        </div>
        <div className="bg-[#E5EBF7]  mt-4 rounded-[12px] p-4 2xl:h-[calc(90vh-117px)] lg:h-[calc(90vh-149px)] h-auto ">
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="scroll-smooth p-4 bg-white border border-primary rounded-lg 2xl:h-[calc(85vh-157px)] xl:h-[calc(65vh-79px)] mt-4 overflow-y-auto scrollbar-none"
          >
            <div className="flex justify-between flex-wrap gap-4 items-center">
              <div className="flex items-center gap-3 md:w-auto w-full">
                <Avatar src={dummyImg} className="w-10 h-10" />
                <div>
                  <p className="leading-1 text-heading font-medium text-sm">
                    {v?.mrName}
                  </p>
                  <p className="leading-1 text-primary font-medium text-xs">
                    MR-007
                  </p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <FaCalendar className="text-primary" />
                <p className="text-primary text-sm">
                  Next Visit {dayjs(v?.nextVisitDate).format("DD MMM YYYY")}
                </p>
              </div>
              <button
                onClick={() => {
                  setOpenMap(true);
                }}
                className="h-[55px] w-full lg:w-[180px] bg-primary text-white rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
              >
                <FaDirections /> CheckIn Location
              </button>
            </div>
            <div className="flex  mt-5">
              <p className="text-xs font-normal text-[#7d7d7d] min-w-[120px]">
                Call ID:
              </p>
              <p className="text-xs font-normal text-heading">{v?.callId}</p>
            </div>{" "}
            <div className="flex  mt-2">
              <p className="text-xs font-normal text-[#7d7d7d] min-w-[120px]">
                Doctor Name:
              </p>
              <p className="text-xs font-normal text-heading">
                {v?.doctorName}
              </p>
            </div>{" "}
            <div className="flex  mt-2">
              <p className="text-xs font-normal text-[#7d7d7d] min-w-[120px]">
                Doctor Address:
              </p>
              <p className="text-xs font-normal text-heading">
                {v?.doctorAddress}
              </p>
            </div>{" "}
            <div className="flex  mt-2">
              <p className="text-xs font-normal text-[#7d7d7d] min-w-[120px]">
                Area:
              </p>
              <p className="text-xs font-normal text-heading">{v?.area}</p>
            </div>{" "}
            <div className="flex  mt-2">
              <p className="text-xs font-normal text-[#7d7d7d] min-w-[120px]">
                Date:
              </p>
              <p className="text-xs font-normal text-heading">
                {dayjs(v?.date).format("DD MMM YYYY")}
              </p>
            </div>{" "}
            <div className="flex  mt-2">
              <p className="text-xs font-normal text-[#7d7d7d] min-w-[120px]">
                Check in:
              </p>
              <p className="text-xs font-normal text-heading">{v?.checkIn}</p>
            </div>{" "}
            <div className="flex  mt-2">
              <p className="text-xs font-normal text-[#7d7d7d] min-w-[120px]">
                Check out:
              </p>
              <p className="text-xs font-normal text-heading">{v?.checkOut}</p>
            </div>{" "}
            <div className="flex  mt-2">
              <p className="text-xs font-normal text-[#7d7d7d] min-w-[120px]">
                Duration:
              </p>
              <p className="text-xs font-normal text-heading">{v?.duration}</p>
            </div>{" "}
            <div className="flex  mt-2">
              <p className="text-xs font-normal text-[#7d7d7d] min-w-[120px]">
                Product Discussed:
              </p>
              <p className="text-xs font-normal text-heading">
                {v?.productDiscussed}
              </p>
            </div>{" "}
            <div className="flex  mt-2">
              <p className="text-xs font-normal text-[#7d7d7d] min-w-[120px]">
                Type:
              </p>
              <p className="text-xs font-normal text-heading">{v?.type}</p>
            </div>{" "}
            <div className="flex  mt-2">
              <p className="text-xs font-normal text-[#7d7d7d] min-w-[120px]">
                Notes:
              </p>
              <p className="text-xs font-normal w-[300px] text-heading">
                {v?.notes}
              </p>
            </div>{" "}
          </div>
        </div>
      </div>
      {openmap && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl xl:mx-0 mx-5 w-[700px] xl:h-auto h-[90vh] overflow-x-auto xl:p-6 p-4 shadow-xl relative">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-semibold">Check-In Location</h2>{" "}
                <IoMdCloseCircle
                  size={20}
                  onClick={() => setOpenMap(false)}
                  className="cursor-pointer text-primary"
                />
              </div>

              {lat && lng ? (
                <div className="w-full h-[400px] rounded-lg overflow-hidden">
                  <MapContainer
                    center={[lat, lng]}
                    zoom={13}
                    className="w-full h-full"
                  >
                    <TileLayer
                      attribution="&copy; OpenStreetMap contributors"
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[lat, lng]} icon={markerIcon}>
                      <Popup>Doctor Check-In Location</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No location data available for this check-in.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
