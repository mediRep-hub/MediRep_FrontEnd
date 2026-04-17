import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type Distributor =
  | "Abdullah Enterprises - Chakwal"
  | "AL Aziz Distributors - Sargodha"
  | "Al-Fateh Medicine Co - Burewala"
  | "Al Qamar"
  | "Drug Services"
  | "Allied Enterprises"
  | "New Mohed Traders"
  | "Zaheer Pharma"
  | "MZ Pharma Distribution (Pakpattan)"
  | "Sajjad Enterprises"
  | "Pharma Link Distributor"
  | "Ali Pharma (Distribution)"
  | "Al-Rehmat Distributors"
  | "Faisal Pharma"
  | "Latif & Sons Distributors"
  | "Pharma Page Plus"
  | "Sheryar Distributor"
  | "Umer Brothers";

// 👇 basic data type (tum isko aur improve kar sakte ho)
interface SaleItem {
  [key: string]: any;
}

interface RootState {
  user: string;
  token: string | null;
  isLoggedIn: boolean;
  isfilter: Distributor | null;
  salesData: SaleItem[];
}

const initialState: RootState = {
  user: "chala",
  token: null,
  isLoggedIn: false,
  isfilter: null,
  salesData: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ user: string; token: string }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },

    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },

    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },

    setIsFilter: (state, action: PayloadAction<Distributor | null>) => {
      state.isfilter = action.payload;
    },

    setSalesData: (
      state,
      action: PayloadAction<{ distributor: Distributor; data: any[] }>,
    ) => {
      const { distributor, data } = action.payload;

      // ✅ flatten (nested arrays fix)
      const flatData = data.flat();

      // ✅ normalize + tag
      const formatted: SaleItem[] = flatData.map((item) => ({
        ...item,
        distributor,
        createdAt: Date.now(),
      }));

      // ✅ remove duplicates
      const newData = formatted.filter(
        (item) =>
          !state.salesData.some(
            (e) =>
              e["Item Description"] === item["Item Description"] &&
              e.distributor === item.distributor,
          ),
      );

      // ✅ merge
      state.salesData = [...state.salesData, ...newData];
    },

    // ✅ clear all data
    clearSalesData: (state) => {
      state.salesData = [];
    },
  },
});

export const { setUser, setToken, setIsLoggedIn, setIsFilter, setSalesData } =
  userSlice.actions;

export default userSlice.reducer;
