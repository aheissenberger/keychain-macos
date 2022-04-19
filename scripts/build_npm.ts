import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./src/mod.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: true,
    //undici: true,
  },
  package: {
    // package.json properties
    name: "keychain-macos",
    version: Deno.args[0],
    description: "create, manipulate macOS keychain notes entries",
    keywords: ['macos','osx','mac','keychain','password'],
    license: "bsd-2-clause",
    author: "andreas@heissenberger.at",
    homepage: "https://github.com/aheissenberger/keychain-macos",
    repository: {
      type: "git",
      url: "git+https://github.com/aheissenberger/keychain-macos.git",
    },
    bugs: {
      url: "https://github.com/aheissenberger/keychain-macos/issues",
    },
  },
});

// post build steps
Deno.copyFileSync("LICENSE.txt", "npm/LICENSE.txt");
Deno.copyFileSync("README.md", "npm/README.md");
