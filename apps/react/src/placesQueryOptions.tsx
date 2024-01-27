import { queryOptions } from "@tanstack/react-query";
import axios from "axios";

export const placesQueryOptions = queryOptions({
  queryKey: ["places"],
  queryFn: async () => {
    return axios.get<{ items: { id: string }[] }>("/places").then((r) => {
      return r.data;
    });
  },
});
