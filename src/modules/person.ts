import type { Rng } from "@/core/rng";

import { fromArray, fromFactory } from "@/core/utils";
import lastNames from "@/data/pt-BR/person/lastNames.json";
import names from "@/data/pt-BR/person/names.json";

export function createPersonDomain(rng: Rng) {
  const name = fromArray(rng, names);
  const lastName = fromArray(rng, lastNames);

  const fullName = fromFactory(
    () => `${name()} ${lastName()}`,
  );

  return { name, lastName, fullName };
}
