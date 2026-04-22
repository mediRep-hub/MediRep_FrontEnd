import { Icon } from "@iconify/react";
import { SearchSelection } from "../../Components/SearchBar/SearchSelection";
import { Spin } from "antd";
import { IoMdCloseCircle } from "react-icons/io";
import MultiSelect from "../../Components/MultiSelect";
import CustomSelect from "../../Components/Select";
import CustomInput from "../../Components/CustomInput";
import { useFormik } from "formik";
import { useQuery } from "@tanstack/react-query";
import { getAllDoctorsLIst } from "../../api/doctorServices";
import { getAllProductsMR } from "../../api/productServices";
import { getAllAccounts } from "../../api/adminServices";
import CustomTable from "../../Components/CustomTable";
import { useEffect, useState } from "react";
import { TbEdit } from "react-icons/tb";
import {
  addGroups,
  deleteGroups,
  getAllGroups,
  updateGroup,
} from "../../api/groupBrickServices";
import { notifyError, notifySuccess } from "../../Components/Toast";
import { GroupSchema } from "../../utils/validation";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { getAllPharmacies } from "../../api/pharmacyServices";
import { useNavigate } from "react-router-dom";
import type { AxiosResponse } from "axios";

interface ProductRow {
  name: string;
  target: number;
  bonus: number;
  amount: number;
}

export interface Person {
  name: string;
  position?: string;
  division?: string;
}

export interface Group {
  groupId: string;
  groupName: string;
  groupType: string;
  region: string;
  city: string;
  area: string[];
  mr?: string[];
  doctorList?: string[];
  manager?: string;
  teamLead?: string;
  activePeriod?: string;
  distributor?: string;
  products?: ProductRow[];
  pharmacies?: any[];
  _id?: string;
}

const titles = [
  "Group ID",
  "Group Name",
  "City",
  "No Of Mr",
  "Area's Name",
  "Product",
  "No Of Doctors",
  "No Of Pharmacies",
  "Actions",
];

const selectRegionOptions = [
  "North Punjab",
  "Kashmir",
  "South Punjab",
  "Gilgit",
];
const activePeriodOptions = [
  "1 month",
  "2 month",
  "3 month",
  "4 month",
  "5 month",
  "6 month",
];
const areaOptions = [
  "Gulberg",
  "DHA",
  "Johar Town",
  "Model Town",
  "Bahria Town",
];
const selectRouteOptions = ["Active", "Planning", "In-active"];
const cityOptions = ["Lahore", "Islamabad", "BahawalPur", "Karachi"];

