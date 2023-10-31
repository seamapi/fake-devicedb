import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /v1/manufacturers/get", async (t: ExecutionContext) => {
  const {
    axios,
    seed: { manufacturer },
  } = await getTestServer(t)

  const { data } = await axios.get("/v1/manufacturers/get", {
    params: {
      manufacturer_id: manufacturer.manufacturer_id,
    },
  })

  t.is(data.manufacturer.manufacturer_id, manufacturer.manufacturer_id)
  t.is(data.manufacturer.device_model_count, 1)
})
