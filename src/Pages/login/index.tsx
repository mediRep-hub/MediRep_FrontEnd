import { useEffect, useState } from "react";
import bgiamge from "../../assets/login bg.png";
import { Checkbox, Spin } from "antd";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { useFormik } from "formik";
import { notifyError, notifySuccess } from "../../Components/Toast";
import Logo from "../../assets/medirep-logo.png";
import LoginImage from "../../assets/loginImage.png";
import { LoginSchema } from "../../utils/validation";
import { adminLogin } from "../../api/adminServices";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { setIsLoggedIn, setToken, setUser } from "../../redux/userSlice";
const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    document.title = "MediRep | Login";
  }, []);
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      await handleLogin(values);
    },
  });
  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await adminLogin(values);
      const data = response.data;

      const position = data.admin?.position;

      if (position === "MedicalRep(MR)" || position === "MR") {
        notifyError("You are not allowed to login.");
        setLoading(false);
        return;
      }
      dispatch(setUser({ user: data.admin, token: data.token }));
      dispatch(setIsLoggedIn(true));
      dispatch(setToken(data.token));
      notifySuccess("Successfully Logged In");
    } catch (error: any) {
      notifyError(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 24, color: "white" }} spin />
  );
  return (
    <div className="w-full h-[100vh] xl:px-[95px] px-5 py-[32px] gap-[60px] flex items-center">
      <div className="xl:w-[calc(50%-30px)] w-full">
        <div className="flex items-center justify-center gap-4">
          <img src={Logo} className="h-auto w-[122px]" alt="logo" />
          <p className="text-primary text-[36px] font-semibold">MediRep</p>
        </div>
        <div className="bg-secondary xl:px-[46px] px-[24px] py-[32px] text-center mt-5 rounded-[1px]">
          <p className="text-heading text-[24px] font-medium">Sign In</p>
          <p className="text-[#7D7D7D] text-[18px] font-medium mt-5">
            Welcome Back! Please enter your details
          </p>
          <form
            onSubmit={formik.handleSubmit}
            className="mt-5 flex flex-col gap-3"
          >
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-sm text-start text-[#7D7D7D] mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                onChange={formik.handleChange}
                value={formik.values.email}
                className="w-full h-[55px] px-4 rounded-[6px] bg-[#29AAE10F] text-gray-900 
                  border-none outline-none focus:ring-0 focus:border-none"
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-sm text-start mt-1">
                  *{formik.errors.email}
                </div>
              ) : null}
            </div>
            <div className="flex flex-col relative">
              <label
                htmlFor="password"
                className="text-sm text-start text-[#7D7D7D] mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                onChange={formik.handleChange}
                value={formik.values.password}
                className="w-full h-[55px] px-4 rounded-[6px] bg-[#29AAE10F] text-gray-900 
                  border-none outline-none focus:ring-0 focus:border-none pr-12"
              />
              <span
                className="absolute right-4 top-10 cursor-pointer text-[#7D7D7D]"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? (
                  <FiEye
                    className="text-primary"
                    style={{ fontSize: "20px" }}
                  />
                ) : (
                  <FiEyeOff style={{ fontSize: "20px" }} />
                )}
              </span>
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-sm text-start mt-1">
                  *{formik.errors.password}
                </div>
              ) : null}
            </div>
            <div className="flex justify-between items-center ">
              <div className="flex items-center gap-3">
                <Checkbox
                  className="[&_.ant-checkbox-inner]:border-primary 
                  [&_.ant-checkbox-checked_.ant-checkbox-inner]:bg-primary"
                />
                <p className="text-heading text-[14px] font-medium">
                  Remember for 30 Days
                </p>
              </div>
              <p className="text-primary text-[12px] font-medium cursor-pointer">
                Forget password
              </p>
            </div>
            <button
              type="submit"
              className="bg-primary text-white w-full h-[55px] mt-5 rounded-md text-xl font-medium flex items-center justify-center"
            >
              {loading ? <Spin indicator={antIcon} /> : "Login"}
            </button>
          </form>
        </div>
      </div>
      <div
        className="w-[calc(50%-30px)] p-9 xl:flex hidden flex-col justify-between h-full rounded-[12px] text-white"
        style={{
          backgroundImage: `url(${bgiamge})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <p className="font-semibold text-[48px] leading-[100%]">
          Welcome Back! Please sign in to your{" "}
          <span className="underline">MediRep</span> account
        </p>
        <img
          src={LoginImage}
          className="w-full xl:h-[305px] 2xl:h-[550px]"
          alt="login"
        />
      </div>
    </div>
  );
};

export default Login;
