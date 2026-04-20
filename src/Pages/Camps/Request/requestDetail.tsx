import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";

export default function RequestDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  const camp = location.state;
  console.log("🚀 ~ camp:", camp);
  const handleBack = () => {
    navigate("/camps/request");
  };
  return (
    <div className="bg-secondary lg:h-[calc(100vh-129px)] h-auto rounded-[12px] py-4 px-4">
      <div className="flex flex-wrap gap-5 justify-between items-start">
        <div className="flex flex-wrap items-center gap-3 ">
          <div
            onClick={handleBack}
            className="h-10  min-w-10 cursor-pointer rounded-lg border border-[#D2D2D2] flex justify-center items-center bg-white"
          >
            <Icon
              icon="material-symbols:arrow-back-rounded"
              className="text-xl text-heading"
            />
          </div>
          <p className="text-heading font-medium text-[22px] sm:text-[24px]">
            Camp Request Details
          </p>
        </div>
      </div>
      <div className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4">
        <div className="bg-white text-sm rounded-xl overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 justify-between">
          <p className="text-[#7d7d7d] text-sm">
            <b className="text-[#131313] font-medium mr-2">Brick Code:</b>{" "}
            {camp?.brickCode}
          </p>
          <p className="text-[#7d7d7d] text-sm">
            <b className="text-[#131313] font-medium mr-2">Camp Start Date:</b>{" "}
            {camp?.campStartDate
              ? dayjs(camp.campStartDate).format("DD MMM YYYY")
              : "-"}
          </p>
          <p className="text-[#7d7d7d] text-sm ">
            <b className="text-[#131313] font-medium mr-2">Camp End Date:</b>{" "}
            {camp?.campEndDate
              ? dayjs(camp.campEndDate).format("DD MMM YYYY")
              : "-"}
          </p>{" "}
          <p className="text-[#7d7d7d] text-sm ">
            <span className="text-[#131313] font-medium mr-2">Camp Time:</span>{" "}
            {camp?.campTime}
          </p>{" "}
          <p className="text-[#7d7d7d] text-sm">
            <b className="text-[#131313] font-medium mr-2">Camp Type:</b>{" "}
            {camp?.campType}
          </p>
          <p className="text-[#7d7d7d] text-sm">
            <b className="text-[#131313] font-medium mr-2">Mr Type :</b>{" "}
            {camp?.mrType}
          </p>{" "}
          <p className="text-[#7d7d7d] text-sm">
            <b className="text-[#131313] font-medium mr-2">Sample Type :</b>{" "}
            {camp?.sampleType}
          </p>{" "}
          <p className="text-[#7d7d7d] text-sm capitalize">
            <b className="text-[#131313] font-medium mr-2">Status:</b>{" "}
            {camp?.status}
          </p>{" "}
        </div>
        <div className="mt-4">
          <p>
            <b>Chemists:</b>{" "}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
            {camp?.chemists?.length ? (
              camp.chemists.map((c: any, i: number) => (
                <div key={i} className="bg-white rounded-[12px] p-3 shadow-sm">
                  <div className="text-[#7d7d7d] flex text-sm">
                    <p className="text-[#131313] font-medium w-[90px]">Name:</p>{" "}
                    <p>{c.name}</p>
                  </div>

                  <div className="text-[#7d7d7d] flex text-sm">
                    <p className="text-[#131313] font-medium w-[90px]">
                      Phone No:
                    </p>{" "}
                    <p>{c.phone}</p>
                  </div>
                  <div className="text-[#7d7d7d] flex text-sm">
                    <p className="text-[#131313] font-medium min-w-[90px]">
                      Address:
                    </p>{" "}
                    <p> {c?.location?.address}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-3">-</p>
            )}
          </div>{" "}
          <p className="mt-4">
            <b>Doctors:</b>{" "}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
            {camp?.doctors?.length ? (
              camp.doctors.map((c: any, i: number) => (
                <div key={i} className="bg-white rounded-[12px] p-3 shadow-lg">
                  <div className="text-[#7d7d7d] flex text-sm">
                    <p className="text-[#131313] font-medium w-[90px]">Name:</p>{" "}
                    <p>{c.name}</p>
                  </div>

                  <div className="text-[#7d7d7d] flex text-sm">
                    <p className="text-[#131313] font-medium w-[90px]">
                      Phone No:
                    </p>{" "}
                    <p>{c.phone}</p>
                  </div>
                  <div className="text-[#7d7d7d] flex text-sm">
                    <p className="text-[#131313] font-medium min-w-[90px]">
                      PMDC
                    </p>{" "}
                    <p> {c?.PMDC}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-3">-</p>
            )}
          </div>
          <p className="mt-4 ">
            <b>Products:</b>{" "}
          </p>
          <div className=" bg-white p-4 rounded-[12px]">
            <div className="text-sm space-y-2">
              {camp?.products?.length ? (
                camp.products.map((p: any, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[#131313] font-medium">
                      {p?.productId?.productName || "Unknown"}
                    </span>

                    <span className="text-[#7d7d7d]">
                      ({p?.productId?.strength || "-"})
                    </span>

                    <span className="text-[#131313]">
                      Qunatity{" "}
                      <span className="text-[#7d7d7d]">
                        ({p?.quantity || 0})
                      </span>
                    </span>
                  </div>
                ))
              ) : (
                <span>-</span>
              )}
            </div>
          </div>{" "}
          <p className="mt-4">
            {" "}
            <b>Patients:</b>
          </p>
          <div className="">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 ">
              {camp?.patients?.length
                ? camp.patients.map((p: any, i: number) => (
                    <div className="bg-white text-sm rounded-[12px] p-3 shadow-sm space-y-1">
                      <div className="text-[#7d7d7d] flex ">
                        <p className="text-[#131313] font-medium w-[90px]">
                          Name:
                        </p>{" "}
                        <p>{p.name}</p>
                      </div>
                      <div className="text-[#7d7d7d] flex ">
                        <p className="text-[#131313] font-medium w-[90px]">
                          Patient ID:
                        </p>{" "}
                        <p>{p.patientId}</p>
                      </div>
                      <div className="text-[#7d7d7d] flex ">
                        <p className="text-[#131313] font-medium w-[90px]">
                          Gender:
                        </p>{" "}
                        <p className="capitalize">{p.gender}</p>
                      </div>

                      <div className="text-[#7d7d7d] flex ">
                        <p className="text-[#131313] font-medium w-[90px]">
                          Age:
                        </p>{" "}
                        <p>{p.age}</p>
                      </div>

                      <div className="text-[#7d7d7d] flex ">
                        <p className="text-[#131313] font-medium w-[90px]">
                          Weight:
                        </p>{" "}
                        <p>{p.weight}</p>
                      </div>
                      <div className="text-[#7d7d7d] flex ">
                        <p className="text-[#131313] font-medium w-[90px]">
                          Sample Date:
                        </p>{" "}
                        <p>
                          {" "}
                          {p.sampleDate
                            ? new Date(p.sampleDate).toLocaleDateString()
                            : "-"}
                        </p>
                      </div>
                    </div>
                  ))
                : "-"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
