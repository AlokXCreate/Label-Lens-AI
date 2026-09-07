import os
import pymupdf
from PIL import Image, ImageDraw, ImageFilter, ImageFont

BASE_DIR = r"c:\Users\Alok\Desktop\SIH 2026"
RES_DIR = os.path.join(BASE_DIR, "android", "app", "src", "main", "res")
SVG_PATH = os.path.join(BASE_DIR, "public", "logo.svg")

# 1. Render master high-res logo from SVG (1024x1024)
doc = pymupdf.open(SVG_PATH)
page = doc[0]
zoom = 1024 / page.rect.width
mat = pymupdf.Matrix(zoom, zoom)
pix = page.get_pixmap(matrix=mat, alpha=True)
master_img = Image.frombytes("RGBA", [pix.width, pix.height], pix.samples)

print(f"Master logo rendered: {master_img.size}")

ICON_SIZES = {
    "mipmap-mdpi": (48, 108),
    "mipmap-hdpi": (72, 162),
    "mipmap-xhdpi": (96, 216),
    "mipmap-xxhdpi": (144, 324),
    "mipmap-xxxhdpi": (192, 432),
}

def get_rounded_mask(size, radius):
    mask = Image.new('L', (size * 4, size * 4), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([(0, 0), (size * 4, size * 4)], radius=radius * 4, fill=255)
    return mask.resize((size, size), Image.Resampling.LANCZOS)

def get_circle_mask(size):
    mask = Image.new('L', (size * 4, size * 4), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse([(0, 0), (size * 4, size * 4)], fill=255)
    return mask.resize((size, size), Image.Resampling.LANCZOS)

# Generate App Icons for each density
for folder, (icon_size, fg_size) in ICON_SIZES.items():
    folder_path = os.path.join(RES_DIR, folder)
    os.makedirs(folder_path, exist_ok=True)
    
    icon = master_img.resize((icon_size, icon_size), Image.Resampling.LANCZOS)
    mask = get_rounded_mask(icon_size, radius=int(icon_size * 0.22))
    
    square_icon = Image.new('RGBA', (icon_size, icon_size), (0, 0, 0, 0))
    square_icon.paste(icon, (0, 0), mask)
    square_icon.save(os.path.join(folder_path, "ic_launcher.png"), "PNG")
    
    round_mask = get_circle_mask(icon_size)
    round_icon = Image.new('RGBA', (icon_size, icon_size), (0, 0, 0, 0))
    round_icon.paste(icon, (0, 0), round_mask)
    round_icon.save(os.path.join(folder_path, "ic_launcher_round.png"), "PNG")
    
    fg_canvas = Image.new('RGBA', (fg_size, fg_size), (0, 0, 0, 0))
    logo_target_size = int(fg_size * 0.72)
    logo_resized = master_img.resize((logo_target_size, logo_target_size), Image.Resampling.LANCZOS)
    offset = (fg_size - logo_target_size) // 2
    fg_canvas.paste(logo_resized, (offset, offset), logo_resized)
    fg_canvas.save(os.path.join(folder_path, "ic_launcher_foreground.png"), "PNG")

# Also update apk folder
APK_DIR = os.path.join(BASE_DIR, "apk")
os.makedirs(APK_DIR, exist_ok=True)
master_img.resize((512, 512), Image.Resampling.LANCZOS).save(os.path.join(APK_DIR, "app-logo-512.png"), "PNG")

SPLASH_SIZES = {
    "drawable": (480, 800),
    "drawable-port-mdpi": (320, 480),
    "drawable-port-hdpi": (480, 800),
    "drawable-port-xhdpi": (720, 1280),
    "drawable-port-xxhdpi": (960, 1600),
    "drawable-port-xxxhdpi": (1280, 1920),
    "drawable-land-mdpi": (480, 320),
    "drawable-land-hdpi": (800, 480),
    "drawable-land-xhdpi": (1280, 720),
    "drawable-land-xxhdpi": (1600, 960),
    "drawable-land-xxxhdpi": (1920, 1280),
}

# Try loading Windows system font (Segoe UI or Arial)
def get_font(size):
    font_paths = [
        r"C:\Windows\Fonts\segoeuib.ttf",
        r"C:\Windows\Fonts\arialbd.ttf",
        r"C:\Windows\Fonts\calibrib.ttf"
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

def get_font_regular(size):
    font_paths = [
        r"C:\Windows\Fonts\segoeui.ttf",
        r"C:\Windows\Fonts\arial.ttf",
        r"C:\Windows\Fonts\calibri.ttf"
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

def create_splash_screen(width, height):
    img = Image.new("RGBA", (width, height), (10, 15, 29, 255)) # #0A0F1D dark slate
    draw = ImageDraw.Draw(img)
    
    is_portrait = height >= width
    
    # Glow effect
    cx = width // 2
    cy = int(height * (0.40 if is_portrait else 0.42))
    glow_radius = min(width, height) // 3
    glow = Image.new("RGBA", (glow_radius * 2, glow_radius * 2), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    for r in range(glow_radius, 0, -6):
        alpha = int(35 * (1 - r / glow_radius))
        glow_draw.ellipse(
            [(glow_radius - r, glow_radius - r), (glow_radius + r, glow_radius + r)],
            fill=(99, 102, 241, alpha)
        )
    img.paste(glow, (cx - glow_radius, cy - glow_radius), glow)
    
    # Logo
    logo_size = int(min(width, height) * (0.34 if is_portrait else 0.38))
    logo_resized = master_img.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    img.paste(logo_resized, (cx - logo_size // 2, cy - logo_size // 2), logo_resized)
    
    # Typography
    title_size = max(14, int(min(width, height) * 0.052))
    sub_size = max(9, int(title_size * 0.48))
    tag_size = max(8, int(sub_size * 0.88))
    
    title_font = get_font(title_size)
    sub_font = get_font_regular(sub_size)
    tag_font = get_font_regular(tag_size)
    
    # Draw Title
    title_text = "LABEL LENS AI"
    bbox = draw.textbbox((0, 0), title_text, font=title_font)
    tw = bbox[2] - bbox[0]
    title_y = cy + logo_size // 2 + int(height * 0.04)
    draw.text((cx - tw // 2, title_y), title_text, font=title_font, fill=(255, 255, 255, 255))
    
    # Draw Subtitle
    sub_text = "Legal Metrology & Packaging Compliance Engine"
    bbox_sub = draw.textbbox((0, 0), sub_text, font=sub_font)
    sw = bbox_sub[2] - bbox_sub[0]
    sub_y = title_y + (bbox[3] - bbox[1]) + int(height * 0.012)
    draw.text((cx - sw // 2, sub_y), sub_text, font=sub_font, fill=(148, 163, 184, 255))
    
    # Bottom attribution badge
    if is_portrait:
        bot_text = "Ministry of Consumer Affairs, Food & Public Distribution • SIH 2026"
        bbox_bot = draw.textbbox((0, 0), bot_text, font=tag_font)
        bw = bbox_bot[2] - bbox_bot[0]
        bot_y = height - int(height * 0.07)
        draw.text((cx - bw // 2, bot_y), bot_text, font=tag_font, fill=(100, 116, 139, 255))
        
    return img

for splash_folder, (sw, sh) in SPLASH_SIZES.items():
    s_folder_path = os.path.join(RES_DIR, splash_folder)
    os.makedirs(s_folder_path, exist_ok=True)
    splash = create_splash_screen(sw, sh)
    splash.save(os.path.join(s_folder_path, "splash.png"), "PNG")

print("\nEnhanced Splash Screens with typography generated successfully!")
