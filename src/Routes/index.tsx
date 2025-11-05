import { useSelector } from "react-redux";
import Pages from "../Pages";
import AuthRoutes from "./AuthRoutes";

function Routes() {
  const { isLoggedIn } = useSelector((state: any) => state?.user);
  return <>{isLoggedIn ? <Pages /> : <AuthRoutes />}</>;
}

export default Routes;
