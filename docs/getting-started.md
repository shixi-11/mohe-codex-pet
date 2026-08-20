# Getting started

[中文教程](getting-started.zh-CN.md) · [Back to README](../README.md)

Mohe has two editions. They share the same character, but they live in different places.

| Edition | Where it lives | Best for |
| --- | --- | --- |
| **Codex Pet** | Inside the Codex Pets panel | A lightweight companion while you work in Codex |
| **Windows desktop app** | A standalone Electron window | Touch, brushing, mood changes, focus tools, memory and workshop views |

## Install the Codex Pet

1. Download or clone this repository.
2. Open PowerShell in the repository root.
3. Run:

```powershell
powershell -ExecutionPolicy Bypass -File .\codex-pet\install-mohe.ps1
```

4. Restart Codex.
5. Open **Pets**, refresh the list if necessary, and select **墨核**.

The installer copies only the public pet package to `%USERPROFILE%\.codex\pets\mohe`.

## Run the Windows desktop app from source

Requirements:

- Windows 10 or 11
- Node.js 22.12 or newer
- Corepack / pnpm
- WebView and graphics drivers supported by Electron

From the repository root:

```powershell
cd .\desktop-app
corepack enable
pnpm install --frozen-lockfile
pnpm build
pnpm desktop
```

A ready-to-run Windows build will appear on the [Releases](https://github.com/shixi-11/mohe-codex-pet/releases) page when one is available. Until then, use the source instructions above.

## How to interact with the desktop edition

- Click Mohe to get a short response and a matching expression or pose.
- Touch different regions to trigger different reactions.
- Double-click Mohe to enter brushing mode.
- Move the brush over Mohe; the brush stays above the fur and follows a physically sensible angle.
- Keep brushing a region to hold the pleased pose instead of snapping back immediately.
- Right-click once to leave brushing mode and restore the normal pointer.
- Mohe also changes mood on its own: quiet, curious, pleased, alert, rolling or curled into a furball.
- **Companion**, **Focus**, **Memory** and **Workshop** are separate views in the desktop edition.

## Notes

- The project is local-first. It does not require an account, analytics service or cloud database.
- Memory entered in the desktop app stays in local browser storage on that computer.
- Do not publish personal memory data, screenshots, tokens, local paths or generated private assets when making a fork.
- Antivirus software may inspect unsigned Electron applications. Build from this public source or add a trusted exception only after checking the downloaded file and repository.
- The Codex Pet edition and desktop edition are installed separately. Installing one does not automatically install the other.
- The pet artwork is intentionally included because it is required at runtime; generated working files and private source archives are not included.

## Troubleshooting

### Mohe does not appear in Codex

Restart Codex, open **Pets**, press refresh, and confirm that `%USERPROFILE%\.codex\pets\mohe\pet.json` exists.

### The desktop window is black or only shows a tiny pet

Run `pnpm install --frozen-lockfile` and `pnpm build` again from `desktop-app`, then start it with `pnpm desktop`. Do not run an old unpacked executable copied from another folder.

### PowerShell blocks the installer

Use the exact command above with `-ExecutionPolicy Bypass`. It applies only to that process.

### The brush or reactions feel wrong

Open an issue with your Windows version, display scaling, app viewport and a screenshot. Never include personal memory content or private paths.

## Uninstall

Codex Pet:

```powershell
Remove-Item -LiteralPath "$env:USERPROFILE\.codex\pets\mohe" -Recurse
```

Desktop app built from source: close the app and remove the local clone or generated build directory.
