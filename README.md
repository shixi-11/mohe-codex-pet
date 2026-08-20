<p align="center">
  <img src="desktop-app/public/assets/mohe-idle-v2-cutout.png" width="280" alt="Mohe, a black guardian cat with an amber core" />
</p>

<h1 align="center">Mohe · 墨核</h1>

<p align="center"><strong>A quiet local creature for long-running work.</strong></p>

<p align="center">
  <a href="README.md">English</a> · <a href="README.zh-CN.md">简体中文</a>
</p>

<p align="center">
  <img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-c89b52" />
  <img alt="Platform: Windows" src="https://img.shields.io/badge/platform-Windows-4f9dff" />
  <img alt="Codex Pet v2" src="https://img.shields.io/badge/Codex%20Pet-v2-66cdaa" />
  <img alt="Local first" src="https://img.shields.io/badge/data-local--first-20262a" />
</p>

Mohe (Chinese: **墨核**, “Ink Core”) is a quiet, observant Codex companion that stays on your machine and keeps watch over long-running work.

Mohe does not try to fill the screen or interrupt your flow. Most of the time, this small black guardian simply sits nearby. Touch an ear, brush the glowing core, or catch it in a playful mood, and it may tilt its head, close its eyes, roll over, or curl into a ball.

Built for people who work on things long enough to deserve a guardian.

## Two homes, one Mohe

This repository contains both versions of the same character:

- **Codex Pet** — an installable v2 pet package with an 8 × 11 animated sprite atlas and 16-direction movement rows.
- **Windows desktop app** — an interactive habitat with touch responses, grooming mode, local memory, focus sessions, an activity trail, and autonomous moods.

## Mohe has moods

<table>
  <tr>
    <td align="center"><img src="desktop-app/public/assets/mohe-idle-v2-cutout.png" width="150" alt="Guardian form" /><br /><b>Guardian</b><br /><sub>Quietly keeping watch</sub></td>
    <td align="center"><img src="desktop-app/public/assets/mohe-curious-cutout.png" width="150" alt="Curious form" /><br /><b>Curious</b><br /><sub>A small head tilt</sub></td>
    <td align="center"><img src="desktop-app/public/assets/mohe-pleased-cutout.png" width="150" alt="Pleased form" /><br /><b>Pleased</b><br /><sub>Eyes closed, core warm</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="desktop-app/public/assets/mohe-alert-cutout.png" width="150" alt="Alert form" /><br /><b>Alert</b><br /><sub>Paw raised, ears listening</sub></td>
    <td align="center"><img src="desktop-app/public/assets/mohe-roll.png" width="150" alt="Rolling form" /><br /><b>Rolling</b><br /><sub>The mischievous side</sub></td>
    <td align="center"><img src="desktop-app/public/assets/mohe-furball.png" width="150" alt="Furball form" /><br /><b>Furball</b><br /><sub>Small, round, unavailable</sub></td>
  </tr>
</table>

## What makes the desktop pet feel alive

- Different responses for the ears, head, chest, paws, tail, and body.
- Double-click to turn the cursor into a grooming brush; right-click to put it away.
- Grooming reactions stay in pose while you continue brushing instead of snapping back immediately.
- Quiet autonomous actions every 24–40 seconds: looking up, relaxing, rolling, or curling into a ball.
- A 25-minute focus timer, local memory cards, an activity trail, and an action workshop.
- No account, analytics, or cloud sync. Memory is stored locally on the device.

## Install the Codex Pet

From PowerShell in the repository root:

```powershell
powershell -ExecutionPolicy Bypass -File .\codex-pet\install-mohe.ps1
```

The script copies the package to `%USERPROFILE%\.codex\pets\mohe`. Restart Codex, open **Pets**, refresh the list if needed, and select **墨核**.

## Run the desktop app

Requirements: Node.js 22.12+ and pnpm.

```powershell
cd .\desktop-app
corepack enable
pnpm install --frozen-lockfile
pnpm build
pnpm desktop
```

Windows builds are published on the [Releases](https://github.com/shixi-11/mohe-codex-pet/releases) page when available.

## Character notes

Mohe is a “local creature for long-term work”: quiet without being distant, clever without showing off, protective of important baselines, and unexpectedly mischievous once familiar. See the full [character card](docs/character-card.md).

## Privacy and scope

- The public repository contains only the application source, runtime art, Codex Pet package, and public documentation.
- Generated-image caches, local models, test archives, absolute paths, private memories, and machine-specific build output are excluded.
- The desktop app has no built-in telemetry or remote memory service.

## Contributing

Bug reports, interaction ideas, new motion sequences, accessibility improvements, and platform ports are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License

Code and included original Mohe assets are released under the [MIT License](LICENSE).

Mohe is an independent community project and is not affiliated with or endorsed by OpenAI.

