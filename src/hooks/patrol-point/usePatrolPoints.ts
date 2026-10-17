import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPatrolPoint,
  getPatrolPointById,
  getPatrolPoints,
} from "../../services/patrol-point/patrolPoint.service";
import type {
  CreatePatrolPointRequest,
  PatrolPointQuery,
} from "../../types/patrol-point/patrolPoint";

export const usePatrolPoints = (query?: PatrolPointQuery) => {
  return useQuery({
    queryKey: ["patrol-points", query],
    queryFn: () => getPatrolPoints(query),
  });
};
export const usePatrolPointsById = (id: string) => {
  return useQuery({
    queryKey: ["patrol-point", id],
    queryFn: () => getPatrolPointById(id),
    enabled: Boolean(id),
  });
};

export const useCreatePatrolPoint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePatrolPointRequest) =>
      createPatrolPoint(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["patrol-points"],
      });
    },
  });
};
