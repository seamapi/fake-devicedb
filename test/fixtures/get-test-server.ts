import type { ExecutionContext } from "ava"
import type { Axios } from "axios"
import type { NextApiRequest } from "next"
import type { TypedAxios } from "typed-axios-instance"

import type { Database, Routes } from "@seamapi/fake-devicedb"

import getServerFixture from "nsm/get-server-fixture.ts"
import type { NextApiHandler, NextApiResponse } from "nsm/types/nextjs.ts"

import { type DatabaseFixture, getTestDatabase } from "./get-test-database.ts"

export type { SimpleAxiosError } from "nsm/get-server-fixture.ts"

type GetServerFixture = typeof getServerFixture.default

type ServerFixture<TSeed = true> = DatabaseFixture<TSeed> &
  Omit<Awaited<ReturnType<GetServerFixture>>, "axios"> & {
    axios: TypedAxios<Routes>
    get: Axios["get"]
  }

interface ApiRequest extends NextApiRequest {
  db?: Database | undefined
}

export const getTestServer = async <TSeed extends boolean>(
  t: ExecutionContext,
  { seed: willSeed }: { seed?: TSeed } = {},
): Promise<ServerFixture<TSeed>> => {
  const { db, seed } = await getTestDatabase(t, {
    seed: willSeed ?? true,
  })

  const fixture = await (getServerFixture as unknown as GetServerFixture)(t, {
    middlewares: [
      (next: NextApiHandler) => (req: ApiRequest, res: NextApiResponse) => {
        req.db = db
        return next(req, res)
      },
    ],
  })

  fixture.axios.defaults.headers.common["x-vercel-protection-bypass"] =
    db.vercel_protection_bypass_secret

  return {
    ...fixture,
    // @ts-expect-error Current version of axios has upstream type issue.
    get: fixture.axios.get.bind(fixture.axios),
    db,
    seed: seed as any,
  }
}
