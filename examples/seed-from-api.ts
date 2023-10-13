import { writeFile } from "node:fs/promises"
import { dirname } from "node:path"

import axios from "axios"
import type { Builder, Command, Describe, Handler } from "landlubber"
import { mkdirp } from "mkdirp"

import { createFake, seedDatabaseFromApi } from "@seamapi/fake-devicedb"

interface Options {
  vercelProtectionBypassSecret: string
  outfile: string
}

export const command: Command = "seed-from-api vercelProtectionBypassSecret"

export const describe: Describe = "Seed fake database from Devicedb API."

export const builder: Builder = {
  vercelProtectionBypassSecret: {
    type: "string",
    description: "Vercel protection bypass secret",
  },
  outfile: {
    type: "string",
    default: "tmp/db.json",
    description: "Where to save the sample database",
  },
}

export const handler: Handler<Options> = async ({
  vercelProtectionBypassSecret,
  outfile,
  logger,
}) => {
  const fake = await createFake()

  const client = axios.create({
    baseURL: "https://devicedb.seam.tube",
    headers: {
      "x-vercel-protection-bypass": vercelProtectionBypassSecret,
    },
  })

  await seedDatabaseFromApi(fake.database, client)
  const state = await fake.toJSON()
  logger.info(state, "Database State")
  await mkdirp(dirname(outfile))
  await writeFile(outfile, JSON.stringify(state, null, 2))
  logger.info({ outfile }, "Database Written")
}
