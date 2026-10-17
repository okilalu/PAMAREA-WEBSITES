import { apiClient } from "../../lib/apiClient";

import type {
  PatrolRound,
  PatrolRoundListResponse,
  PatrolRoundQuery,
  StartPatrolRoundResponse,
} from "../../types/patrol/patrol-round";

// Mengambil daftar ronde patroli
export const getPatrolRounds = async (
  params?: PatrolRoundQuery,
): Promise<PatrolRoundListResponse> => {
  const response = await apiClient.get<PatrolRoundListResponse>(
    "/patrol-rounds",
    { params },
  );

  return response.data;
};

// Mengambil detail ronde patroli
export const getPatrolRoundById = async (
  roundId: string,
): Promise<PatrolRound> => {
  const response = await apiClient.get<PatrolRound>(
    `/patrol-rounds/${roundId}`,
  );

  return response.data;
};

// Memulai ronde patroli
export const startPatrolRound = async (
  roundId: string,
): Promise<StartPatrolRoundResponse> => {
  const response = await apiClient.post<StartPatrolRoundResponse>(
    `/patrol-rounds/${roundId}/start`,
  );

  return response.data;
};
