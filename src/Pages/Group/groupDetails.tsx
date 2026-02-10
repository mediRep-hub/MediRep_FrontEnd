import { Icon } from "@iconify/react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function GroupDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const row = location.state?.row;

  const handleBack = () => {
    navigate("/group");
  };
  useEffect(() => {
    document.title = "MediRep | Groups Details";
  }, []);
  return (
    <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
      <div className="flex items-center gap-3">
        <div
          onClick={handleBack}
          className="h-10 w-10 cursor-pointer rounded-lg border border-[#D2D2D2] flex justify-center items-center bg-white"
        >
          <Icon
            icon="material-symbols:arrow-back-rounded"
            className="text-xl text-heading"
          />
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
          className="scroll-smooth mt-4 border border-primary flex flex-wrap md:flex-nowrap bg-white rounded-xl 2xl:h-[calc(70vh-0px)] xl:h-[calc(59vh-0px)]  overflow-y-auto scrollbar-none"
        >
          <div className="w-full md:w-[60%]  space-y-3 p-4 md:border-r border-r-0 border-primary">
            <div className="flex items-center gap-4">
              <p className="font-medium min-w-[100px] text-[#131313] text-xs">
                Group ID:
              </p>
              <p className="font-normal text-[#131313] text-xs">
                {row.groupId}
              </p>
            </div>{" "}
            <div className="flex items-center gap-4">
              <p className="font-medium min-w-[100px] text-[#131313] text-xs">
                Group Name:
              </p>
              <p className="font-normal text-[#131313] text-xs">
                {row.groupName}
              </p>
            </div>{" "}
            <div className="flex items-center gap-4">
              <p className="font-medium min-w-[100px] text-[#131313] text-xs">
                Region:
              </p>
              <p className="font-normal text-[#131313] text-xs">{row.region}</p>
            </div>{" "}
            <div className="flex items-center gap-4">
              <p className="font-medium min-w-[100px] text-[#131313] text-xs">
                Area:
              </p>
              <p className="font-normal text-[#131313] text-xs">
                <p>{Array.isArray(row.area) ? row.area.join(", ") : "-"}</p>
              </p>
            </div>{" "}
            <div className="flex items-center gap-4">
              <p className="font-medium min-w-[100px] text-[#131313] text-xs">
                Distributor Name:
              </p>
              <p className="font-normal text-[#131313] text-xs">
                {row.distributor}
              </p>
            </div>{" "}
            <div className="flex items-center gap-4">
              <p className="font-medium min-w-[100px] text-[#131313] text-xs">
                City:
              </p>
              <p className="font-normal text-[#131313] text-xs">{row.city}</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-medium min-w-[100px] text-[#131313] text-xs">
                Group Manager:
              </p>
              <p className="font-normal text-[#131313] text-xs">
                {row.manager}
              </p>
            </div>{" "}
            <div className="flex items-center gap-4">
              <p className="font-medium min-w-[100px] text-[#131313] text-xs">
                Group Lead:
              </p>
              <p className="font-normal text-[#131313] text-xs">
                {row.teamLead}
              </p>
            </div>{" "}
            <div className="flex items-start gap-4">
              <p className="font-medium min-w-[100px] text-[#131313] text-xs">
                Mr Names:
              </p>
              <div>
                <ul className="text-xs grid lg:grid-cols-2 grid-cols-1 gap-x-5 list-disc list-inside">
                  {Array.isArray(row?.mr) &&
                    row.mr.map((mr: string, index: number) => (
                      <li key={index}>{mr}</li>
                    ))}
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <p className="font-medium min-w-[100px] text-[#131313] text-xs">
                Doctor Names:
              </p>
              <div>
                <ul className="text-xs grid  lg:grid-cols-2 grid-cols-1 gap-x-5 list-disc list-inside">
                  {Array.isArray(row?.mr) &&
                    row.doctorList.map((mr: string, index: number) => (
                      <li key={index}>{mr}</li>
                    ))}
                </ul>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-medium min-w-[100px] text-[#131313] text-xs">
                Status:
              </p>
              <div className="text-primary border-primary border-[1px] px-2 py-0.5 rounded-sm">
                <p className="font-normal text-primary text-xs">
                  {row.groupType}
                </p>
              </div>
            </div>{" "}
            {/* <div className="flex items-center gap-4">
              <p className="font-medium w-[100px] text-[#131313] text-xs">
                Details
              </p>
              <p className="font-normal text-[#7d7d7d] text-xs">
                Figma ipsum component variant main layer. Scrolling selection
                hand plugin font rectangle.
              </p>
            </div> */}
          </div>
          <div className="w-full md:w-[40%]  ">
            {row.products.map((p: any, index: number) => (
              <div
                key={index}
                className="border-t md:border-t-0 border-b-0 md:border-b border-primary"
              >
                <div className="py-4 md:px-10 px-4 space-y-1.5">
                  <div className="flex items-center gap-4">
                    <p className="font-medium w-[100px] text-[#131313] text-xs">
                      Product:
                    </p>
                    <p className="font-normal text-[#131313] text-xs">
                      {p.name}
                    </p>
                  </div>{" "}
                  {/* <div className="flex items-center gap-4">
                    <p className="font-medium w-[100px] text-[#131313] text-xs">
                      Starting Date
                    </p>
                    <p className="font-normal text-[#131313] text-xs">
                      06-Oct-2025
                    </p>
                  </div>{" "} */}
                  <div className="flex items-center gap-4">
                    <p className="font-medium w-[100px] text-[#131313] text-xs">
                      Target:
                    </p>
                    <p className="font-normal text-[#131313] text-xs">
                      {" "}
                      {p.target}
                    </p>
                  </div>{" "}
                  <div className="flex items-center gap-4">
                    <p className="font-medium w-[100px] text-[#131313] text-xs">
                      Bonus:
                    </p>
                    <p className="font-normal text-[#131313] text-xs">
                      {p.bonus || 0}
                    </p>
                  </div>{" "}
                  <div className="flex items-center gap-4">
                    <p className="font-medium w-[100px] text-[#131313] text-xs">
                      Duration
                    </p>
                    <p className="font-normal text-[#131313] text-xs">
                      {row.activePeriod}
                    </p>
                  </div>{" "}
                  <div className="flex items-center gap-4">
                    <p className="font-medium w-[100px] text-[#131313] text-xs">
                      Amount:
                    </p>
                    <p className="font-normal text-[#131313] text-xs">
                      <span className="text-[10px]">Rs:</span>
                      {p.amount}
                    </p>
                  </div>{" "}
                  {/* <div className="flex items-center gap-4">
                    <p className="font-medium w-[100px] text-[#131313] text-xs">
                      Payment Type
                    </p>
                    <p className="font-regular text-[#131313] text-xs">Cash</p>
                  </div>{" "} */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
