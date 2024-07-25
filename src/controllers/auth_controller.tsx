import { API } from "@/configs/api";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import applyCaseMiddleware from "axios-case-converter";

const useAuthController = () => {
  const { data: auth } = useQuery({
    queryKey: [API.AUTHORIZE],
    queryFn: () => {
      const client = applyCaseMiddleware(axios.create());
      return client.post(API.AUTHORIZE).then((res) => res.data);
    },
  });

  return {
    auth,
  };
};

export default useAuthController;
