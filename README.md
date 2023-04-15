# keychain-macos

> Set and Get Notes from the macOS keychain with the command line utility `security`.

**Requires the `--allow-env` and `--allow-run` flags**

## Usage

**NPM**
```js
import { deleteNote, getNoteTXT, setNote } from "keychain-macos"
```

**Deno**
```js
import { deleteNote, getNoteTXT, setNote } from 'https://deno.land/x/keychain_macos/mod.ts'
```

```js
await setNote({ name:"keychain-macos-test", data:{key: 1} });

const result = await getNoteTXT("keychain-macos-test");


await deleteNote("keychain-macos-test");
```

## API

### setNote({name,data},update)

Insert a new note to macOS keychain.

**name:** _string_ - Name of the item
**data:** _object_ | _string_ | _number_
**update:** _boolean_ - if update is true, an existing entry will be replaced - Default: FALSE

Objects are converted to JSON. String and Number will converted with `.toString()`

**Errors:**

* If you try to insert and update is FALSE and the note exists `Deno.errors.AlreadyExists`is thrown.

### getNoteTXT(name)

Find a Note with the name `name` in the macOS keychain. The data in the note is expected to be Text.

**Errors:**

* If a Note is not found a `Deno.errors.NotFound` is thrown.
### getNoteRTF(name)

Find a Note with the name `name` in the macOS keychain.
Data pasted into the keychain App is allways saved as RTF data und needs to be converted back to a text only representation.

**Errors:**

* If a Note is not found a `Deno.errors.NotFound` is thrown.

### deleteNote(name)

Delete a note by name.

**Errors:**

* If a Note is not found a `Deno.errors.NotFound` is thrown.

## Tipps

To avoid RTF when manual adding credentials you can use this simple bash script which will add the current content of the clippboard.


```sh
#!/bin/sh
notename="$1"
if [ -z $notename ]; then
echo ""
    echo "$0: <name of note> [-U]"
    echo "\tThe content of the clipboard will be used for the note body."
    echo "\t-U: with this an update of an existing note will fail"
    echo ""
    exit 1
fi
security add-generic-password -a $USER -s "$1" $2 -C note -X "$(pbpaste| xxd -ps -c 0)"
```

`pb2keychain.sh test66`

> will only create a note if the note does not exist - use `-U` to overwrite as existing note!

## Build for NPM

```sh
deno task npm:build <new version>
cd npm
npm publish
```

## Authors

[Andreas Heissenberger](https://github.com/aheissenberger)

## Version History

* 0.1.0
    * Initial Release
* 0.1.1
    * add Option `update` on `setNote()` to replace existing note
    * add Error handling
* 0.1.2-0.1.6
    * changes to publish on NPM
## License

This project is licensed under the "bsd-2-clause" License - see the LICENSE.txt file for details
