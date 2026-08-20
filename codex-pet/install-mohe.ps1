param([string]$Target)

$ErrorActionPreference = 'Stop'
$source = Join-Path $PSScriptRoot 'mohe'
$codexHome = if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $env:USERPROFILE '.codex' }
if (-not $Target) { $Target = Join-Path $codexHome 'pets\mohe' }

if (-not (Test-Path -LiteralPath (Join-Path $source 'pet.json'))) {
  throw "Mohe pet package was not found: $source"
}

New-Item -ItemType Directory -Force -Path (Split-Path -Parent $Target) | Out-Null
New-Item -ItemType Directory -Force -Path $Target | Out-Null
Copy-Item -Path (Join-Path $source '*') -Destination $Target -Recurse -Force

$required = @('pet.json', 'spritesheet.webp')
foreach ($name in $required) {
  if (-not (Test-Path -LiteralPath (Join-Path $Target $name) -PathType Leaf)) {
    throw "Installation is incomplete; missing $name in $Target"
  }
}

Write-Host "Mohe was installed to: $Target"
Write-Host "Restart Codex, open Pets, refresh the list, and select Mohe."
