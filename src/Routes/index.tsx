import { useSelector } from "react-redux";
import Pages from "../Pages";
import AuthRoutes from "./AuthRoutes";
import Distributor from "../Pages/Distributor";

function Routes() {
  const userState = useSelector((state: any) => state.user);

  const isLoggedIn = userState?.isLoggedIn;
  const position = userState?.user?.position || userState?.position;

  if (!isLoggedIn) {
    return <AuthRoutes />;
  }

  if (position === "Distributor") {
    return <Distributor />;
  }

  return <Pages />;
}

export default Routes;
