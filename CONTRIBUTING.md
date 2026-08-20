# Contributing to Mohe

Thank you for helping this small guardian grow.

## Good first contributions

- Improve touch or grooming responses.
- Propose a coherent motion sequence instead of a one-frame swap.
- Fix scaling, hit regions, line wrapping, or accessibility issues.
- Add a platform port without weakening the local-first boundary.
- Report a reproducible Codex Pet animation or installation issue.

## Pull request checklist

1. Keep Mohe's character consistent with `docs/character-card.md`.
2. Do not commit generated caches, local paths, private memories, tokens, or build directories.
3. Run `pnpm build` in `desktop-app/`.
4. If you change the Codex sprite atlas, keep the v2 8 × 11 layout and validate every frame.
5. Include a short screen recording or screenshots for visible interaction changes.

## 中文说明

欢迎修复互动、动作、适配、排版和无障碍问题。请保持墨核“安静守护、偶尔淘气”的角色一致性，不要提交本地路径、私人记忆、密钥、生成缓存或构建目录。可见改动请附截图或短视频，Codex 图集改动须保持 v2 的 8 × 11 布局并完成逐帧检查。
