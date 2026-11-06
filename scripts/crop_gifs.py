from pathlib import Path

from PIL import Image, ImageChops, ImageSequence

SRC = Path("result")
OUT = SRC / "cropped"
RATIO = 4 / 3
PAD = 0.15
MS = 100


def mask(p: Path) -> Image.Image:
    ms = [f.convert("HSV").getchannel("S").point(lambda v: 255 * (v > 80)) for f in ImageSequence.Iterator(Image.open(p))]
    m = ms[0]
    for n in ms[1:]:
        m = ImageChops.lighter(m, n)
    return m


def box(b: tuple[int, int, int, int], W: int, H: int) -> tuple[int, int, int, int]:
    cx, cy = (b[0] + b[2]) / 2, (b[1] + b[3]) / 2
    w, h = (b[2] - b[0]) * (1 + 2 * PAD), (b[3] - b[1]) * (1 + 2 * PAD)
    w, h = max(w, h * RATIO), max(h, w / RATIO)
    w, h = min(w, W, H * RATIO), min(h, H, W / RATIO)
    x = int(min(max(cx - w / 2, 0), W - w))
    y = int(min(max(cy - h / 2, 0), H - h))
    return int(w) // 2 * 2, int(h) // 2 * 2, x, y


for d in sorted(SRC.glob("*_pairs/*[0-9]")):
    gifs = sorted(d.glob("[ab]_*.gif"))
    m = ImageChops.lighter(*[mask(g) for g in gifs])
    w, h, x, y = box(m.getbbox(), *m.size)
    (OUT / d.name).mkdir(parents=True, exist_ok=True)
    for g in gifs:
        fs = [f.convert("RGB").crop((x, y, x + w, y + h)) for f in ImageSequence.Iterator(Image.open(g))]
        fs[0].save(OUT / d.name / g.name, save_all=True, append_images=fs[1:], duration=MS, loop=0, disposal=2, optimize=False)
    print(d.name, (w, h, x, y))
