import SearchBar from "../../Components/SearchBar";
import SideBar from "../../Components/SideBar";
import DistributorRoutes from "../../Routes/distributorRoutes";
import { DistributorLinks } from "../../utils/validation";

export default function Distributor() {
  return (
    <div className="flex min-h-screen gap-4 p-4 w-full">
      <SideBar link={DistributorLinks} />
      <div className="w-full">
        <SearchBar />
        <div className="mt-4">
          <DistributorRoutes />
        </div>
      </div>
    </div>
  );
}
