"""Tighten the generated narration so sentences flow instead of stopping.

Edge TTS leaves roughly one second of silence between sentences, which makes the
voice sound like it is delivered line by line. This pass trims that dead air to a
short, natural breath and applies a very light tempo lift.

Usage:
    py -3.10 scripts/smooth-narration.py

Requires ffmpeg on PATH (winget install Gyan.FFmpeg / brew install ffmpeg).
"""

from __future__ import annotations

import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
AUDIO_ROOT = ROOT / "public" / "audio"

# Keep a short breath between sentences, drop everything longer than this.
KEEP_SILENCE = "0.22"
SILENCE_DB = "-45dB"
TEMPO = "1.03"

FILTER = (
    "silenceremove="
    f"start_periods=1:start_duration=0:start_threshold={SILENCE_DB}:"
    f"stop_periods=-1:stop_duration={KEEP_SILENCE}:stop_threshold={SILENCE_DB},"
    f"atempo={TEMPO}"
)


def duration(path: Path) -> float:
    result = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=nw=1:nk=1",
            str(path),
        ],
        capture_output=True,
        text=True,
        check=True,
    )
    return float(result.stdout.strip())


def smooth(path: Path) -> tuple[float, float]:
    before = duration(path)
    with tempfile.TemporaryDirectory() as tmp:
        out = Path(tmp) / path.name
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-loglevel",
                "error",
                "-i",
                str(path),
                "-af",
                FILTER,
                "-ar",
                "24000",
                "-ac",
                "1",
                "-b:a",
                "48k",
                str(out),
            ],
            check=True,
        )
        shutil.move(str(out), str(path))
    return before, duration(path)


def main() -> None:
    if shutil.which("ffmpeg") is None or shutil.which("ffprobe") is None:
        print("ffmpeg/ffprobe not found on PATH — skipping narration smoothing.")
        return

    files = sorted(AUDIO_ROOT.rglob("*.mp3"))
    if not files:
        print(f"No narration files found under {AUDIO_ROOT}")
        sys.exit(1)

    saved = 0.0
    for path in files:
        before, after = smooth(path)
        saved += max(0.0, before - after)
        print(f"{path.relative_to(ROOT)}  {before:6.2f}s -> {after:6.2f}s")

    print(f"\nRemoved {saved:.1f}s of dead air across {len(files)} files.")


if __name__ == "__main__":
    main()