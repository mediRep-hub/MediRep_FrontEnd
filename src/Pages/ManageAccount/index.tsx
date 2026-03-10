import { useEffect, useMemo, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { TbEdit } from "react-icons/tb";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { Icon } from "@iconify/react";
import { useFormik } from "formik";
import { useQuery } from "@tanstack/react-query";
import CustomTable from "../../Components/CustomTable";
import CustomInput from "../../Components/CustomInput";
import CustomSelect from "../../Components/Select";
import ImagePicker from "../../Components/ImagePicker";
import Pagination from "../../Components/Pagination";
import { notifyError, notifySuccess } from "../../Components/Toast";
import { AccountSchema } from "../../utils/validation";
import {
  addAccount,
  deleteAccount,
  getAllAccounts,
  updateAccount,
} from "../../api/adminServices";
import { useNavigate } from "react-router-dom";
import SearchByName from "../../Components/SearchBar/searchByName";
import { bricksData } from "../../utils/brick";
import { useDebounce } from "../../Components/Debounce";
import DatePicker from "../../Components/DatePicker";
import dayjs from "dayjs";
import MultiSelectNew from "../../Components/MultiSelectNew";

const leaveOptions = [
  "Casual Leave",
  "Sick Leave",
  "Annual Leave",
  "Maternity Leave",
  "Paternity Leave",
];
export interface SelectedOption {
  label: string;
  amount: number;
}
const Positionlist = [
  "Director Sales",
  "National Sales Manger (NSM)",
  "Regional Sales Manager (RSM)",
  "Area Sales Manager (ASM)",
  "MedicalRep(MR)",
];
const Arealist = ["Lahore", "Islamabad", "Bahawalpur", "Karachi"];
const Divisionlist = ["Sales", "marketing", "Distributor"] as const;

export interface SelectedOption {
  label: string;
  amount: number;
}

export interface Account {
  _id?: string;
  adminId?: string | number;
  name?: string;
  email?: string;
  brickName?: string;
  phoneNumber?: string;
  division?: string;
  position?: string;
  city?: string;
  ownerName?: string;
  image?: string;
  DOB: Date;
}

interface RowsByDivision {
  sales: any[];
  marketing: any[];
  distributor: any[];
}
const leaveLabelMap: any = {
  "Casual Leave": "casualLeave",
  "Sick Leave": "sickLeave",
  "Annual Leave": "annualLeave",
  "Maternity Leave": "maternityLeave",
  "Paternity Leave": "paternityLeave",
};
export default function ManageAccount() {
  const [isEdit, setEdit] = useState<boolean>(false);
  const [isLoading, setLoading] = useState(false);
  const [selectTab, setSelectTab] = useState<
    "sales" | "marketing" | "distributor"
  >("sales");
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [isloadingDelete, setLoadingDelete] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [searchBrick, setSearchBrick] = useState("");
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const brickOptions: string[] = bricksData.map(
    (brick: any) => brick.brickName,
  );
  const handleGoTODetails = (row: any[]) => {
    const adminId = row[0];

    const account = AllAccounts.find(
      (item) => item.adminId === adminId || item._id === adminId,
    );

    if (!account) {
      console.error("Account not found for ID:", adminId);
      return;
    }

    navigate("/manageAccounts/details", {
      state: { row: account },
    });
  };
  const debouncedName = useDebounce(searchName, 500);
  const debouncedBrick = useDebounce(searchBrick, 500);
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["AllAccount", debouncedName, debouncedBrick, currentPage],
    queryFn: () =>
      getAllAccounts({
        name: debouncedName || undefined,
        brickName: debouncedBrick || undefined,
        page: currentPage,
        limit: itemsPerPage,
      }),
  });
  const objectToMultiSelect = (leave: any) =>
    Object.keys(leaveLabelMap)
      .map((label) => ({
        label,
        amount: leave?.[leaveLabelMap[label]]?.total || 0,
      }))
      .filter((v) => v.amount > 0);

  const multiSelectToObject = (arr: SelectedOption[]) => {
    const result: any = {
      casualLeave: { total: 0, consumed: 0 },
      sickLeave: { total: 0, consumed: 0 },
      annualLeave: { total: 0, consumed: 0 },
      maternityLeave: { total: 0, consumed: 0 },
      paternityLeave: { total: 0, consumed: 0 },
    };

    arr.forEach((item) => {
      result[leaveLabelMap[item.label]] = {
        total: Number(item.amount),
        consumed: 0,
      };
    });

    return result;
  };

  const AllAccounts: Account[] = data?.data?.admins ?? [];
  const rowsByDivision: RowsByDivision = useMemo(() => {
    const buildRow = (v: Account) => {
      const baseRow = [
        v?.adminId,
        v?.name,
        v?.email,
        v?.division,
        v?.division === "Distributor" ? v?.ownerName : v?.position,
        v?.division !== "Distributor" ? v?.brickName : null,
        <div className="flex items-center gap-2" key={v._id}>
          <TbEdit
            onClick={(e) => {
              e.stopPropagation();
              setEdit(true);
              setEditingAccount(v);
              setCreateAccount(true);
            }}
            size={18}
            className="text-primary cursor-pointer"
          />
          <Icon
            color="#E90761"
            height="18"
            width="20"
            icon="mingcute:delete-line"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteConfirmation(true);
              setEditingAccount(v);
            }}
          />
        </div>,
      ];
      return baseRow;
    };

    return {
      sales: AllAccounts.filter((a) => a.division === "Sales").map(buildRow),
      marketing: AllAccounts.filter((a) => a.division === "marketing").map(
        buildRow,
      ),
      distributor: AllAccounts.filter((a) => a.division === "Distributor").map(
        buildRow,
      ),
    };
  }, [AllAccounts]);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: editingAccount?.name ?? "",
      phoneNumber: editingAccount?.phoneNumber ?? "",
      email: editingAccount?.email ?? "",
      password: "",
      confirmPassword: "",
      DOB: editingAccount?.DOB ? dayjs(editingAccount.DOB) : null,

      image: editingAccount?.image ?? "",
      division: editingAccount?.division ?? "",
      city: editingAccount?.city ?? "",
      brickName: editingAccount?.brickName ?? "",
      position: editingAccount?.position ?? "",
      ownerName: editingAccount?.ownerName ?? "",
      joiningDate: editingAccount?.joiningDate
        ? dayjs(editingAccount.joiningDate)
        : null,
      salaryStructure: {
        basic: editingAccount?.salaryStructure?.basic || 0,
        incentive: {
          flue: editingAccount?.salaryStructure?.incentive?.flue || 0,
          medical: editingAccount?.salaryStructure?.incentive?.medical || 0,
          others: editingAccount?.salaryStructure?.incentive?.others || 0,
          deductions:
            editingAccount?.salaryStructure?.incentive?.deductions || 0,
        },
        tax: editingAccount?.salaryStructure?.tax || 0,
      },
      loanPF: {
        loan: editingAccount?.loanPF?.loan || 0,
        pf: editingAccount?.loanPF?.pf || 0,
      },
      leaveMultiSelect: editingAccount
        ? objectToMultiSelect(editingAccount.leaveEntitlements)
        : [],
      leaveEntitlements: editingAccount?.leaveEntitlements || {
        casualLeave: 0,
        sickLeave: 0,
        annualLeave: 0,
        maternityLeave: 0,
        paternityLeave: 0,
      },
    },
    validationSchema: AccountSchema(isEdit),
    onSubmit: (values) => {
      setLoading(true);

      const payload = {
        name: values.name,
        phoneNumber: values.phoneNumber,
        email: values.email,
        image: values.image,
        password: values.password,
        confirmPassword: values.confirmPassword,
        division: values.division,
        city: values.city,
        DOB: values.DOB,
        brickName: values.brickName,
        position: values.position,
        ownerName: values.ownerName,
        joiningDate: values.joiningDate,
        salaryStructure: values.salaryStructure,
        loanPF: values.loanPF,
        leaveEntitlements: multiSelectToObject(values.leaveMultiSelect),
      };

      const action = editingAccount
        ? updateAccount(editingAccount._id as string, payload)
        : addAccount(payload);

      action
        .then(() => {
          notifySuccess(
            `Account ${editingAccount ? "updated" : "added"} successfully`,
          );
          setCreateAccount(false);
          setEditingAccount(null);
          formik.resetForm();
          refetch();
        })
        .catch((error: any) => {
          console.error(error);
          notifyError("Operation failed.");
          notifyError(error.response?.data?.message || error.message);
        })
        .finally(() => setLoading(false));
    },
  });
  useEffect(() => {
    if (formik.values.division === "Distributor")
      formik.setFieldValue("position", "Distributor");
    else if (formik.values.position === "Distributor")
      formik.setFieldValue("position", "");
  }, [formik.values.division]);
  const handleDelete = () => {
    const id = editingAccount?._id;
    if (!id) return notifyError("Invalid account ID");

    setLoadingDelete(true);
    deleteAccount(id)
      .then(() => {
        notifySuccess("Account deleted successfully");
        setDeleteConfirmation(false);
        refetch();
      })
      .catch(() => notifyError("Failed to delete account"))
      .finally(() => setLoadingDelete(false));
  };
  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 24, color: "white" }} spin />
  );
  useEffect(() => {
    document.title = "MediRep | Manage Accounts";
  }, []);

  return (
    <>
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap gap-4 justify-between items-start">
          <p className="text-heading font-medium text-[22px] sm:text-[24px]">
            Manage Accounts
          </p>
          <div className="flex flex-wrap md:flex-nowrap gap-4 items-center">
            <div className="md:w-[245px] lg:w-[250px] w-full">
              <SearchByName
                name="Employee Name:"
                value={searchName}
                onChange={(val) => {
                  setSearchName(val);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="md:w-[245px] lg:w-[250px] w-full">
              <SearchByName
                name="Brick Name:"
                value={searchBrick}
                onChange={(val) => {
                  setSearchBrick(val);
                  setCurrentPage(1);
                }}
              />
            </div>
            <button
              onClick={() => {
                setCreateAccount(true);
                setEditingAccount(null);
                setEdit(false);
              }}
              className="h-[55px] w-full md:w-[180px] bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
            >
              <Icon
                icon="mingcute:add-fill"
                height="20"
                width="20"
                color="#fff"
              />
              <p className="text-white text-base font-medium">Create Account</p>
            </button>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          {["sales", "marketing", "distributor"].map((tab) => (
            <button
              key={tab}
              className={`w-[120px] h-12 rounded-t-xl ${
                selectTab === tab
                  ? "bg-[#E5EBF7] text-heading"
                  : "bg-white text-[#7d7d7d]"
              }`}
              onClick={() => {
                setSelectTab(tab as typeof selectTab);
                setCurrentPage(1);
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div
          className={`rounded-[12px] bg-[#E5EBF7] p-4 2xl:h-[calc(70.7vh-0px)] xl:h-[calc(56.5vh-0px)] h-auto ${
            selectTab === "marketing" || selectTab === "distributor"
              ? "rounded-tl-[12px]"
              : "rounded-tl-none"
          }`}
        >
          <div className="flex justify-between items-center">
            <p className="text-[#7D7D7D] font-medium text-sm">Accounts</p>
            <Pagination
              currentPage={currentPage}
              totalItems={
                selectTab === "sales"
                  ? rowsByDivision.sales.length
                  : selectTab === "marketing"
                    ? rowsByDivision.marketing.length
                    : rowsByDivision.distributor.length
              }
              itemsPerPage={itemsPerPage}
              onPageChange={(page: any) => setCurrentPage(page)}
            />
          </div>

          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(63.2vh-0px)] xl:h-[calc(45.5vh-0px)] mt-4 overflow-y-auto scrollbar-none"
          >
            <CustomTable
              titles={
                selectTab === "distributor"
                  ? ["ID", "Name", "Email", "Division", "Owner Name", "Action"]
                  : [
                      "ID",
                      "Name",
                      "Email",
                      "Division",
                      "Position",
                      "Brick Name",
                      "Action",
                    ]
              }
              data={
                selectTab === "sales"
                  ? rowsByDivision.sales
                  : selectTab === "marketing"
                    ? rowsByDivision.marketing
                    : rowsByDivision.distributor
              }
              isFetching={isFetching}
              handleGoToDetail={handleGoTODetails}
            />
          </div>
        </div>
      </div>
      {createAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="bg-white rounded-xl xl:mx-0 mx-5 w-[1000px] max-h-[90vh] overflow-x-auto  shadow-xl relative"
          >
            <div className="flex items-center justify-between bg-[#E5EBF7] xl:px-6 px-4 py-4">
              <p className="text-[24px] text-heading capitalize font-normal">
                {isEdit === false ? "Add Account" : "Update Account"}
              </p>

              <div className="h-[35px] group w-[35px] p-2 rounded-full  hover:shadow-[rgba(99,99,99,0.25)_0px_4px_12px_2px] flex items-center justify-center">
                <div className="group-hover:bg-white">
                  <IoMdCloseCircle
                    size={24}
                    onClick={() => setCreateAccount(false)}
                    className="cursor-pointer text-primary"
                  />
                </div>
              </div>
            </div>
            <form className="xl:p-6 p-4" onSubmit={formik.handleSubmit}>
              <p className="text-base leading-[100%] text-[#131313] mb-2 font-normal">
                Account Details
              </p>
              <div className="flex flex-wrap  gap-0 md:gap-4">
                <div className="md:w-[calc(50%-8px)] w-full">
                  <div className="mt-3">
                    <CustomInput
                      name="name"
                      value={formik.values.name}
                      label="Name"
                      placeholder="Paul Walker"
                      onChange={formik.handleChange}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <div className="text-red-500 text-xs">
                        *
                        {typeof formik.errors.name === "string"
                          ? formik.errors.name
                          : ""}
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <CustomInput
                      name="phoneNumber"
                      label="Phone Number"
                      value={formik.values.phoneNumber}
                      placeholder="e.g, +92-321-123-4567"
                      onChange={formik.handleChange}
                    />
                    {formik.touched.phoneNumber &&
                      formik.errors.phoneNumber && (
                        <div className="text-red-500 text-xs">
                          *
                          {typeof formik.errors.phoneNumber === "string"
                            ? formik.errors.phoneNumber
                            : ""}
                        </div>
                      )}
                  </div>

                  <div className="mt-3">
                    <CustomInput
                      name="email"
                      label="Email"
                      placeholder="Enter email here"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="text-red-500 text-xs">
                        *
                        {typeof formik.errors.email === "string"
                          ? formik.errors.email
                          : ""}
                      </div>
                    )}
                  </div>

                  {isEdit === false && (
                    <>
                      <div className="mt-3">
                        <div className="relative w-full">
                          <label className="absolute -top-2 left-5 bg-white px-1 text-xs text-[#7d7d7d]">
                            Password
                          </label>
                          <input
                            id="password"
                            name="password"
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Password"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            className="rounded-md w-full h-14 px-3 py-2 text-sm outline-none border-primary border-[0.5px]"
                          />
                          <span
                            className="absolute right-4 top-5 cursor-pointer text-[#7D7D7D]"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                          >
                            {passwordVisible ? (
                              <Icon
                                icon="mdi:eye"
                                className="text-primary"
                                style={{ fontSize: "20px" }}
                              />
                            ) : (
                              <Icon
                                icon="mdi:eye-off"
                                className="text-primary"
                                style={{ fontSize: "20px" }}
                              />
                            )}
                          </span>
                        </div>
                        {formik.touched.password && formik.errors.password && (
                          <div className="text-red-500 text-xs">
                            *
                            {typeof formik.errors.password === "string"
                              ? formik.errors.password
                              : ""}
                          </div>
                        )}
                      </div>

                      <div className="mt-3">
                        <div className="relative w-full">
                          <label className="absolute -top-2 left-5 bg-white px-1 text-xs text-[#7d7d7d]">
                            Confirm Password
                          </label>
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={passwordConfirmVisible ? "text" : "password"}
                            placeholder="Confirm Password"
                            onChange={formik.handleChange}
                            value={formik.values.confirmPassword}
                            className="rounded-md w-full h-14 px-3 py-2 text-sm outline-none border-primary border-[0.5px]"
                          />
                          <span
                            className="absolute right-4 top-5 cursor-pointer text-[#7D7D7D]"
                            onClick={() =>
                              setPasswordConfirmVisible(!passwordConfirmVisible)
                            }
                          >
                            {passwordConfirmVisible ? (
                              <Icon
                                icon="mdi:eye"
                                className="text-primary"
                                style={{ fontSize: "20px" }}
                              />
                            ) : (
                              <Icon
                                icon="mdi:eye-off"
                                className="text-primary"
                                style={{ fontSize: "20px" }}
                              />
                            )}
                          </span>
                        </div>
                        {formik.touched.confirmPassword &&
                          formik.errors.confirmPassword && (
                            <div className="text-red-500 text-xs">
                              *
                              {typeof formik.errors.confirmPassword === "string"
                                ? formik.errors.confirmPassword
                                : ""}
                            </div>
                          )}
                      </div>
                    </>
                  )}

                  <div className="mt-3">
                    <ImagePicker
                      label="Upload Image"
                      placeholder="Upload Image Here..."
                      fileType="Manage MR"
                      type="image"
                      value={formik.values.image}
                      onChange={(val: any) =>
                        formik.setFieldValue("image", val)
                      }
                    />
                    {formik.touched.image && formik.errors.image && (
                      <div className="text-red-500 text-xs">
                        *
                        {typeof formik.errors.image === "string"
                          ? formik.errors.image
                          : ""}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <DatePicker
                      label="Joining Date"
                      value={formik.values.joiningDate}
                      onChange={(date) =>
                        formik.setFieldValue("joiningDate", date)
                      }
                    />
                    {formik.touched.joiningDate &&
                      formik.errors.joiningDate &&
                      typeof formik.errors.joiningDate === "string" && (
                        <div className="text-xs text-red-500">
                          * {formik.errors.joiningDate}
                        </div>
                      )}
                  </div>
                  <div className="mt-3">
                    <MultiSelectNew
                      placeholder="Select leave"
                      options={leaveOptions}
                      value={formik.values.leaveMultiSelect}
                      onChange={(val: SelectedOption[]) => {
                        formik.setFieldValue("leaveMultiSelect", val);
                        formik.setFieldValue(
                          "leaveEntitlements",
                          multiSelectToObject(val),
                        );
                      }}
                    />
                  </div>
                </div>

                <div className="md:w-[calc(50%-8px)] w-full">
                  <div className="mt-3">
                    <CustomSelect
                      options={Divisionlist as unknown as string[]}
                      placeholder="Division"
                      onChange={(val: any) =>
                        formik.setFieldValue("division", val)
                      }
                      value={formik.values.division}
                    />

                    {formik.touched.division && formik.errors.division && (
                      <div className="text-red-500 text-xs">
                        *
                        {typeof formik.errors.division === "string"
                          ? formik.errors.division
                          : ""}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    {formik.values.division !== "Distributor" ? (
                      <CustomSelect
                        value={formik.values.position}
                        options={Positionlist}
                        placeholder="Position"
                        onChange={(val: any) =>
                          formik.setFieldValue("position", val)
                        }
                      />
                    ) : (
                      <>
                        <input
                          type="text"
                          value="Distributor"
                          disabled
                          className="rounded-md hidden w-full h-14 px-3 py-2 text-sm outline-none border-primary border-[0.5px] bg-gray-100"
                        />

                        <CustomInput
                          value={formik.values.ownerName}
                          label="Owner Name"
                          onChange={(e: any) =>
                            formik.setFieldValue("ownerName", e.target.value)
                          }
                          placeholder="Select Owner Name"
                        />
                        {formik.touched.ownerName &&
                          formik.errors.ownerName && (
                            <div className="text-red-500 text-xs">
                              *
                              {typeof formik.errors.ownerName === "string"
                                ? formik.errors.ownerName
                                : ""}
                            </div>
                          )}
                      </>
                    )}

                    {formik.values.division !== "Distributor" &&
                      formik.touched.position &&
                      formik.errors.position && (
                        <div className="text-red-500 text-xs">
                          *
                          {typeof formik.errors.position === "string"
                            ? formik.errors.position
                            : ""}
                        </div>
                      )}
                  </div>
                  <div className="mt-3">
                    <CustomSelect
                      value={formik.values.city}
                      options={Arealist}
                      onChange={(val: any) => formik.setFieldValue("city", val)}
                      placeholder="City"
                    />
                    {formik.touched.city && formik.errors.city && (
                      <div className="text-red-500 text-xs">
                        *
                        {typeof formik.errors.city === "string"
                          ? formik.errors.city
                          : ""}
                      </div>
                    )}
                  </div>

                  {formik.values.division !== "Distributor" && (
                    <div className="mt-3">
                      <CustomSelect
                        value={formik.values.brickName}
                        options={brickOptions}
                        placeholder="Brick Name"
                        onChange={(val: any) =>
                          formik.setFieldValue("brickName", val)
                        }
                      />
                      {formik.touched.brickName && formik.errors.brickName && (
                        <div className="text-red-500 text-xs">
                          *
                          {typeof formik.errors.brickName === "string"
                            ? formik.errors.brickName
                            : ""}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="mt-3">
                    <DatePicker
                      label="DOB"
                      value={formik.values.DOB}
                      onChange={(date) => formik.setFieldValue("DOB", date)}
                    />
                    {formik.touched.DOB &&
                      formik.errors.DOB &&
                      typeof formik.errors.DOB === "string" && (
                        <div className="text-xs text-red-500">
                          * {formik.errors.DOB}
                        </div>
                      )}
                  </div>
                  <div className="flex-1 space-y-3 mt-3 ">
                    <div>
                      <CustomInput
                        label="Basic Salary"
                        type="number"
                        value={formik.values.salaryStructure.basic}
                        onChange={(e) =>
                          formik.setFieldValue(
                            "salaryStructure.basic",
                            Number(e.target.value),
                          )
                        }
                      />
                      {formik.touched.salaryStructure &&
                        formik.errors.salaryStructure &&
                        typeof formik.errors.salaryStructure === "string" && (
                          <div className="text-xs text-red-500">
                            * {formik.errors.salaryStructure}
                          </div>
                        )}
                    </div>
                    <CustomInput
                      label="Fuel"
                      type="number"
                      value={formik.values.salaryStructure.incentive.flue}
                      onChange={(e) =>
                        formik.setFieldValue(
                          "salaryStructure.incentive.flue",
                          Number(e.target.value),
                        )
                      }
                      onBlur={() =>
                        formik.setFieldTouched(
                          "salaryStructure.incentive.flue",
                          true,
                        )
                      }
                    />
                    {formik.errors.salaryStructure?.incentive?.flue && (
                      <div className="text-xs text-red-500">
                        * {String(formik.errors.salaryStructure.incentive.flue)}
                      </div>
                    )}

                    <div>
                      <CustomInput
                        label="Incentive - Medical"
                        type="number"
                        value={formik.values.salaryStructure.incentive.medical}
                        onChange={(e) =>
                          formik.setFieldValue(
                            "salaryStructure.incentive.medical",
                            Number(e.target.value),
                          )
                        }
                      />
                      {formik.touched.salaryStructure &&
                        formik.errors.salaryStructure &&
                        typeof formik.errors.salaryStructure === "string" && (
                          <div className="text-xs text-red-500">
                            * {formik.errors.salaryStructure}
                          </div>
                        )}
                    </div>
                    <div>
                      <CustomInput
                        label="Incentive - Others"
                        type="number"
                        value={formik.values.salaryStructure.incentive.others}
                        onChange={(e) =>
                          formik.setFieldValue(
                            "salaryStructure.incentive.others",
                            Number(e.target.value),
                          )
                        }
                      />
                      {formik.touched.salaryStructure &&
                        formik.errors.salaryStructure &&
                        typeof formik.errors.salaryStructure === "string" && (
                          <div className="text-xs text-red-500">
                            * {formik.errors.salaryStructure}
                          </div>
                        )}
                    </div>

                    <div>
                      <div>
                        <CustomInput
                          label="Deductions"
                          type="number"
                          value={
                            formik.values.salaryStructure.incentive.deductions
                          }
                          onChange={(e) =>
                            formik.setFieldValue(
                              "salaryStructure.incentive.deductions",
                              Number(e.target.value),
                            )
                          }
                        />
                        {formik.touched.salaryStructure &&
                          formik.errors.salaryStructure &&
                          typeof formik.errors.salaryStructure === "string" && (
                            <div className="text-xs text-red-500">
                              * {formik.errors.salaryStructure}
                            </div>
                          )}
                      </div>
                      {formik.touched.salaryStructure &&
                        formik.errors.salaryStructure &&
                        typeof formik.errors.salaryStructure === "string" && (
                          <div className="text-xs text-red-500">
                            * {formik.errors.salaryStructure}
                          </div>
                        )}
                    </div>
                    <div>
                      <CustomInput
                        label="Tax"
                        type="number"
                        value={formik.values.salaryStructure.tax}
                        onChange={(e) =>
                          formik.setFieldValue(
                            "salaryStructure.tax",
                            Number(e.target.value),
                          )
                        }
                      />
                      {formik.touched.salaryStructure &&
                        formik.errors.salaryStructure &&
                        typeof formik.errors.salaryStructure === "string" && (
                          <div className="text-xs text-red-500">
                            * {formik.errors.salaryStructure}
                          </div>
                        )}
                    </div>
                    <div>
                      <CustomInput
                        label="PF"
                        type="number"
                        value={formik.values.loanPF.pf}
                        onChange={(e) =>
                          formik.setFieldValue(
                            "loanPF.pf",
                            Number(e.target.value),
                          )
                        }
                      />
                      {formik.touched.loanPF &&
                        formik.errors.loanPF &&
                        typeof formik.errors.loanPF === "string" && (
                          <div className="text-xs text-red-500">
                            * {formik.errors.loanPF}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-5 gap-4">
                <button
                  onClick={() => setCreateAccount(false)}
                  className="h-[55px] md:w-[100px] w-full bg-[#F2FAFD] text-[#131313] rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-[55px] md:w-[200px] w-full bg-primary text-white rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
                >
                  {isLoading ? (
                    <Spin indicator={antIcon} />
                  ) : isEdit === false ? (
                    "Create Account"
                  ) : (
                    "Update Account"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl xl:mx-0 mx-5 w-[500px] h-auto overflow-x-auto shadow-xl relative">
            <div className="bg-[#E90761]/10 p-4">
              <p className="text-base text-[#131313]">Delete Account</p>
            </div>

            <div className="flex justify-center my-6">
              <div className="flex justify-center items-center bg-[#E90761]/10 h-[120px] w-[120px] rounded-full">
                <div className="flex justify-center items-center  bg-[#E90761] h-[80px] w-[80px] rounded-full">
                  <Icon
                    icon="mingcute:delete-line"
                    className="text-4xl text-white"
                  />
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-base font-normal text-[#131313] mt-5">
                Are you sure to delete this account?
              </p>
              <p className="mb-6 text-[#7D7D7D]/40">
                Once you delete it will not restored
              </p>
            </div>
            <div className="flex mt-5 justify-end gap-4 p-4">
              <button
                onClick={() => setDeleteConfirmation(false)}
                className="px-7 h-[48px] py-2 font-medium bg-[#FDE6EF] rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-7 h-[48px] py-2 bg-[#E90761] font-medium text-white rounded-md"
              >
                {isloadingDelete ? <Spin indicator={antIcon} /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
