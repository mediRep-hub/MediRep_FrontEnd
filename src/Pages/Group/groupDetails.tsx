import { FaArrowLeft } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

export default function GroupDetails() {
  const location = useLocation();
  const Row = location.state?.row;
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/group");
  };
  console.log("🚀 ~ GroupDetails ~ Row:", Row);
  return (
    <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
      <div className="flex items-center gap-3">
        <div
          onClick={handleBack}
          className="w-[44px] h-[44px] border-[1px] rounded-xl flex items-center justify-center cursor-pointer"
        >
          {" "}
          <FaArrowLeft size={16} color="#000000" />
        </div>
        <p className="text-heading w-full lg:w-auto font-medium text-[22px] sm:text-[24px]">
          Group Details
        </p>
      </div>
      <div className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(77vh-0px)] xl:h-[calc(64vh-0px)] h-auto ">
        <p className="text-[#7D7D7D] font-medium text-sm">Team</p>{" "}
        <div
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="scroll-smooth mt-4 border border-primary flex bg-white rounded-xl 2xl:h-[calc(70vh-0px)] xl:h-[calc(59vh-0px)]  overflow-y-auto scrollbar-none"
        >
          <div className="w-[60%] space-y-3 p-4 border-r border-primary">
            <div className="flex items-center gap-4">
              <p className="font-medium w-[100px] text-[#131313] text-xs">
                Group ID
              </p>
              <p className="font-normal text-[#131313] text-xs">#00112</p>
            </div>{" "}
            <div className="flex items-center gap-4">
              <p className="font-medium w-[100px] text-[#131313] text-xs">
                Group Name
              </p>
              <p className="font-normal text-[#131313] text-xs">Cardio Alpha</p>
            </div>{" "}
            <div className="flex items-center gap-4">
              <p className="font-medium w-[100px] text-[#131313] text-xs">
                Region
              </p>
              <p className="font-normal text-[#131313] text-xs">North Punjab</p>
            </div>{" "}
            <div className="flex items-center gap-4">
              <p className="font-medium w-[100px] text-[#131313] text-xs">
                Area
              </p>
              <p className="font-normal text-[#131313] text-xs">Lahore</p>
            </div>{" "}
            <div className="flex items-center gap-4">
              <p className="font-medium w-[100px] text-[#131313] text-xs">
                Group Manager
              </p>
              <p className="font-normal text-[#131313] text-xs">
                Wajahata Ali(NSM)
              </p>
            </div>{" "}
            <div className="flex items-center gap-4">
              <p className="font-medium w-[100px] text-[#131313] text-xs">
                Group Lead
              </p>
              <p className="font-normal text-[#131313] text-xs">
                Umair Yacoob(ASM)
              </p>
            </div>{" "}
            <div className="flex items-start gap-4">
              <p className="font-medium w-[100px] text-[#131313] text-xs">
                Mr Names
              </p>
              <div>
                <ul className="text-xs grid grid-cols-2 gap-x-5 list-disc list-inside">
                  <li>MR-007 Umer Ali</li>
                  <li>MR-107 Umer Ali</li>
                  <li>MR-208 Umer Ali</li>
                  <li>MR-309 Umer Ali</li>
                  <li>MR-410 Umer Ali</li>
                  <li>MR-511 Umer Ali</li>
                  <li>MR-232 Umer ALi</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <p className="font-medium w-[100px] text-[#131313] text-xs">
                Doctor Names
              </p>
              <div>
                <ul className="text-xs grid grid-cols-2 gap-x-5 list-disc list-inside">
                  <li>DOC-007 Umer Ali</li>
                  <li>DOC-107 Umer Ali</li>
                  <li>DOC-208 Umer Ali</li>
                  <li>DOC-309 Umer Ali</li>
                  <li>DOC-410 Umer Ali</li>
                  <li>DOC-511 Umer Ali</li>
                  <li>DOC-232 Umer ALi</li>
                </ul>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-medium w-[100px] text-[#131313] text-xs">
                Status
              </p>
              <div className="text-primary border-primary border-[1px] px-2 py-0.5 rounded-sm">
                <p className="font-normal text-primary text-xs">Active</p>
              </div>
            </div>{" "}
            <div className="flex items-center gap-4">
              <p className="font-medium w-[100px] text-[#131313] text-xs">
                Details
              </p>
              <p className="font-normal text-[#7d7d7d] text-xs">
                Figma ipsum component variant main layer. Scrolling selection
                hand plugin font rectangle.
              </p>
            </div>
          </div>
          <div className="w-[40%] px-10 py-4">
            <div className="flex items-center gap-4">
              <p className="font-medium w-[100px] text-[#131313] text-xs">
                Product
              </p>
              <p className="font-normal text-[#131313] text-xs">
                Naunehal Baby Soap - 100 gm
              </p>
            </div>{" "}
            <div className="flex items-center gap-4">
              <p className="font-medium w-[100px] text-[#131313] text-xs">
                Starting Date
              </p>
              <p className="font-normal text-[#131313] text-xs">06-Oct-2025</p>
            </div>{" "}
            <div className="flex items-center gap-4">
              <p className="font-medium w-[100px] text-[#131313] text-xs">
                Quantity
              </p>
              <p className="font-normal text-[#131313] text-xs">10,000</p>
            </div>{" "}
            <div className="flex items-center gap-4">
              <p className="font-medium w-[100px] text-[#131313] text-xs">
                Duration
              </p>
              <p className="font-normal text-[#131313] text-xs">3-months</p>
            </div>{" "}
            <div className="flex items-center gap-4">
              <p className="font-medium w-[100px] text-[#131313] text-xs">
                Amount
              </p>
              <p className="font-normal text-[#131313] text-xs">
                <span className="text-[10px]">Rs:</span>75,000
              </p>
            </div>{" "}
            <div className="flex items-center gap-4">
              <p className="font-medium w-[100px] text-[#131313] text-xs">
                Payment Type
              </p>
              <p className="font-regular text-[#131313] text-xs">Cash</p>
            </div>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
