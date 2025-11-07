import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo/logo.png";
import {
  FaBriefcaseMedical,
  FaUserMd,
  FaChartLine,
  FaUserFriends,
  FaTimes,
  FaBars,
  FaClipboardList,
  FaBoxOpen,
} from "react-icons/fa";
import { BiLogOut, BiSolidReport } from "react-icons/bi";
import { notifyError, notifySuccess } from "../Toast";
import { MdManageAccounts } from "react-icons/md";
import { GiAchievement } from "react-icons/gi";
import { useSelector } from "react-redux";
import { setIsLoggedIn } from "../../redux/userSlice";
import { store } from "../../redux/store";
import { HTTP_CLIENT } from "../../utils/httpClient";

export default function SideBar() {
  const { user } = useSelector((state: any) => state.user);
  let links = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaBriefcaseMedical size={16} />,
    },
    {
      name: "Doctor Profile Management",
      path: "/doctorProfileManagement",
      icon: <FaUserMd size={16} />,
    },
    {
      name: "Targets/Achievement",
      path: "/targets-achievement",
      icon: <GiAchievement size={16} />,
    },
    {
      name: "Products",
      path: "/products",
      icon: <FaBoxOpen size={16} />,
    },
    {
      name: "Requisitions",
      path: "/requisition",
      icon: <FaClipboardList size={16} />,
    },
    {
      name: "Strategy & Planning",
      path: "/strategyPlanning",
      icon: <FaChartLine size={16} />,
    },
    {
      name: "Call Reporting",
      path: "/callReporting",
      icon: <FaUserFriends size={16} />,
    },
    {
      name: "Data Reporting",
      path: "/dataReporting",
      icon: <BiSolidReport size={16} />,
    },
  ];
  if (user?.position === "Admin") {
    links.splice(2, 0, {
      name: "Manage Accounts",
      path: "/manageAccount",
      icon: <MdManageAccounts size={16} />,
    });
  }

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const onClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    const { token } = store.getState().user;

    HTTP_CLIENT.post(
      "/admin/logout",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(() => {
        store.dispatch(setIsLoggedIn(false));
        notifySuccess("Successfully logged out");
        navigate("/");
      })
      .catch((err: any) => {
        console.error(
          "🚀 ~ handleLogout ~ err:",
          err.response?.data?.message || err.message
        );
        notifyError(err.response?.data?.message || "Logout failed");
      });
  };

  return (
    <>
      {isOpen ? (
        <button
          style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
          className="xl:hidden fixed top-8 rounded-full bg-white p-3 right-8 z-50 text-2xl text-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaTimes />
        </button>
      ) : (
        <button
          className="xl:hidden absolute top-8 rounded-full bg-white p-3 right-8 z-50 text-2xl text-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaBars />
        </button>
      )}
      <aside
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className={`fixed xl:relative top-0 left-0 h-full overflow-y-auto xl:h-[calc(100vh-32px)] bg-[#F7F7F7] xl:w-[320px] lg:w-[260px] md:w-[260px] sm:w-[200px] w-[320px] p-2 flex flex-col xl:rounded-[12px] rounded-tr-[12px] rounded-br-[12px] transition-transform z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"} xl:translate-x-0`}
      >
        <div className="flex items-center gap-2">
          <img src={Logo} className="h-[46px] w-auto" />

          <p className="text-primary font-medium text-[18px]">MediRep</p>
        </div>

        <p className="text-[#979797] text-sm font-normal mt-[30px]">MENU</p>

        <nav className="flex flex-col gap-0 mt-4">
          {links.map((i, index) => {
            const isActive = location.pathname.startsWith(i.path);

            return (
              <p
                key={index}
                onClick={() => onClick(i.path)}
                className={`cursor-pointer text-heading py-2 h-12 text-sm flex items-center gap-2 rounded-xl transition relative ${
                  isActive ? "font-medium" : "font-normal"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 h-12 w-[8px] bg-primary rounded-r-[8px]"></span>
                )}
                <span
                  className={`pl-5 ${
                    isActive ? "text-primary" : "text-[#7d7d7d]"
                  }`}
                >
                  {i.icon}
                </span>
                <span className="text-sm">{i.name}</span>
              </p>
            );
          })}
        </nav>

        <div
          onClick={handleLogout}
          className="pl-5 flex gap-3 items-center cursor-pointer mb-2 text-heading text-base font-normal mt-auto"
        >
          <BiLogOut />
          <p>Logout</p>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-30 xl:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
