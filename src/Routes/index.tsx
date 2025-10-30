import Pages from "../Pages";
import { getItem } from "../utils/localStorageHelper";
import AuthRoutes from "./AuthRoutes";

function Routes() {
  const isLoggedIn = getItem<string>("isLoggedIn");
  return (
    <>
      {isLoggedIn ? (
        <div>
          <Pages />
        </div>
      ) : (
        <AuthRoutes />
      )}
    </>
  );
}

export default Routes;
