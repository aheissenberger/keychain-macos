import {
  afterEach,
  beforeEach,
  describe,
  it,
} from "https://deno.land/std@0.135.0/testing/bdd.ts";

import {
  assertEquals,
  assertRejects,
} from "https://deno.land/std@0.135.0/testing/asserts.ts";

import { deleteNote, getNoteTXT, setNote } from "./mod.ts";
describe("keychain", () => {
  const name = "keychain-macos-test-001";
  afterEach(async () => {
    try {
      await deleteNote(name);
      // deno-lint-ignore no-empty
    } catch (_e) {}
  });

  it("create note", async () => {
    const data = { key: "keychain-macos-test-001" };
    const expected = JSON.stringify(data) + "\n";

    await setNote({ name, data });

    const result = await getNoteTXT(name);
    assertEquals(result, expected);
  });
});

Deno.test("keychain / getNote / fail to finde note", async () => {
  const name = "keychain-macos-test-001";
  await assertRejects(
    () => {
      return getNoteTXT(name);
    },
    Deno.errors.NotFound,
  );
});

Deno.test("keychain / deleteNote / fail to finde note", async () => {
  const name = "keychain-macos-test-001";
  await assertRejects(
    () => {
      return deleteNote(name);
    },
    Deno.errors.NotFound,
  );
});

describe("keychain / create note / fail on existing note", () => {
  const name = "keychain-macos-test-001";

  const data = { key: "keychain-macos-test-001" };

  beforeEach(async () => {
    await setNote({ name, data });
  });

  afterEach(async () => {
    try {
      await deleteNote(name);
      // deno-lint-ignore no-empty
    } catch (_e) {}
  });

  it("set note", async () => {
    await assertRejects(
      () => {
        return setNote({ name, data });
      },
      Deno.errors.AlreadyExists,
    );
  });
});

describe("keychain", () => {
  const name = "keychain-macos-test-001";

  const data = { key: "keychain-macos-test-001" };

  beforeEach(async () => {
    await setNote({ name, data });
  });

  afterEach(async () => {
    try {
      await deleteNote(name);
      // deno-lint-ignore no-empty
    } catch (_e) {}
  });

  it("update note", async () => {
    const expected = JSON.stringify(data) + "\n";
    const result = await getNoteTXT(name);
    assertEquals(result, expected);

    const data1 = { key: "keychain-macos-test-001-1" };
    const expected1 = JSON.stringify(data1) + "\n";

    await setNote({ name, data: data1 }, true);

    const result1 = await getNoteTXT(name);
    assertEquals(result1, expected1);
  });
});
