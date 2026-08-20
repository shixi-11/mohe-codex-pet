# 开始使用墨核

[English](getting-started.md) · [返回中文介绍](../README.zh-CN.md)

墨核有两个版本。它们是同一个角色，但住在不同的地方。

| 版本 | 在哪里出现 | 适合什么场景 |
| --- | --- | --- |
| **Codex Pet 版** | Codex 的「宠物」页面 | 写代码时安静陪在一旁，占用更轻 |
| **Windows 桌面版** | 独立 Electron 窗口 | 触摸、梳毛、情绪变化，以及专注、记忆与工坊功能 |

## 安装 Codex Pet 版

1. 下载或克隆本仓库。
2. 在仓库根目录打开 PowerShell。
3. 运行：

```powershell
powershell -ExecutionPolicy Bypass -File .\codex-pet\install-mohe.ps1
```

4. 完全退出并重新打开 Codex。
5. 进入「宠物」页面；列表未更新时先点刷新，再选择「墨核」。

如果设置了 `CODEX_HOME`，安装脚本会把公开宠物包复制到 `$env:CODEX_HOME\pets\mohe`；否则安装到 `%USERPROFILE%\.codex\pets\mohe`。

从 Release 下载后，可先用 `SHA256SUMS.txt` 核对文件是否完整：

```powershell
$package = Get-ChildItem .\Mohe-Codex-Pet-*.zip | Select-Object -First 1
Get-FileHash $package.FullName -Algorithm SHA256
```

## 从源码运行 Windows 桌面版

运行环境：

- Windows 10 或 Windows 11
- Node.js 22.12 或更新版本
- Corepack / pnpm
- Electron 可正常使用的 WebView 与显卡驱动

在仓库根目录执行：

```powershell
cd .\desktop-app
corepack enable
pnpm install --frozen-lockfile
pnpm build
pnpm desktop
```

可直接双击的 Windows 版本在 [Releases](https://github.com/shixi-11/mohe-pet/releases) 下载。请选择 `Mohe-Windows-Portable-*.zip`；名字相近的 `Mohe-Codex-Pet-*.zip` 用于 Codex 的「宠物」页面。

## 桌面版怎么互动

- 单击墨核：得到一句简短回应，并切换到相应表情或姿态。
- 触碰不同部位：头、耳朵、胸口、身体与尾巴会有不同反应。
- 双击墨核：进入梳毛模式，鼠标会变成毛刷。
- 移动毛刷：毛刷保持在毛发上方，并按接触方向自然转动。
- 持续梳同一个部位：享受姿态会保持，不会一闪就恢复。
- 单击鼠标右键：退出梳毛模式，恢复普通鼠标。
- 无操作时，墨核也会在安静、好奇、享受、警觉、打滚和蜷成毛团等状态间自然变化。
- 「陪伴」「专注」「记忆」「工坊」是桌面版里的四个不同入口。

## 注意事项

- 项目采用本地优先设计，不要求注册账号，也不接入统计服务或云端数据库。
- 桌面版里写入的记忆保存在当前电脑的本地存储中。
- Fork 或分享截图前，请检查并移除私人记忆、Token、密钥、本机路径和未公开素材。
- 未签名的 Electron 程序可能被杀毒软件检查。请从公开源码自行构建，或在核对仓库与文件后再决定是否加入信任区。
- Codex Pet 版和 Windows 桌面版需要分别安装；安装其中一个不会自动安装另一个。
- 仓库保留运行所需的正式图片，不包含生成缓存、私人源档和本机工作目录。
- 请不要把旧文件夹里复制出来的残缺 EXE 当作正式桌面版，它可能只显示黑色背景或一只很小的墨核。

## 常见问题

### Codex 的宠物列表里没有墨核

重新启动 Codex，进入「宠物」页面点刷新，并检查 `%USERPROFILE%\.codex\pets\mohe\pet.json` 是否存在。

### 桌面版打开后黑屏，或者只出现很小的一只猫

进入 `desktop-app`，重新运行 `pnpm install --frozen-lockfile` 与 `pnpm build`，再用 `pnpm desktop` 启动。不要继续使用从旧目录单独复制出来的 EXE。

### PowerShell 阻止安装脚本

使用上文带有 `-ExecutionPolicy Bypass` 的完整命令。它只对这一次 PowerShell 进程生效。

### 毛刷方向、动作保持或触摸区域不准确

提交 Issue 时请附上 Windows 版本、显示缩放比例、应用窗口大小和截图。不要在截图里留下私人记忆或本机路径。

### 杀毒软件提示风险

先确认下载来源是本仓库，再核对文件内容。当前项目未提供代码签名；如果不放心，请直接从公开源码构建。

## 卸载

卸载 Codex Pet 版：

```powershell
Remove-Item -LiteralPath "$env:USERPROFILE\.codex\pets\mohe" -Recurse
```

桌面版若从源码运行：先关闭应用，再删除本地仓库副本或生成的构建目录。

Windows 便携版：关闭墨核后删除解压出的可执行文件即可。若还要清除本地记忆，再手动删除 `%APPDATA%\mohe-codex-pet`；不删除则可在后续版本继续沿用。
