import { create } from "zustand";
import Cookies from "js-cookie";

export type AuthProps = {
  type: string;
  exp: string;
};

type ProductStore = {
  token: string;
  data?: AuthProps;
  setToken: (value: string) => void;
};

const useAuthStore = create<ProductStore>((set, get) => ({
  token: "",
  setToken: (value) => {
    set({
      token: value,
    });
    Cookies.set("token", value);
  },
  getToken: () => {
    const token = Cookies.get("token");
    set({
      token,
    });
  },
}));

export default useAuthStore;
