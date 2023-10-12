import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /v1/device_models/get", async (t: ExecutionContext) => {
  const {
    axios,
    seed: { device_model },
  } = await getTestServer(t)

  const { data } = await axios.get("/v1/device_models/get", {
    params: {
      device_model_id: device_model.device_model_id,
    },
  })

  t.is(data.device_model.device_model_id, device_model.device_model_id)
})
