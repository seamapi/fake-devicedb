import { immer } from "zustand/middleware/immer"
import { createStore, type StoreApi } from "zustand/vanilla"
import { hoist } from "zustand-hoist"

import * as m from "lib/models.ts"

import type { Database, ZustandDatabase } from "./schema.ts"

export const createDatabase = (): ZustandDatabase => {
  return hoist<StoreApi<Database>>(createStore(initializer))
}

const initializer = immer<Database>((set, get) => ({
  _id: 0,
  things: [],
  vercel_protection_secret: "abc123",

  addThing(thing) {
    set((state) => {
      state._id++
    })
    const thingId = `thing_${get()._id}`

    set((state) => {
      state.things.push({
        ...m.thingInitializer.parse(thing),
        thingId,
      })
    })
    const newThing = get().things.find((v) => v.thingId === thingId)
    if (newThing == null) {
      throw new Error("Failed to find new thing in state")
    }
    return newThing
  },

  simulatePowerFailure(thingId) {
    set((state) => {
      const thing = state.things.find((t) => t.thingId === thingId)
      if (thing == null) {
        throw new Error(`Thing "${thingId}" not found`)
      }
      thing.status = "offline"
    })
  },

  update() {},
}))
