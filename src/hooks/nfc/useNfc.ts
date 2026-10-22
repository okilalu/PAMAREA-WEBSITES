import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createNfcTag,
  getNfcTagById,
  getNfcTags,
} from "../../services/nfc/nfc.service";
import type { CreateNfcTagRequest, NfcTagQuery } from "../../types/nfc/nfc";

export const useNfcTags = (query?: NfcTagQuery) => {
  return useQuery({
    queryKey: ["nfc-tags", query],
    queryFn: () => getNfcTags(query),
  });
};
export const useNfcTagsById = (id: string) => {
  return useQuery({
    queryKey: ["nfc-tag", id],
    queryFn: () => getNfcTagById(id),
    enabled: Boolean(id),
  });
};

export const useCreateNfcTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateNfcTagRequest) => createNfcTag(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["nfc-tags"],
      });
    },
  });
};