export default function Group() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addGroupModel, setAddGroupModel] = useState(false);
  const [currentRowIndex, setCurrentRowIndex] = useState<number | null>(null);
  const [bonusValue, setBonusValue] = useState<number>(0);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [isloadingDelete, setLoadingDelete] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [isLoading, setLoading] = useState(false);

  const [rows, setRows] = useState([
    { name: "", target: 0, amount: 0, bonus: 0 },
  ]);

  const [productsData, setProductsData] = useState<any[]>([]);

  const navigate = useNavigate();
  const handleRowClick = (rowData: any) => {
    const groupId = rowData[0];
    const group = allbrickGroup.find((g: any) => g.groupId === groupId);

    if (group) {
      navigate("/group/groupDetails", {
        state: { row: group },
      });
    }
  };

  const { data: doctorss } = useQuery<AxiosResponse<any>>({
    queryKey: ["AllDoctorsss"],
    queryFn: () => getAllDoctorsLIst(),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
  let limit = 100;
  const { data: pharmacies } = useQuery<AxiosResponse<any>>({
    queryKey: ["pharmacies", limit],
    queryFn: () => getAllPharmacies({ limit }),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const { data: Products, isLoading: productsLoading } = useQuery<
    AxiosResponse<any>
  >({
    queryKey: ["getAllProductsMR"],
    queryFn: () => getAllProductsMR(),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const { data: allMr } = useQuery<AxiosResponse<any>>({
    queryKey: ["AllAccount"],
    queryFn: () => getAllAccounts(),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const { data: brickGroup, refetch } = useQuery<AxiosResponse<any>>({
    queryKey: ["getAllGroups"],
    queryFn: () => getAllGroups(),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  let Allpharmacies = pharmacies?.data?.data || [];
  let allbrickGroup = brickGroup?.data || [];
  const AllMR = allMr?.data?.admins || [];
  const AllDoctors = Array.isArray(doctorss?.data?.data)
    ? doctorss.data.data
    : [];
  useEffect(() => {
    if (Products?.data?.data) {
      setProductsData(
        Array.isArray(Products.data.data) ? Products.data.data : [],
      );
    }
  }, [Products]);

  const handleDelete = () => {
    const id = editingGroup?._id;
    if (!id) return notifyError("Invalid account ID");

    setLoadingDelete(true);
    deleteGroups(id)
      .then(() => {
        notifySuccess("Group deleted successfully");
        setDeleteConfirmation(false);
        refetch();
      })
      .catch(() => notifyError("Failed to delete group"))
      .finally(() => setLoadingDelete(false));
  };

  const mappedTableData = allbrickGroup?.map((group: any) => [
    group.groupId,
    group.groupName,
    group.city,
    group.mr?.length || 0,
    Array.isArray(group.area) ? group.area.join(", ") : "-",
    Array.isArray(group.products)
      ? group.products.map((p: any) => p.name).join(", ")
      : "-",
    Array.isArray(group.doctorList) ? group.doctorList.length : 0,
    Array.isArray(group.pharmacies) ? group.pharmacies.length : 0,
    <div className="flex items-center gap-3">
      <TbEdit
        size={18}
        className="cursor-pointer text-primary"
        onClick={(e) => {
          setAddGroupModel(true);
          setEditingGroup(group);
          e.stopPropagation();
        }}
      />
      <Icon
        icon="mingcute:delete-line"
        color="#E90761"
        height="18"
        width="20"
        className="cursor-pointer"
        onClick={(e) => {
          setEditingGroup(group);
          setDeleteConfirmation(true);
          e.stopPropagation();
        }}
      />
    </div>,
  ]);
  const findProductByName = (productName: string) => {
    if (!productName || !productsData.length) return null;

    return productsData.find((product: any) => {
      return (
        product.productName === productName ||
        product.name === productName ||
        product.product_name === productName ||
        product.title === productName
      );
    });
  };
  const getProductDisplayName = (product: any) => {
    return (
      product?.productName ||
      product?.name ||
      product?.product_name ||
      product?.title ||
      ""
    );
  };
  const getInitialProducts = () => {
    if (editingGroup?.products?.length) {
      return editingGroup.products.map((p) => {
        const prod = findProductByName(p.name);
        return {
          name: p.name || "",
          target: p.target || 0,
          bonus: p.bonus || 0,
          amount: prod ? (prod.amount || prod.price || 0) * (p.target || 0) : 0,
        };
      });
    }
    return [{ name: "", target: 0, bonus: 0, amount: 0 }];
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      groupId: editingGroup?.groupId ?? "",
      groupName: editingGroup?.groupName ?? "",
      groupType: editingGroup?.groupType ?? "",
      region: editingGroup?.region ?? "",
      city: editingGroup?.city ?? "",
      area: editingGroup?.area ?? [],
      mrName: editingGroup?.mr ?? [],
      doctorList: editingGroup?.doctorList || [],
      manager: editingGroup?.manager ?? "",
      teamLead: editingGroup?.teamLead ?? "",
      activePeriod: editingGroup?.activePeriod ?? "",
      distributor: editingGroup?.distributor ?? "",
      products: getInitialProducts(),
      pharmacies: editingGroup?.pharmacies ?? [],
    },
    validationSchema: GroupSchema,
    onSubmit: (values) => {
      setLoading(true);
      const mappedProducts = values.products
        .filter((p: any) => p.name && p.target > 0)
        .map((p: any) => {
          const prod = findProductByName(p.name);
          const amount = prod ? prod.amount || prod.price || 0 : 0;
          return {
            name: p.name,
            target: p.target,
            bonus: p.bonus,
            amount: amount * (p.target || 0),
          };
        });

      const payload = {
        groupName: values.groupName,
        groupType: values.groupType,
        region: values.region,
        city: values.city,
        area: values.area,
        mrName: values.mrName,
        doctorList: values.doctorList,
        manager: values.manager,
        teamLead: values.teamLead,
        activePeriod: values.activePeriod,
        distributor: values.distributor,
        products: mappedProducts,
        pharmacies: values.pharmacies,
      };

      const action = editingGroup
        ? updateGroup(editingGroup._id!, payload)
        : addGroups(payload);

      action
        .then(() => {
          notifySuccess(
            `Group ${editingGroup ? "Updated" : "Created"} Successfully`,
          );
          setAddGroupModel(false);
          setEditingGroup(null);
          formik.resetForm();
          refetch();
        })
        .catch(() => notifyError("Operation failed"))
        .finally(() => setLoading(false));
    },
  });

  useEffect(() => {
    document.title = "MediRep | Groups";
  }, []);

  useEffect(() => {
    if (!editingGroup || !productsData.length) return;

    const currentProducts = formik.values.products;
    const hasProducts = currentProducts.some((p) => p.name);
    if (!hasProducts && editingGroup.products?.length) {
      const mappedProducts = editingGroup.products.map((p) => {
        const prod = findProductByName(p.name);
        return {
          name: p.name || "",
          target: p.target || 0,
          bonus: p.bonus || 0,
          amount: prod ? (prod.amount || prod.price || 0) * (p.target || 0) : 0,
        };
      });

      setRows(mappedProducts);
      formik.setFieldValue("products", mappedProducts);
    }
  }, [editingGroup, productsData]);

  const openBonusModal = (index: number) => {
    setCurrentRowIndex(index);
    setBonusValue(formik.values.products[index]?.bonus || 0);
    setIsModalOpen(true);
  };

  const addRow = () => {
    const newProducts = [...formik.values.products];
    newProducts.push({ name: "", target: 0, bonus: 0, amount: 0 });
    formik.setFieldValue("products", newProducts);
  };

  const removeRow = (index: number) => {
    if (formik.values.products.length <= 1) {
      notifyError("At least one product row is required");
      return;
    }

    const newProducts = [...formik.values.products];
    newProducts.splice(index, 1);
    formik.setFieldValue("products", newProducts);
  };

  const updateRow = (index: number, key: keyof ProductRow, value: any) => {
    const newProducts = [...formik.values.products];
    newProducts[index] = { ...newProducts[index], [key]: value };

    if (key === "name" || key === "target") {
      const prod = findProductByName(newProducts[index].name);
      newProducts[index].amount = prod
        ? (prod.amount || prod.price || 0) *
          Number(newProducts[index].target || 0)
        : 0;
    }

    formik.setFieldValue("products", newProducts);
  };

  const handleBonusSave = () => {
    if (currentRowIndex !== null) {
      const newProducts = [...formik.values.products];
      newProducts[currentRowIndex].bonus = bonusValue;
      formik.setFieldValue("products", newProducts);
    }

    setIsModalOpen(false);
    setBonusValue(0);
    setCurrentRowIndex(null);
  };

  const antIcon = (
    <Loading3QuartersOutlined style={{ fontSize: 24, color: "white" }} spin />
  );

  const handleCloseModal = () => {
    setAddGroupModel(false);
    setEditingGroup(null);
    setRows([{ name: "", target: 0, amount: 0, bonus: 0 }]);
    formik.resetForm({
      values: {
        groupId: "",
        groupName: "",
        groupType: "",
        region: "",
        city: "",
        area: [],
        mrName: [],
        doctorList: [],
        manager: "",
        teamLead: "",
        activePeriod: "",
        distributor: "",
        products: [{ name: "", target: 0, bonus: 0, amount: 0 }],
        pharmacies: [],
      },
    });
  };
  return (
    <>
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap gap-4 justify-between items-start">
          <p className="text-heading w-full lg:w-auto font-medium text-[22px] sm:text-[24px]">
            Group
          </p>
          <div className="flex flex-wrap lg:flex-nowrap w-full lg:w-auto  items-center gap-3">
            <div className="md:w-[250px] w-full">
              <SearchSelection placeholder="Group Name" />
            </div>
            <button
              onClick={() => {
                setAddGroupModel(true);
                setEditingGroup(null);
                setRows([{ name: "", target: 0, amount: 0, bonus: 0 }]);
              }}
              className="h-[55px] w-full md:w-[200px] bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
            >
              <Icon
                icon="mingcute:add-fill"
                height="20"
                width="20"
                color="#fff"
              />
              <p className="text-white text-base font-medium">Create Group</p>
            </button>
          </div>
        </div>

        <div className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(75.7vh-0px)] xl:h-[calc(66vh-0px)] h-auto">
          <p className="text-[#7D7D7D] font-medium text-sm">Groups List</p>
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="scroll-smooth mt-4 bg-white rounded-xl 2xl:h-[calc(68.5vh-0px)] xl:h-[calc(56vh-0px)] overflow-y-auto scrollbar-none"
          >
            <CustomTable
              titles={titles}
              data={mappedTableData}
              handleGoToDetail={handleRowClick}
            />
          </div>
        </div>
      </div>

      {addGroupModel && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="bg-white rounded-xl xl:mx-0 mx-5 w-[1000px] max-h-[90vh] overflow-x-auto shadow-xl relative"
          >
            <div className="flex items-center justify-between bg-[#E5EBF7] xl:px-6 px-4 py-4">
              <p className="text-[24px] text-heading capitalize font-normal">
                {editingGroup ? "Edit Group" : "Create Group"}
              </p>

              <div className="h-[35px] group w-[35px] p-2 rounded-full  hover:shadow-[rgba(99,99,99,0.25)_0px_4px_12px_2px] flex items-center justify-center">
                <div className="group-hover:bg-white">
                  <IoMdCloseCircle
                    size={24}
                    onClick={handleCloseModal}
                    className="cursor-pointer text-primary"
                  />
                </div>
              </div>
            </div>

            <form onSubmit={formik.handleSubmit} className="xl:p-6 p-4">
              <p className="text-base font-normal text-[#979797]">
                Define targeted visit strategies for your team
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="md:w-[calc(50%-8px)] w-full">
                  <p className="text-base font-normal text-heading">
                    Group Details
                  </p>
                  <div className="mt-3">
                    <CustomInput
                      label="Group Name"
                      name="groupName"
                      placeholder="Write the Group Name"
                      value={formik.values.groupName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.groupName && formik.errors.groupName && (
                      <div className="text-red-500 text-xs">
                        *{formik.errors.groupName}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <CustomSelect
                      options={selectRouteOptions}
                      value={formik.values.groupType}
                      onChange={(val) => formik.setFieldValue("groupType", val)}
                      placeholder="Group Type"
                    />
                    {formik.touched.groupType && formik.errors.groupType && (
                      <div className="text-red-500 text-xs">
                        *{formik.errors.groupType}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <CustomSelect
                      options={selectRegionOptions}
                      value={formik.values.region}
                      onChange={(val) => formik.setFieldValue("region", val)}
                      placeholder="Region"
                    />
                    {formik.touched.region && formik.errors.region && (
                      <div className="text-red-500 text-xs">
                        *{formik.errors.region}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <CustomSelect
                      options={cityOptions}
                      value={formik.values.city}
                      onChange={(val) => formik.setFieldValue("city", val)}
                      placeholder="City"
                    />
                    {formik.touched.city && formik.errors.city && (
                      <div className="text-red-500 text-xs">
                        *{formik.errors.city}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <MultiSelect
                      label="MR Name"
                      options={AllMR.filter(
                        (doc: any) => doc.position === "MedicalRep(MR)",
                      ).map((doc: any) => doc.name)}
                      value={formik.values.mrName}
                      onChange={(val) => formik.setFieldValue("mrName", val)}
                      placeholder="Select MR"
                    />
                    {formik.touched.mrName && formik.errors.mrName && (
                      <div className="text-red-500 text-xs">
                        *
                        {Array.isArray(formik.errors.mrName)
                          ? formik.errors.mrName.join(", ")
                          : typeof formik.errors.mrName === "string"
                            ? formik.errors.mrName
                            : "Invalid value"}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <MultiSelect
                      label="Select Area"
                      options={areaOptions}
                      value={formik.values.area}
                      onChange={(val) => formik.setFieldValue("area", val)}
                      placeholder="Select area"
                    />
                    {formik.touched.area && formik.errors.area && (
                      <div className="text-red-500 text-xs">
                        *{formik.errors.area}
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:w-[calc(50%-8px)] w-full">
                  <p className="text-base font-normal text-heading">
                    Set Doctors & Management
                  </p>
                  <div className="mt-3">
                    <CustomSelect
                      options={AllMR.filter(
                        (doc: any) =>
                          doc.position === "Area Sales Manager (ASM)",
                      ).map((doc: any) => doc.name)}
                      value={formik.values.manager}
                      onChange={(val) => formik.setFieldValue("manager", val)}
                      placeholder="Select Manager"
                    />
                    {formik.touched.manager && formik.errors.manager && (
                      <div className="text-red-500 text-xs">
                        *{formik.errors.manager}
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <CustomSelect
                      options={AllMR.filter(
                        (doc: any) => doc.position === "MedicalRep(MR)",
                      ).map((doc: any) => doc.name)}
                      value={formik.values.teamLead}
                      onChange={(val) => formik.setFieldValue("teamLead", val)}
                      placeholder="Team Lead"
                    />
                    {formik.touched.teamLead && formik.errors.teamLead && (
                      <div className="text-red-500 text-xs">
                        *{formik.errors.teamLead}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <CustomSelect
                      options={activePeriodOptions}
                      value={formik.values.activePeriod}
                      onChange={(val) =>
                        formik.setFieldValue("activePeriod", val)
                      }
                      placeholder="Active Period"
                    />
                    {formik.touched.activePeriod &&
                      formik.errors.activePeriod && (
                        <div className="text-red-500 text-xs">
                          *{formik.errors.activePeriod}
                        </div>
                      )}
                  </div>
                  <div className="mt-3">
                    <CustomSelect
                      options={AllMR.filter(
                        (doc: any) => doc.division === "Distributor",
                      ).map((doc: any) => doc.name)}
                      value={formik.values.distributor}
                      onChange={(val) =>
                        formik.setFieldValue("distributor", val)
                      }
                      placeholder="Select Distributor"
                    />
                    {formik.touched.distributor &&
                      formik.errors.distributor && (
                        <div className="text-red-500 text-xs">
                          *{formik.errors.distributor}
                        </div>
                      )}
                  </div>
                  <div className="mt-3">
                    <MultiSelect
                      label="Doctors List"
                      options={AllDoctors.map((doc: any) => doc.name)}
                      value={formik.values.doctorList}
                      onChange={(val) =>
                        formik.setFieldValue("doctorList", val)
                      }
                      placeholder="Select Doctor"
                    />
                    {formik.touched.doctorList && formik.errors.doctorList && (
                      <div className="text-red-500 text-xs">
                        *{formik.errors.doctorList}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <MultiSelect
                      label="Pharmacies"
                      options={Allpharmacies.map((doc: any) => doc.name)}
                      value={formik.values.pharmacies}
                      onChange={(val) =>
                        formik.setFieldValue("pharmacies", val)
                      }
                      placeholder="Select Pharmacies"
                    />
                    {formik.touched.pharmacies && formik.errors.pharmacies && (
                      <div className="text-red-500 text-xs mb-2">
                        *
                        {Array.isArray(formik.errors.pharmacies)
                          ? formik.errors.pharmacies.join(", ")
                          : typeof formik.errors.pharmacies === "string"
                            ? formik.errors.pharmacies
                            : "Invalid value"}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-full mt-5 rounded-md border-dashed border border-primary pb-3">
                <div className="w-full overflow-x-auto md:overflow-visible">
                  <div className="min-w-[700px] md:min-w-full">
                    <div className="border-b-[1px] border-primary w-full flex p-4">
                      <p className="text-xs w-[40%] font-bold text-heading">
                        Product Name
                      </p>
                      <p className="text-xs w-[20%] font-bold text-heading">
                        Set Target
                      </p>
                      <p className="text-xs w-[20%] font-bold text-heading">
                        Set Bonus
                      </p>
                      <p className="text-xs w-[20%] font-bold text-heading">
                        Value
                      </p>
                      <p className="text-xs w-[15%] font-bold text-heading">
                        Action
                      </p>
                    </div>

                    {productsLoading ? (
                      <div className="flex  justify-center items-center py-8">
                        <Spin size="small" />
                        <span className="ml-2 text-sm text-gray-600">
                          Loading products...
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {formik.values.products.map((row, index) => {
                          const product = findProductByName(row.name);
                          const amount = product
                            ? (product.amount || product.price || 0) *
                              Number(row.target || 0)
                            : 0;

                          return (
                            <div
                              key={index}
                              className="border-b-[1px] border-primary w-full flex  items-center p-4"
                            >
                              <div className="text-xs w-[40%] font-bold text-heading">
                                <select
                                  className="border-[1px] w-[80%] px-2 py-1 rounded-md border-[#7d7d7d]/50 focus:outline-none"
                                  value={row.name}
                                  onChange={(e) =>
                                    updateRow(index, "name", e.target.value)
                                  }
                                >
                                  <option value="">Select Product</option>
                                  {productsData.map((p: any) => {
                                    const productName =
                                      getProductDisplayName(p);
                                    const productId =
                                      p._id || p.id || p.productId;

                                    if (!productName) return null;

                                    return (
                                      <option
                                        key={productId}
                                        value={productName}
                                      >
                                        {productName}
                                      </option>
                                    );
                                  })}
                                </select>
                                {formik.touched.products &&
                                  formik.errors.products &&
                                  Array.isArray(formik.errors.products) &&
                                  formik.errors.products[index] &&
                                  typeof formik.errors.products[index] ===
                                    "object" &&
                                  !Array.isArray(
                                    formik.errors.products[index],
                                  ) &&
                                  (
                                    formik.errors.products[index] as {
                                      name?: string;
                                    }
                                  ).name && (
                                    <div className="text-red-500 text-xs mt-1">
                                      *
                                      {
                                        (
                                          formik.errors.products[index] as {
                                            name: string;
                                          }
                                        ).name
                                      }
                                    </div>
                                  )}
                              </div>
                              <div className="text-xs w-[20%] font-bold text-heading">
                                <input
                                  type="number"
                                  min="0"
                                  className="border-[1px] px-2 py-1 rounded-md border-[#7d7d7d]/50 focus:outline-none w-[100px] lg:w-[120px]"
                                  value={row.target}
                                  onChange={(e) =>
                                    updateRow(
                                      index,
                                      "target",
                                      Number(e.target.value) || 0,
                                    )
                                  }
                                />
                                {formik.touched.products &&
                                  formik.errors.products &&
                                  Array.isArray(formik.errors.products) &&
                                  formik.errors.products[index] &&
                                  typeof formik.errors.products[index] ===
                                    "object" &&
                                  (formik.errors.products[index] as any)
                                    ?.target && (
                                    <div className="text-red-500 text-xs mt-1">
                                      *
                                      {
                                        (formik.errors.products[index] as any)
                                          .target
                                      }
                                    </div>
                                  )}
                              </div>
                              <div className="text-xs w-[20%] font-bold text-heading">
                                <p
                                  className="cursor-pointer font-medium text-primary underline"
                                  onClick={() => openBonusModal(index)}
                                >
                                  {row.bonus > 0 ? `${row.bonus}` : "Add Bonus"}
                                </p>
                              </div>
                              <p className="text-xs w-[20%] font-bold text-heading">
                                {amount.toFixed(2)}
                              </p>
                              <div className="w-[15%] flex gap-2">
                                {index ===
                                  formik.values.products.length - 1 && (
                                  <div
                                    className="h-10 cursor-pointer w-10 border-primary flex items-center justify-center border-[1px] rounded-md"
                                    onClick={addRow}
                                  >
                                    <Icon
                                      className="text-primary"
                                      icon="basil:add-outline"
                                      height="25"
                                      width="25"
                                    />
                                  </div>
                                )}
                                {formik.values.products.length > 1 && (
                                  <div
                                    className="h-10 cursor-pointer w-10 border-red-500 flex items-center justify-center border-[1px] rounded-md"
                                    onClick={() => removeRow(index)}
                                  >
                                    <Icon
                                      className="text-red-500"
                                      icon="mingcute:close-fill"
                                      height="20"
                                      width="20"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {isModalOpen && (
                      <>
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                          <div className="bg-white  rounded-lg w-[450px] shadow-lg">
                            <div className="flex p-4 rounded-t-lg bg-[#E5EBF7] items-center justify-between">
                              <p className="text-[16px] leading-[100%] text-heading font-medium">
                                Add Bouns
                              </p>
                            </div>
                            <div className="p-4">
                              {" "}
                              <CustomInput
                                type="number"
                                label="Bouns"
                                value={bonusValue}
                                onChange={(e) =>
                                  setBonusValue(Number(e.target.value) || 0)
                                }
                                placeholder="Enter bonus amount"
                              />
                            </div>
                            <div className="flex justify-end gap-3 p-4">
                              <button
                                className="h-[48px] px-6 bg-[#F2FAFD] text-[#131313] rounded-[6px] cursor-pointer"
                                onClick={() => setIsModalOpen(false)}
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleBonusSave}
                                className="bg-primary text-white px-7 py-3 rounded"
                              >
                                {isLoading ? (
                                  <Spin indicator={antIcon} />
                                ) : editingGroup ? (
                                  "Update Bouns"
                                ) : (
                                  "Add Bouns"
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-5 gap-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="h-[55px] md:w-[100px] w-full bg-[#F2FAFD] text-[#131313] rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || productsLoading}
                  className={`h-[55px] md:w-[200px] w-full ${
                    isLoading || productsLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-primary"
                  } text-white rounded-[6px] flex justify-center items-center`}
                >
                  {isLoading ? (
                    <Spin indicator={antIcon} />
                  ) : editingGroup ? (
                    "Update Group"
                  ) : (
                    "Create Group"
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
                <div className="flex justify-center items-center bg-[#E90761] h-[80px] w-[80px] rounded-full">
                  <Icon
                    icon="mingcute:delete-line"
                    className="text-4xl text-white"
                  />
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-base font-normal text-[#131313] mt-5">
                Are you sure to delete this Group?
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
