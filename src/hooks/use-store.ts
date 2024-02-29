import { Color } from "antd/es/color-picker";
import { Models } from "appwrite";
import axios from "axios";
import { Dayjs } from "dayjs";
import toast from "react-hot-toast";
import { create } from "zustand";

export interface Charge extends Models.Document {
  amount: number;
  category: string;
  note: string;
  date: Date | Dayjs | string;
}

export type ChargeForm = Pick<Charge, "amount" | "category" | "date" | "note">;

export interface Category extends Models.Document {
  name: string;
  color: string;
  icon?: string;
}

interface GlobalState {
  closeModal: boolean;
  charges: {
    loading: boolean;
    list: Charge[];
    selected: Charge | null;
  };
  category: {
    loading: boolean;
    list: Category[];
    selected: Category | null;
  };
}

const initialState = {
  closeModal: true,
  charges: {
    loading: false,
    list: [],
    selected: null,
  },
  category: {
    loading: false,
    list: [],
    selected: null,
  },
};

interface GlobalAction {
  loadCategories: () => Promise<void>;
  loadCharges: () => Promise<void>;
  addCategory: (values: { name: string; color: Color }) => Promise<void>;
  addCharge: (values: ChargeForm) => Promise<void>;
  updateCategory: (values: {
    name: string;
    color: Color | string;
  }) => Promise<void>;
  updateCharge: (values: ChargeForm) => Promise<void>;
  deleteCategory: () => Promise<void>;
  deleteCharge: () => Promise<void>;
  selectCharge: (data: Charge) => void;
  selectCategory: (data: Category) => void;
}

