# soksak-plugin-editor-codemirror-todo

A CodeMirror extension for soksak: highlights `TODO` / `FIXME` / `XXX` tokens and maps a
few extensions to syntax modes. It is an extension of `soksak-plugin-editor-codemirror`,
not a standalone plugin.

## What It Does

- Highlights `TODO` / `FIXME` / `XXX` tokens in all open files (semi-transparent background
  + outline from the accent color — follows the current theme).
- Maps extensions to syntax modes: `.mjs`, `.cjs` → `js`, `.svelte` → `html`.

The engine is owned by `soksak-plugin-editor-codemirror` (engine neutrality, contract A13).
This plugin registers through the editor's extension protocol on `app.bus`
(`editor.ext.register` with a CodeMirror extension built from the modules handed over in
the `editor.ext.ready` payload; a `hello`→`ready` handshake covers activation order).

## Dependencies

`soksak-plugin-editor-codemirror` — provides the CodeMirror engine, modules, and the
extension protocol. The skeleton resolves this dependency when this plugin is enabled.

## Permissions

None. The extension protocol rides on `app.bus` (plugin-to-plugin pub/sub), which needs no
permission.

## Usage

1. Enable `soksak-plugin-editor-codemirror` (auto-resolved as a dependency) and this plugin.
2. Open any file — `TODO`/`FIXME`/`XXX` are highlighted; `.mjs`/`.cjs` are treated as
   JavaScript, `.svelte` as HTML. Only word boundaries match (so `TODOLIST` is not hit).
3. Disabling removes the highlighting and mappings immediately.
