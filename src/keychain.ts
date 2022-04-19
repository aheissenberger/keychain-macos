import {
  decode as hexDecode,
  encode as hexEncode,
} from "https://deno.land/std@0.126.0/encoding/hex.ts";
import { decode as base64Decode } from "https://deno.land/std@0.135.0/encoding/base64.ts";
import { assert } from "https://deno.land/std@0.135.0/testing/asserts.ts";

// security add-generic-password -a $USER -s keychain-macos-test-001 -C note -w "{key:1}"
export async function setNote(
  { name, data }: { name: string; data: object | string | number },
  update = false,
): Promise<void> {
  const dataSerialized = typeof data === "object"
    ? JSON.stringify(data)
    : data.toString();
  const cmd = [
    "security",
    "add-generic-password",
    "-a",
    Deno.env.get("USER") ?? "",
    "-s",
    name,
    "-C",
    "note",
    "-X",
    new TextDecoder().decode(
      hexEncode(new TextEncoder().encode(dataSerialized)),
    ),
  ];
  if (update) cmd.push("-U"); // Update item if it already exists (if omitted, the item cannot already exist)
  const p = Deno.run({
    cmd,
  });
  try {
    const status = await p.status();
    if (!status.success && status.code === 45) {
      throw new Deno.errors.AlreadyExists();
    }
    assert(status.success, `cmd security failed - code: ${status.code}`);
  } finally {
    p.close();
  }
}

async function getNote(name: string) {
  let out;
  const p = Deno.run({
    cmd: [
      "security",
      "-q",
      "find-generic-password",
      "-C",
      "note",
      "-s",
      name,
      "-w",
    ],
    stdout: "piped",
  });
  try {
    const status = await p.status();
    if (!status.success && status.code === 44) {
      throw new Deno.errors.NotFound();
    }
    assert(status.success, `cmd security failed - code: ${status.code}`);
  } finally {
    out = await p.output();
    p.close();
  }

  return out;
}

export async function getNoteTXT(name: string) {
  const out = await getNote(name);
  return new TextDecoder().decode(out);
}

export async function getNoteHEX(name: string) {
  const out = await getNote(name);
  const outCleaned = out.filter((v) => v >= 48); // remove non hex characters like LF
  const text = new TextDecoder().decode(hexDecode(outCleaned));
  return text;
}

// security find-generic-password -C note -s keychain-macos-test-001 -w | xxd -r -p | xmllint --xpath "//dict/data/text()" - | base64 --decode | textutil -stdin -convert txt -stdout
export async function getNoteRTF(name: string) {
  const te = new TextDecoder();
  const out = await getNote(name);
  const outCleaned = out.filter((v) => v >= 48); // remove non hex characters like LF
  const xml = te.decode(hexDecode(outCleaned));
  const dataBase64 =
    xml.match(/<data>(?<data>[\sA-Za-z0-9]*)<\/data>/)?.groups?.data ?? "";
  const rtf = base64Decode(dataBase64);
  let outText;
  const p = Deno.run({
    cmd: [
      "textutil",
      "-stdin",
      "-convert",
      "txt",
      "-stdout",
    ],
    stdin: "piped",
    stdout: "piped",
  });
  try {
    await p.stdin.write(rtf);
    await p.stdin.close();
    const status = await p.status();
    assert(status.success, `cmd textutil failed - code: ${status.code}`);
  } finally {
    outText = await p.output();
    p.close();
  }
  return te.decode(outText);
}

// security delete-generic-password -s keychain-macos-test-001
export async function deleteNote(name: string): Promise<void> {
  const p = Deno.run({
    cmd: [
      "security",
      "-q",
      "delete-generic-password",
      "-C",
      "note",
      "-s",
      name,
    ],
    stdout: "null",
  });
  try {
    const status = await p.status();
    if (!status.success && status.code === 44) {
      throw new Deno.errors.NotFound();
    }
    assert(status.success, `cmd security failed - code: ${status.code}`);
  } finally {
    p.close();
  }
}
