import json
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
PET_DIR = ROOT / "codex-pet" / "mohe"
MANIFEST = PET_DIR / "pet.json"
ATLAS = PET_DIR / "spritesheet.webp"


def fail(message: str) -> None:
    raise SystemExit(f"Codex Pet validation failed: {message}")


if not MANIFEST.is_file():
    fail("pet.json is missing")
if not ATLAS.is_file():
    fail("spritesheet.webp is missing")

data = json.loads(MANIFEST.read_text(encoding="utf-8"))
expected = {
    "id": "mohe",
    "displayName": "墨核",
    "spriteVersionNumber": 2,
    "spritesheetPath": "spritesheet.webp",
}
for key, value in expected.items():
    if data.get(key) != value:
        fail(f"{key} must be {value!r}, got {data.get(key)!r}")

with Image.open(ATLAS) as image:
    if image.format != "WEBP":
        fail(f"atlas format must be WEBP, got {image.format}")
    if image.mode != "RGBA":
        fail(f"atlas mode must be RGBA, got {image.mode}")
    if image.size != (1536, 2288):
        fail(f"atlas size must be 1536x2288, got {image.size[0]}x{image.size[1]}")
    alpha = image.getchannel("A")
    if alpha.getextrema()[0] == 255:
        fail("atlas has no transparent pixels")

print("Codex Pet package is valid: Mohe v2, 8x11 atlas, 1536x2288 RGBA WEBP")
