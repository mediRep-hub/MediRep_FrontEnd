import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTimes, FaBars } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { notifyError, notifySuccess } from "../Toast";
import { useSelector } from "react-redux";
import { setIsLoggedIn } from "../../redux/userSlice";
import { store } from "../../redux/store";
import { HTTP_CLIENT } from "../../utils/httpClient";
import { Icon } from "@iconify/react";
import { logo_medi } from "../../utils/validation";
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";

export default function SideBar({ link }: any) {
  const { user } = useSelector((state: any) => state.user);
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const onClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };
  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const sidebarLinks = useMemo(() => {
    let links = [...link];

    if (user?.position === "Admin") {
      links.splice(2, 0, {
        name: "Manage Accounts",
        path: "/manageAccounts",
        icon: "mdi:account-cog",
      });
    }

    return links;
  }, [user?.position]);

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
          className="xl:hidden fixed top-7 rounded-full bg-white p-3 right-8 z-50 text-2xl text-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaTimes />
        </button>
      ) : (
        <button
          className="xl:hidden absolute top-7 rounded-full bg-white p-3 right-8 z-50 text-2xl text-primary"
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
          <div dangerouslySetInnerHTML={{ __html: logo_medi }} />
          <p className="text-primary font-medium text-[24px]">
            Medi<span className="text-[#FF7631]">Rep</span>
          </p>
        </div>

        <p className="text-[#979797] text-sm font-normal mt-[30px]">MENU</p>

        <nav className="flex flex-col gap-0 mt-4">
          {sidebarLinks.map((item: any, index: number) => {
            const hasChildren = item.children && item.children.length > 0;
            const isDropdownOpen = openDropdown === item.name;
            const isActive =
              (!item.children &&
                item.path &&
                location.pathname === item.path) ||
              (hasChildren &&
                isDropdownOpen &&
                item.children.some(
                  (child: any) => child.path === location.pathname
                ));
            return (
              <div key={index} className="w-full relative">
                <p
                  onClick={() =>
                    hasChildren ? toggleDropdown(item.name) : onClick(item.path)
                  }
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
                    <Icon icon={item.icon} width="20" height="20" />
                  </span>
                  <span className="text-sm">{item.name}</span>
                  {hasChildren && (
                    <span className="ml-auto pr-4 ">
                      {isDropdownOpen ? (
                        <IoChevronUpOutline size={16} />
                      ) : (
                        <IoChevronDownOutline size={16} />
                      )}
                    </span>
                  )}
                </p>
                {hasChildren && isDropdownOpen && (
                  <div>
                    <div className="pl-5 pr-4 py-2 flex flex-col gap-1 mt-2 bg-[#E5EBF7] rounded-[12px]">
                      {item.children.map((child: any, idx: number) => {
                        const isChildActive =
                          isDropdownOpen && location.pathname === child.path;

                        return (
                          <div className="flex gap-2 items-center">
                            <span
                              className={`${
                                isChildActive
                                  ? "text-primary"
                                  : "text-[#7d7d7d]"
                              }`}
                            >
                              <Icon icon={child.icon} width="20" height="20" />
                            </span>

                            <p
                              key={idx}
                              onClick={() => onClick(child.path)}
                              className={`cursor-pointer text-sm py-1 rounded hover:text-primary
                              ${
                                isChildActive
                                  ? "text-heading font-medium"
                                  : "text-[#7d7d7d]"
                              }
                            `}
                            >
                              {child.name}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
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
