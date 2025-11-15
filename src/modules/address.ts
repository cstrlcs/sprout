import type { Rng } from "../core/rng";

import cities from "@/data/pt-BR/address/cities.json";
import codes from "@/data/pt-BR/address/codes.json";
import countries from "@/data/pt-BR/address/countries.json";
import states from "@/data/pt-BR/address/states.json";
import streets from "@/data/pt-BR/address/streets.json";

import { fromArray, fromFactory, int } from "../core/utils";

export function createAddressDomain(rng: Rng) {
  const buildingNumber = fromFactory(() => String(int(rng, 1, 3999)));
  const cityName = fromArray(rng, cities);
  const countryCode = fromArray(rng, codes);
  const countryName = fromArray(rng, countries);
  const postalCode = fromFactory(() => `${int(rng, 10_000, 99_999)}-${int(rng, 100, 999)}`);
  const stateName = fromArray(rng, states);
  const streetAddress = fromArray(rng, streets);

  const fullAddress = fromFactory(
    () => `${buildingNumber()} ${streetAddress()}, ${cityName()}, ${stateName()} ${postalCode()}`,
  );

  return {
    streetAddress,
    buildingNumber,
    postalCode,
    cityName,
    stateName,
    countryName,
    countryCode,
    fullAddress,
  };
}
