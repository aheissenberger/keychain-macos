import {
  decode as hexDecode,
  encode as hexEncode,
} from "https://deno.land/std@0.126.0/encoding/hex.ts";
import { decode as base64Decode } from "https://deno.land/std/encoding/base64.ts";

// security add-generic-password -a $USER -s keychain-macos-test-001 -C note -w "{key:1}"
export async function setNote(
  { name, data }: { name: string; data: object | string | number },
): Promise<void> {
  const dataSerialized = typeof data === "object"
    ? JSON.stringify(data)
    : data.toString();
  const p = Deno.run({
    cmd: [
      "security",
      "add-generic-password",
      "-a",
      Deno.env.get("USER") ?? "",
      "-s",
      name,
      "-C",
      "note",
    //   "-w",
    //   dataSerialized,
      "-X", new TextDecoder().decode(hexEncode(new TextEncoder().encode(dataSerialized))),
    ],
  });
  const { code } = await p.status();
  p.close();
}

async function getNote(name: string) {
  const p = Deno.run({
    cmd: [
      "security",
      "find-generic-password",
      "-C",
      "note",
      "-s",
      name,
      "-w",
    ],
    stdout: "piped",
  });
  const { code } = await p.status();
  const out = await p.output();
  p.close();
  return out;
}

export async function getNoteTXT(name: string) {
  const out = await getNote(name);
  return new TextDecoder().decode(out);
}

// security find-generic-password -C note -s keychain-macos-test-001 -w | xxd -r -p | xmllint --xpath "//dict/data/text()" - | base64 --decode | textutil -stdin -convert txt -stdout
export async function getNoteRTF(name: string) {
  const te = new TextDecoder();
  const out = await getNote(name);
  const outCleaned = out.filter((v) => v >= 48); // remove non hex characters like LF
  console.log(outCleaned);
  const xml = te.decode(hexDecode(outCleaned));
  const dataBase64 =
    xml.match(/<data>(?<data>[\sA-Za-z0-9]*)<\/data>/)?.groups?.data ?? "";
  const rtf = base64Decode(dataBase64);
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
  await p.stdin.write(rtf);
  await p.stdin.close();
  const { code } = await p.status();

  const outText = await p.output();
  p.close();
  return te.decode(outText);
}

// security delete-generic-password -s keychain-macos-test-001
export async function deleteNote(name: string): Promise<void> {
  const p = Deno.run({
    cmd: [
      "security",
      "delete-generic-password",
      "-C",
      "note",
      "-s",
      name,
    ],
    stdout: "null",
  });
  const { code } = await p.status();
  p.close();
}
