from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter


ROOT = Path(r"C:\Users\caner\.codex\.chatgpt-projects\g-p-6aafd3822c7c8191960bb6d655b94fb6\site-worktree")
SOURCE = ROOT / "public" / "uploads" / "noel-baba-fig-r-1792705971665"
OUT = ROOT / ".video-tools" / "slides"
OUT.mkdir(parents=True, exist_ok=True)

FILES = [
    "ana-1792705971679-vc0nr0.jpg",
    "galeri-1-1792705971681-xd2059.jpg",
    "galeri-2-1792705971682-ojtc0q.jpg",
    "galeri-3-1792705971687-8kwlfn.jpg",
]

HEADINGS = [
    ("3D Baskı Noel Baba", "Yılbaşı ruhu masanda"),
    ("Neşeli ve dekoratif", "Masa, raf ve ofis için"),
    ("Yaklaşık 12,5 cm", "Özenle 3D baskı üretim"),
    ("Yeni yıl dekorunu seç", "3dbadeneon.com"),
]

W, H = 1080, 1920
FONT_BOLD = r"C:\Windows\Fonts\segoeuib.ttf"
FONT_REGULAR = r"C:\Windows\Fonts\segoeui.ttf"


def font(path, size):
    return ImageFont.truetype(path, size=size)


def cover(image, size):
    ratio = max(size[0] / image.width, size[1] / image.height)
    resized = image.resize((round(image.width * ratio), round(image.height * ratio)), Image.Resampling.LANCZOS)
    left = (resized.width - size[0]) // 2
    top = (resized.height - size[1]) // 2
    return resized.crop((left, top, left + size[0], top + size[1]))


def contain(image, size):
    copy = image.copy()
    copy.thumbnail(size, Image.Resampling.LANCZOS)
    return copy


for idx, (name, (heading, subheading)) in enumerate(zip(FILES, HEADINGS), start=1):
    src = Image.open(SOURCE / name).convert("RGB")

    bg = cover(src, (W, H)).filter(ImageFilter.GaussianBlur(34))
    dark = Image.new("RGBA", (W, H), (10, 8, 16, 148))
    canvas = Image.alpha_composite(bg.convert("RGBA"), dark)

    draw = ImageDraw.Draw(canvas, "RGBA")
    draw.rounded_rectangle((54, 58, W - 54, H - 58), radius=48, fill=(15, 13, 23, 185), outline=(255, 255, 255, 34), width=2)

    product = contain(src, (900, 1170)).convert("RGBA")
    px = (W - product.width) // 2
    py = 350 + (1130 - product.height) // 2

    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow, "RGBA")
    shadow_draw.rounded_rectangle((px - 22, py - 22, px + product.width + 22, py + product.height + 22), radius=42, fill=(0, 0, 0, 125))
    shadow = shadow.filter(ImageFilter.GaussianBlur(22))
    canvas = Image.alpha_composite(canvas, shadow)

    card = Image.new("RGBA", (product.width + 28, product.height + 28), (255, 255, 255, 0))
    card_draw = ImageDraw.Draw(card, "RGBA")
    card_draw.rounded_rectangle((0, 0, card.width - 1, card.height - 1), radius=34, fill=(255, 255, 255, 245))
    card.alpha_composite(product, (14, 14))
    canvas.alpha_composite(card, (px - 14, py - 14))

    draw = ImageDraw.Draw(canvas, "RGBA")
    title_font = font(FONT_BOLD, 68)
    sub_font = font(FONT_REGULAR, 38)
    brand_font = font(FONT_BOLD, 34)
    count_font = font(FONT_BOLD, 28)

    draw.text((W // 2, 156), heading, font=title_font, anchor="mm", fill=(255, 255, 255, 255), stroke_width=1, stroke_fill=(0, 0, 0, 80))
    draw.text((W // 2, 242), subheading, font=sub_font, anchor="mm", fill=(255, 221, 132, 255))

    draw.rounded_rectangle((252, 1600, W - 252, 1692), radius=46, fill=(210, 32, 48, 235))
    draw.text((W // 2, 1646), "ÜRÜNÜ İNCELE", font=brand_font, anchor="mm", fill=(255, 255, 255, 255))
    draw.text((W // 2, 1750), "3DBadeNeon", font=brand_font, anchor="mm", fill=(255, 255, 255, 255))
    draw.text((W // 2, 1800), "3dbadeneon.com", font=sub_font, anchor="mm", fill=(255, 221, 132, 255))

    for dot in range(4):
        x = W // 2 - 54 + dot * 36
        color = (255, 221, 132, 255) if dot == idx - 1 else (255, 255, 255, 75)
        draw.ellipse((x - 6, 1850, x + 6, 1862), fill=color)

    canvas.convert("RGB").save(OUT / f"slide-{idx}.jpg", quality=94, subsampling=0)

