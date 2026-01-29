import SideBar from "../Components/SideBar";
import SearchBar from "../Components/SearchBar";
import MainRoutes from "../Routes/MainRoutes";
import { defaultLinks } from "../utils/validation";

export default function Pages() {
  return (
    <div className="flex min-h-screen gap-4 p-4 w-full">
      <SideBar link={defaultLinks} />
      <div className="flex-1 flex flex-col overflow-x-hidden">
        <SearchBar />
        <div className="mt-4 flex-1 overflow-x-auto">
          <MainRoutes />
        </div>
      </div>
    </div>
  );
}
