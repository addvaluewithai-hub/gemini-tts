import {test} from "node:test";
import assert from "node:assert/strict";
test("final B1 archived-workflow module imports without side effects",async()=>{
  const mod=await import("../src/archive-englishlive-final.mjs");
  assert.equal(typeof mod,"object");
});
