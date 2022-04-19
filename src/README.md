# keychain-macos

> Set and Get Notes from the macOS keychain with the command line utility `security`.

**Requires the `--allow-env` and `--allow-run` flags**

## Usage

```js
import { deleteNote, getNoteTXT, setNote } from 'https://deno.land/x/keychain_macos/mod.ts';"

await setNote({ name:"keychain-macos-test", data:{key: 1} });

const result = await getNoteTXT("keychain-macos-test");


await deleteNote("keychain-macos-test");
```

##Full Documentation##
https://github.com/aheissenberger/keychain-macos