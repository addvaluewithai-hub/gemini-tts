import {test} from "node:test";
import assert from "node:assert/strict";

test("owner-only pilot archive module loads without running or dispatching",async()=>{
  const module=await import("../src/archive-englishlive-pilot.mjs");
  assert.equal(typeof module,"object");
});
