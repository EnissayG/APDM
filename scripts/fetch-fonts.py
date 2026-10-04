import pathlib
import re
import urllib.request

OUT = pathlib.Path("public/fonts")
OUT.mkdir(parents=True, exist_ok=True)

CSS_URL = (
    "https://fonts.googleapis.com/css2?"
    "family=Lobster&family=Nunito:wght@400..900&display=optional"
)


def fetch(url: str) -> bytes:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            )
        },
    )
    with urllib.request.urlopen(req) as res:
        return res.read()


raw_css = fetch(CSS_URL).decode("utf-8")
blocks = re.findall(
    r"/\*([^*]+)\*/\s*(@font-face\s*\{.*?\})",
    raw_css,
    flags=re.DOTALL,
)

faces: list[dict[str, str]] = []
for comment, face in blocks:
    label = comment.strip().lower()
    if "latin" not in label:
        continue
    if any(x in label for x in ("cyrillic", "vietnamese", "greek")):
        continue
    family = re.search(r"font-family:\s*'([^']+)'", face)
    url = re.search(r"url\((https://[^)]+\.woff2)\)", face)
    weight = re.search(r"font-weight:\s*([^;]+);", face)
    unicode_range = re.search(r"unicode-range:\s*([^;]+);", face)
    if not (family and url and unicode_range):
        continue
    subset = "latin-ext" if "latin-ext" in label else "latin"
    faces.append(
        {
            "family": family.group(1),
            "weight": weight.group(1).strip() if weight else "400",
            "subset": subset,
            "url": url.group(1),
            "unicode_range": unicode_range.group(1).strip(),
        }
    )

print(f"found {len(faces)} faces")
for face in faces:
    slug = face["family"].lower().replace(" ", "-")
    weight_slug = face["weight"].replace(" ", "").replace("..", "-")
    filename = f"{slug}-{face['subset']}-{weight_slug}.woff2"
    target = OUT / filename
    if not target.exists():
        target.write_bytes(fetch(face["url"]))
        print(f"downloaded {filename} ({target.stat().st_size} bytes)")
    else:
        print(f"exists {filename}")
    face["filename"] = filename

parts = []
preload = []
for face in faces:
    parts.append(
        "\n".join(
            [
                "@font-face {",
                f'  font-family: "{face["family"]}";',
                "  font-style: normal;",
                f"  font-weight: {face['weight']};",
                "  font-display: optional;",
                f'  src: url("./fonts/{face["filename"]}") format("woff2");',
                f"  unicode-range: {face['unicode_range']};",
                "}",
            ]
        )
    )
    if face["subset"] == "latin":
        preload.append(face["filename"])

css = (
    "/* Polices locales — font-display: optional évite le flash police système */\n\n"
    + "\n\n".join(parts)
    + "\n"
)
pathlib.Path("public/fonts.css").write_text(css, encoding="utf-8")
pathlib.Path("scripts/font-preloads.txt").write_text("\n".join(preload), encoding="utf-8")
# Cleanup old generated path if present
old = pathlib.Path("src/fonts.css")
if old.exists():
    old.unlink()
print("wrote public/fonts.css")
print("preloads:", ", ".join(preload))
