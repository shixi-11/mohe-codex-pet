param(
  [string]$Target = (Join-Path $env:USERPROFILE '.codex\pets\mohe')
)

$ErrorActionPreference = 'Stop'
$source = Join-Path $PSScriptRoot 'mohe'

if (-not (Test-Path -LiteralPath (Join-Path $source 'pet.json'))) {
  throw "Mohe pet package was not found: $source"
}

New-Item -ItemType Directory -Force -Path (Split-Path -Parent $Target) | Out-Null
New-Item -ItemType Directory -Force -Path $Target | Out-Null
Copy-Item -Path (Join-Path $source '*') -Destination $Target -Recurse -Force

Write-Host "Mohe (墨核) was installed to: $Target"
Write-Host "Restart Codex, open Pets, refresh the list, and select 墨核."
