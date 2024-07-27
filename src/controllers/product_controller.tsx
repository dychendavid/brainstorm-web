import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { WizardAnswerProps } from "@/stores/script_store";
import { ProductProps } from "@/stores/product_store";
import _ from "lodash";
import applyCaseMiddleware from "axios-case-converter";
import useAuthStore from "@/stores/auth_store";
import { API } from "@/configs/api";

const useProductController = (productId?: string) => {
  const authStore = useAuthStore();

  const { data: available } = useQuery({
    queryKey: [API.PRODUCT_AVAILABLE],
    queryFn: () => {
      const client = applyCaseMiddleware(axios.create());
      return client.get(API.PRODUCT_AVAILABLE).then((res) => res.data);
    },
    enabled: !productId,
  });

  const { data: product, refetch: refetchProduct } = useQuery<ProductProps>({
    queryKey: ["GET_PRODUCTS"],
    queryFn: () => {
      const client = applyCaseMiddleware(axios.create());
      return client.get(`${API.PRODUCTS}/${productId}`).then((res) => res.data);
    },
    enabled: !!productId,
  });

  const askAiMutation = useMutation({
    mutationFn: (answer: WizardAnswerProps) => {
      const client = applyCaseMiddleware(axios.create());
      return client
        .post(`${API.PRODUCT_GPT}/${productId}`, answer, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        })
        .then((res) => res.data);
    },
  });

  const saveMutation = useMutation({
    mutationFn: (form: ProductProps) => {
      const client = applyCaseMiddleware(axios.create());
      return client
        .put(`${API.PRODUCTS}/${productId}`, form, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        })
        .then((res) => res.data);
    },
  });

  return {
    available,
    product,
    refetchProduct,
    askAiMutation,
    saveMutation,
  };
};

export default useProductController;
