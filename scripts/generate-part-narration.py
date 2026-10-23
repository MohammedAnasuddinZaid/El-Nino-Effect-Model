"""Generate per-part (component) narration with Edge neural voices.

Usage:
    py -3.10 scripts/generate-part-narration.py
    py -3.10 scripts/smooth-narration.py   # tighten the silences
"""

from __future__ import annotations

import asyncio
import json
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent.parent
DATA = json.loads((ROOT / "scripts" / "part-narration.json").read_text(encoding="utf-8"))

VOICES = {"en": "en-IN-NeerjaExpressiveNeural", "hi": "hi-IN-SwaraNeural"}
RATES = {"en": "-5%", "hi": "-6%"}


async def main() -> None:
    for language, items in DATA.items():
        out_dir = ROOT / "public" / "audio" / language
        out_dir.mkdir(parents=True, exist_ok=True)
        for key, text in items.items():
            path = out_dir / f"part-{key}.mp3"
            communicate = edge_tts.Communicate(text, VOICES[language], rate=RATES[language], volume="+0%", pitch="+0Hz")
            await communicate.save(str(path))
            print(f"{language} part-{key} -> {path.name} ({path.stat().st_size:,} bytes)")


if __name__ == "__main__":
    asyncio.run(main())
