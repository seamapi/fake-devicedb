import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /v1/manufacturers/list", async (t: ExecutionContext) => {
  const { axios } = await getTestServer(t)
  const { data } = await axios.get("/v1/manufacturers/list")
  t.is(data.manufacturers.length, 1)
  t.is(data.manufacturers[0]?.device_model_count, 1)
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

test("GET /v1/manufacturers/list (filter by integration_support_levels)", async (t) => {
  const { axios } = await getTestServer(t)
  const { data } = await axios.get("/v1/manufacturers/list", {
    params: {
      integration_support_levels: ["planned"],
    },
  })
  t.is(data.manufacturers.length, 0)
})

// UPSTREAM: nextlove does not parse this as the empty array
// https://github.com/seamapi/nextlove/issues/77#issuecomment-1786284982
test.failing(
  "GET /v1/manufacturers/list (filter by integration_support_levels, empty list)",
  async (t) => {
    const { axios } = await getTestServer(t)
    const { data } = await axios.get("/v1/manufacturers/list", {
      params: {
        integration_support_levels: [],
      },
    })
    t.is(data.manufacturers.length, 0)
  },
)

test("GET /v1/manufacturers/list (filter by integration_support_levels, multi levels)", async (t) => {
  const { axios } = await getTestServer(t)
  const { data } = await axios.get("/v1/manufacturers/list", {
    params: {
      integration_support_levels: ["planned", "stable"],
    },
  })
  t.is(data.manufacturers.length, 1)
})
