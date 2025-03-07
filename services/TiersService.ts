'use server';

import { addTiers, getAllTiers, updateTier, deleteTier } from '@/lib/db/tiers';

export const fetchTiers = async () => {
  return await getAllTiers();
};

export const createTiers = async (data: {
  code: number;
  libelle: string;
  class: string;
  compteCollectif?: number;
}) => {
  return await addTiers(data);
};

export const modifyTier = async (
  id: number,
  data: Partial<{
    code: number;
    libelle: string;
    class: string;
    compteCollectif?: number;
  }>
) => {
  return await updateTier(id, data);
};

export const removeTier = async (id: number) => {
  return await deleteTier(id);
};
