# Clipanki (Clipboard to ankideck)
> WIP electron application that listens the clipboard and exports it as an anki deck.

## Features
* Listen to text contents on clipboard and save it into a card
* Take screenshots and use it on the card
* Record audio and use it on the card **Windows only**
* Manually add a card
* Export the cards created on the app into an anki deck

## Download
### Windows
[Download](https://github.com/DarylSerrano/clipboard-to-ankideck/releases/download/0.1.0-pre/Clipboard.to.anki.deck-0.1.0-pre-win.zip)
### Linux
[Download](https://github.com/DarylSerrano/clipboard-to-ankideck/releases/download/0.1.0-pre/clipboard-to-ankideck-0.1.0-pre-linux.zip)

## Development Scripts

```bash
# install dependencies
yarn

# run application in development mode
yarn dev

# compile source code and create webpack output
yarn compile

# `yarn compile` & create build with electron-builder
yarn dist

# `yarn compile` & create unpacked build with electron-builder
yarn dist:dir
```

## License
[Apache License 2.0](https://github.com/DarylSerrano/clipboard-to-ankideck/blob/master/LICENSE)
