import { useEffect } from "react";
import SearchBar from "../../../Components/SearchBar";

export default function MrRoutes() {
  useEffect(() => {
    document.title = "MediRep | MrRoutes";
  }, []);
  return (
    <div>
      <div>
        <>
          <div className="sticky top-0">
            <SearchBar />
          </div>
          <div className="mt-4">
            <div
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              className="bg-secondary md:h-[calc(100vh-129px)] overflow-y-auto h-auto rounded-xl p-4 flex flex-col gap-2"
            >
              {" "}
              <p className="text-heading font-medium text-[22px] sm:text-[24px]">
                Mr & Routes
              </p>
              <div className="bg-[#E5EBF7] rounded-[12px] p-4 2xl:h-[calc(89vh-90px)] lg:h-[calc(94vh-162px)] h-auto "></div>
            </div>
          </div>
        </>
      </div>
    </div>
  );
}
