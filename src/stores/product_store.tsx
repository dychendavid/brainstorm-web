import { create } from "zustand";
import Cookies from "js-cookie";

export type ProductProps = {
  name?: string;
  intro?: string;
  updatedAt?: string;
};

type ProductStore = {
  data?: ProductProps;
  isLoadedFromCookie: boolean;
  setName: (value: string) => void;
  setIntro: (value: string) => void;
  clearUpdatedAt: () => void;
  loadFromCookies: () => void;
  _backupToCookie: (key: string, value: string) => void;
};

const PREFIX = "product_store";

const useProductStore = create<ProductStore>((set, get) => ({
  isLoadedFromCookie: false,
  clearUpdatedAt: () => {
    const state = get();
    delete state.data.updatedAt;
    set((state) => ({
      ...state,
    }));
    Cookies.remove(`${PREFIX}.updated_at`);
  },
  setName: (value) => {
    set((state) => ({
      data: {
        ...state.data,
        name: value,
        updatedAt: new Date().toISOString(),
      },
    }));

    get()._backupToCookie("name", value);
  },
  setIntro: (value) => {
    set((state) => ({
      data: {
        ...state.data,
        intro: value,
        updatedAt: new Date().toISOString(),
      },
    }));

    get()._backupToCookie("intro", value);
  },
  loadFromCookies() {
    set({
      ...get(),
      data: {
        name: Cookies.get(`${PREFIX}.name`),
        intro: Cookies.get(`${PREFIX}.intro`),
        updatedAt: Cookies.get(`${PREFIX}.updated_at`),
      },
      isLoadedFromCookie: true,
    });

    console.log("cookies", Cookies.get());
    console.log("data", get().data);
  },
  _backupToCookie: (key: string, value: string) => {
    Cookies.set(`${PREFIX}.${key}`, value);
    Cookies.set(`${PREFIX}.updated_at`, new Date().toISOString());
  },
}));

export default useProductStore;
