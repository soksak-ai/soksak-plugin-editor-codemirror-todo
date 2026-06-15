# Code Highlight+ (`soksak-plugin-code-highlight`)

A reference example plugin for editor extensions (CM6).

## What It Does

- Highlights `TODO` / `FIXME` / `XXX` tokens in all open files
  (semi-transparent background + outline based on the accent color — follows the current
  theme).
- Adds extension-to-syntax mappings: `.mjs`, `.cjs` → `js` (javascript), `.svelte` →
  html. Mappings are applied automatically through `contributes.languages` declarations
  in `plugin.json` alone — no code required.

No views, commands, or formatters. The entire implementation is a single global
CodeMirror extension registered via `app.editor.registerExtension` in `activate`.

## Permission Rationale

| Permission | Reason |
|------|------|
| `editor` | Required for CM6 extension registration (`registerExtension`) and `contributes.languages` syntax mapping |

No other permissions are declared — no file, network, or command access.

## Installation

```
sok plugin.install source=<user>/<repo-soksak-plugin-code-highlight>
# or via local path
sok plugin.install source=/path/to/examples/plugins/soksak-plugin-code-highlight
```

After installation, activate through the app's plugin screen after granting consent
(remote `plugin.enable` without recorded consent is rejected with `CONSENT_REQUIRED`).

## Usage

1. Once activated, the effect applies immediately to open editors — `TODO`/`FIXME`/`XXX`
   are highlighted, `.mjs`/`.cjs` files are treated as javascript, and `.svelte` is
   highlighted as html.
2. Deactivating removes the highlighting and syntax mappings immediately (the host
   automatically reclaims the registration).
3. Only word boundaries are matched, so identifiers like `TODOLIST` are not highlighted.
