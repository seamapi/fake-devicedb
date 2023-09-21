import type { HoistedStoreApi } from "zustand-hoist"

import type { Thing, ThingInitializer } from "lib/models.ts"

export interface DatabaseState {
  _id: number
  things: Thing[]
  vercel_protection_secret: string
}

export interface DatabaseMethods {
  addThing: (thing: ThingInitializer) => Thing
  simulatePowerFailure: (thingId: string) => void
  update: (t?: number) => void
}

export type Database = DatabaseState & DatabaseMethods

export type ZustandDatabase = HoistedStoreApi<Database>
