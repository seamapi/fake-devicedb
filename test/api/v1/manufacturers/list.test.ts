import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /v1/manufacturers/list", async (t: ExecutionContext) => {
  const { axios } = await getTestServer(t)
  const { data } = await axios.get("/v1/manufacturers/list")
  t.is(data.manufacturers.length, 1)
})

test("GET /v1/manufacturers/list (filter by integration status)", async (t: ExecutionContext) => {
  const { axios } = await getTestServer(t)
  const { data } = await axios.get("/v1/manufacturers/list", {
    params: {
      integration_status: "planned",
    },
  })
  t.is(data.manufacturers.length, 0)
})

test("GET /v1/manufacturers/list (filter by liqe_query)", async (t: ExecutionContext) => {
  const { axios } = await getTestServer(t)
  const { data } = await axios.get("/v1/manufacturers/list", {
    params: {
      liqe_query: "display_name:seam",
    },
  })
  t.is(data.manufacturers.length, 1)
})
