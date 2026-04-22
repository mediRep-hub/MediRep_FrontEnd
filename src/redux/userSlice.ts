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

interface SaleItem {
  [key: string]: any;
}

interface RootState {
  user: string;
  token: string | null; // JWT token
  fcmToken: string | null; // 🔥 ADD THIS (VERY IMPORTANT)
  isLoggedIn: boolean;
  isfilter: Distributor | null;
  salesData: SaleItem[];
}

const initialState: RootState = {
  user: "chala",
  token: null,
  fcmToken: null, // 🔥 ADD THIS
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

    // 🔥 ADD THIS REDUCER
    setFcmToken: (state, action: PayloadAction<string>) => {
      state.fcmToken = action.payload;
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

      const flatData = data.flat();

      const formatted: SaleItem[] = flatData.map((item) => ({
        ...item,
        distributor,
        createdAt: Date.now(),
      }));

      const newData = formatted.filter(
        (item) =>
          !state.salesData.some(
            (e) =>
              e["Item Description"] === item["Item Description"] &&
              e.distributor === item.distributor,
          ),
      );

      state.salesData = [...state.salesData, ...newData];
    },

    clearSalesData: (state) => {
      state.salesData = [];
    },
  },
});

export const {
  setUser,
  setToken,
  setIsLoggedIn,
  setIsFilter,
  setSalesData,
  setFcmToken, // 🔥 EXPORT THIS
} = userSlice.actions;

export default userSlice.reducer;