export const useStore = create<GlobalState & GlobalAction>((set, get) => ({
  ...initialState,
  addCategory: async (values: { name: string; color: Color }) => {
    const formData = {
      name: values.name.trim(),
      color: values.color.toHexString(),
    };
    const list = get().category.list;
    const sameName = list.find((cat) => cat.name == formData.name);
    const sameColor = list.find((cat) => cat.color == formData.color);
    if (sameColor != undefined) {
      toast.error(
        "Category with same color already exist. Consider changing to avoid confusion.",
      );
    } else if (sameName != undefined) {
      toast.error(
        "Category with same name already exist. Consider changing to avoid confusion.",
      );
    } else {
      set((state) => ({
        ...state,
        category: { ...state.category, loading: true },
      }));
      const { data } = await toast.promise(
        axios.post(`/api/category`, formData),
        {
          loading: `Saving ${values.name}  ... `,
          success: `${values.name} saved`,
          error: (err) => {
            set((state) => ({
              ...state,
              category: { ...state.category, loading: false },
            }));
            return "Something went wrong.";
          },
        },
      );
      if (data != null) {
        list.push(data);
      }
      set((state) => ({
        ...state,
        category: { ...state.category, list, loading: false },
      }));
    }
  },
  loadCategories: async () => {
    const list: Category[] = [];
    set((state) => ({
      ...state,
      category: { ...state.category, loading: true },
    }));
    const { data } = await toast.promise(
      axios.get(`/api/category`),
      {
        loading: `Loading categories  ... `,
        success: `Categories loaded`,
        error: (err) => {
          set((state) => ({
            ...state,
            category: { ...state.category, loading: false },
          }));
          return "Something went wrong.";
        },
      },
      { duration: 2000 },
    );
    if (data != null) {
      list.push(...data.documents);
    }
    set((state) => ({
      ...state,
      category: { ...state.category, loading: false, list },
    }));
  },
  updateCategory: async (values: { name: string; color: Color | string }) => {
    const category = get().category;
    const formData = {
      id: category.selected?.$id,
      name: values.name.trim(),
      color:
        typeof values.color == "string"
          ? values.color
          : values.color.toHexString(),
    };
    const sameName = category.list.find(
      (cat) => cat.name == formData.name && category.selected?.$id != cat.$id,
    );
    const sameColor = category.list.find(
      (cat) => cat.color == formData.color && category.selected?.$id != cat.$id,
    );
    if (
      category.selected?.name == formData.name &&
      category.selected.color == formData.color
    ) {
      toast.success(`${values.name} saved`);
      set((state) => ({
        ...state,
        closeModal: !state.closeModal,
        category: { ...state.category, selected: null },
      }));
    } else if (sameColor != undefined) {
      toast.error(
        "Category with same color already exist. Consider changing to avoid confusion.",
      );
    } else if (sameName != undefined) {
      toast.error(
        "Category with same name already exist. Consider changing to avoid confusion.",
      );
    } else {
      set((state) => ({
        ...state,
        category: { ...state.category, loading: true },
      }));
      const { data } = await toast.promise(
        axios.patch(`/api/category`, formData),
        {
          loading: `Saving ${values.name}  ... `,
          success: `${values.name} saved`,
          error: (err) => {
            set((state) => ({
              ...state,
              category: { ...state.category, loading: false },
            }));
            return "Something went wrong.";
          },
        },
      );
      if (data != null) {
        const index = category.list.findIndex(
          (cat) => cat.$id == category.selected?.$id,
        );
        if (index > -1) {
          category.list[index] = data;
          category.selected = null;
        }
      }
      category.loading = false;
      set((state) => ({ ...state, category }));
    }
  },
  deleteCategory: async () => {
    const category = get().category;
    set((state) => ({
      ...state,
      category: { ...state.category, loading: true },
    }));
    const { data } = await toast.promise(
      axios.delete(`/api/category`, { data: { id: category.selected?.$id } }),
      {
        loading: `Deleting ${category.selected?.name}  ... `,
        success: `${category.selected?.name} deleted`,
        error: (err) => {
          set((state) => ({
            ...state,
            category: { ...state.category, loading: false },
          }));
          return "Something went wrong.";
        },
      },
    );
    if (data != null) {
      const index = category.list.findIndex(
        (cat) => cat.$id == category.selected?.$id,
      );
      if (index > -1) {
        category.list.splice(index, 1);
        category.selected = null;
      }
    }
    category.loading = false;
    set((state) => ({ ...state, category }));
  },
  selectCategory: (data: Category) => {
    set((state) => ({
      ...state,
      category: { ...state.category, selected: data },
    }));
  },

  addCharge: async (
    values: Pick<Charge, "amount" | "category" | "date" | "note">,
  ) => {
    const list = get().charges.list;
    set((state) => ({
      ...state,
      charges: { ...state.charges, loading: true },
    }));
    const { data } = await toast.promise(
      axios.post(`/api/charges`, {
        ...values,
        date: (values.date as Dayjs).toDate().toISOString(),
      }),
      {
        loading: `Adding charge  ... `,
        success: `Charge added`,
        error: (err) => {
          set((state) => ({
            ...state,
            category: { ...state.category, loading: false },
          }));
          return "Something went wrong.";
        },
      },
    );
    if (data != null) {
      list.push(data);
    }
    set((state) => ({
      ...state,
      charges: { ...state.charges, list, loading: false },
    }));
  },
  loadCharges: async () => {
    const list: Charge[] = [];
    set((state) => ({
      ...state,
      charges: { ...state.charges, loading: true },
    }));
    const { data } = await toast.promise(
      axios.get(`/api/charges`),
      {
        loading: `Loading charges  ... `,
        success: `Charges loaded`,
        error: (err) => {
          set((state) => ({
            ...state,
            category: { ...state.category, loading: false },
          }));
          return "Something went wrong.";
        },
      },
      { duration: 2000 },
    );
    if (data != null) {
      list.push(...data.documents);
    }
    set((state) => ({
      ...state,
      charges: { ...state.charges, loading: false, list },
    }));
  },
  updateCharge: async (
    values: Pick<Charge, "amount" | "category" | "date" | "note">,
  ) => {
    const charges = get().charges;
    set((state) => ({
      ...state,
      charges: { ...state.charges, loading: true },
    }));
    const { data } = await toast.promise(
      axios.patch(`/api/charges`, { ...values, id: charges.selected?.$id }),
      {
        loading: `Saving charge  ... `,
        success: `Charge saved`,
        error: (err) => {
          set((state) => ({
            ...state,
            category: { ...state.category, loading: false },
          }));
          return "Something went wrong.";
        },
      },
    );
    if (data != null) {
      const index = charges.list.findIndex(
        (charge) => charge.$id == charges.selected?.$id,
      );
      if (index > -1) {
        charges.list[index] = data;
        charges.selected = null;
      }
    }
    charges.loading = false;
    set((state) => ({ ...state, charges }));
  },
  deleteCharge: async () => {
    const charges = get().charges;
    set((state) => ({
      ...state,
      category: { ...state.category, loading: true },
    }));
    const { data } = await toast.promise(
      axios.delete(`/api/charges`, { data: { id: charges.selected?.$id } }),
      {
        loading: `Deleting charge ... `,
        success: `Charge deleted`,
        error: (err) => {
          set((state) => ({
            ...state,
            category: { ...state.category, loading: false },
          }));
          return "Something went wrong.";
        },
      },
    );
    if (data != null) {
      const index = charges.list.findIndex(
        (cat) => cat.$id == charges.selected?.$id,
      );
      if (index > -1) {
        charges.list.splice(index, 1);
        charges.selected = null;
      }
    }
    charges.loading = false;
    set((state) => ({ ...state, charges }));
  },
  selectCharge: (data: Charge) => {
    set((state) => ({
      ...state,
      charges: { ...state.charges, selected: data },
    }));
  },
}));
