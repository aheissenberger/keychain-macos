# keychain-macos

> Set and Get Notes from the macOS keychain

**Requires the `--allow-env` and `--allow-run` flags**

## Usage

```js
import { deleteNote, getNoteTXT, setNote } from "https://raw.githubusercontent.com/aheissenberger/keychain-macos/master/src/keychain.ts"

await setNote({ name:"keychain-macos-test", data:{key: 1} });

const result = await getNoteTXT("keychain-macos-test");


await deleteNote("keychain-macos-test");
```

## API

### setNote({name,data})

Insert a new note to macOS keychain.

**name:** _string_ - Name of the item
**data:** _object_ | _string_ | _number_

Objects are converted to JSON. String and Number will converted with `.toString()`

### getNoteTXT(name)

Find a Note with the name `name` in the macOS keychain. The data in the note is expected to be Text.

### getNoteRTF(name)

Find a Note with the name `name` in the macOS keychain.
Data pasted into the keychain App is allways saved as RTF data und needs to be converted back to a text only representation.

## Tipps

To avoid RTF when manual adding credentials you can use this simple bash script which will add the current content of the clippboard.


```sh
#!/bin/sh
security add-generic-password -a $USER -s "$1" -C note -X $(pbpaste| xxd -p)
```

`pb2keychain.sh test66`

> will only create a note if the note does not exist - use `-U` to overwrite!

## Authors

[Andreas Heissenberger](https://github.com/aheissenberger)

## Version History

* 0.1
    * Initial Release

## License

This project is licensed under the "bsd-2-clause" License - see the LICENSE.txt file for details
