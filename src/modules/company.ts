import type { Rng } from "@/core/rng";

import { fromArray } from "@/core/utils";
import names from "@/data/pt-BR/company/names.json";

export function createCompanyDomain(rng: Rng) {
  const name = fromArray(rng, names);

  return { name };
}
