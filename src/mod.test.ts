import { assertEquals } from "https://deno.land/std@0.127.0/testing/asserts.ts";

import { deleteNote, getNoteTXT, setNote } from "./mod.ts";
Deno.test("keychain", async () => {
  const name = "keychain-macos-test-001";

  const data = {key:"keychain-macos-test-001"};
  const expected = JSON.stringify(data) + "\n";

  await setNote({ name, data });

  const result = await getNoteTXT(name);
  assertEquals(result, expected);

  await deleteNote(name);

  const result2 = await getNoteTXT(name);
  assertEquals(result2, "");
});
