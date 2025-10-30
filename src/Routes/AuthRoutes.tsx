import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Logo from "../assets/Logo/logo.png";
const Login = lazy(() => import("../Pages/login"));

export default function AuthRoutes() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <img src={Logo} alt="Logo" className="w-auto h-[110px]" />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </Suspense>
  );
}
