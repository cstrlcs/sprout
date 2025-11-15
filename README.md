# Sprout

Fake data generator with seed support. WIP.

## Usage

```typescript
import { sprout } from "sprout";

xsprout.person.name();       // "João"
sprout.person.fullName();    // "Maria Silva"
sprout.address.cityName();   // "São Paulo"
sprout.company.name();       // "Tech Solutions Ltda"

// Use with seed for consistent results
sprout(12345);
sprout.person.name();        // Always returns the same name

// Generate arrays
sprout.from(3, () => sprout.person.name());  // ["Ana", "Carlos", "Lucia"]
```

## Roadmap

More languages will be supported in the future.

## Credits

Inspired by [Faker.js](https://github.com/faker-js/faker) and [Falso](https://github.com/ngneat/falso).

Mulberry32 PRNG implementation from [cprosche/mulberry32](https://github.com/cprosche/mulberry32).