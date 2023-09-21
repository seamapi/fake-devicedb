import test from "ava"

import { seedDatabase } from "@seamapi/fake-devicedb"

import { getTestServer } from "fixtures/get-test-server.ts"

test("seed database", async (t) => {
  const { db } = await getTestServer(t, { seed: false })
  t.notThrows(() => {
    seedDatabase(db)
  })
})
