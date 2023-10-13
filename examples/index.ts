#!/usr/bin/env tsx

import landlubber from "landlubber"

import * as databaseSample from "./database-sample.ts"
import * as seedFromApi from "./seed-from-api.ts"

const commands = [databaseSample, seedFromApi]

await landlubber(commands).parse()
