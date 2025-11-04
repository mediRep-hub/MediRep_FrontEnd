import SideBar from "../Components/SideBar";
import SearchBar from "../Components/SearchBar";
import MainRoutes from "../Routes/MainRoutes";

export default function Pages() {
  return (
    <div className="flex min-h-screen gap-4 p-4 w-full">
      <SideBar />
      <div className="w-full">
        <SearchBar />
        <div className="mt-4">
          <MainRoutes />
        </div>
      </div>
    </div>
  );
}
