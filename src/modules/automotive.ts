import type { Rng } from "@/core/rng";

import { fromArray } from "@/core/utils";
import brands from "@/data/pt-BR/automotive/brands.json";
import models from "@/data/pt-BR/automotive/models.json";
import services from "@/data/pt-BR/automotive/services.json";

export function createAutomotiveDomain(rng: Rng) {
  const brand = fromArray(rng, brands);
  const model = fromArray(rng, models);
  const service = fromArray(rng, services);

  return { brand, model, service };
}
