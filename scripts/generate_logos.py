#!/usr/bin/env python3
"""Generate logo variants (png, webp, avif, favicon pngs and .ico) from a source PNG.
Usage:
  python3 scripts/generate_logos.py --source "assets/images/Logo Itzenata.png" [--remove-old]
"""
import argparse
import os
from pathlib import Path
from PIL import Image


def normalize_name(path: Path) -> str:
    name = path.stem
    name = name.lower().replace(' ', '-').replace('_', '-')
    # remove problematic characters
    name = ''.join(c for c in name if c.isalnum() or c == '-')
    return name


def save_png(img: Image.Image, outpath: Path):
    img.save(outpath, format='PNG', optimize=True)


def save_webp(img: Image.Image, outpath: Path, quality: int = 90):
    img.save(outpath, format='WEBP', quality=quality, method=6)


def save_avif(img: Image.Image, outpath: Path, quality: int = 50):
    # Requires pillow-avif-plugin installed
    img.save(outpath, format='AVIF', quality=quality)


def make_favicons(img: Image.Image, outdir: Path, base: str):
    sizes = [16, 32, 48, 180, 192]
    outfiles = []
    for s in sizes:
        resized = img.resize((s, s), Image.LANCZOS)
        p = outdir / f"favicon-{s}x{s}.png"
        resized.save(p, format='PNG', optimize=True)
        outfiles.append(p)

    # Create favicon.ico with multiple sizes (16,32,48)
    ico_sizes = [16, 32, 48]
    ico_imgs = [img.resize((s, s), Image.LANCZOS) for s in ico_sizes]
    ico_path = outdir / 'favicon.ico'
    ico_imgs[0].save(ico_path, format='ICO', sizes=[(s, s) for s in ico_sizes])
    outfiles.append(ico_path)
    # apple-touch-icon at 180x180 already included
    return outfiles


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--source', '-s', default='assets/images/Logo Itzenata.png')
    parser.add_argument('--remove-old', '-r', action='store_true', help='Remove known old logo files after generation')
    args = parser.parse_args()

    src = Path(args.source)
    if not src.exists():
        print(f"Source file not found: {src}")
        return 1

    outdir = src.parent
    base = normalize_name(src)

    print(f"Using source: {src}")
    print(f"Normalized base name: {base}")

    img = Image.open(src).convert('RGBA')

    # Save normalized PNG
    png_path = outdir / f"{base}.png"
    save_png(img, png_path)
    print(f"Saved PNG: {png_path}")

    # Save webp
    webp_path = outdir / f"{base}.webp"
    try:
        save_webp(img, webp_path)
        print(f"Saved WEBP: {webp_path}")
    except Exception as e:
        print(f"Failed to save WEBP: {e}")

    # Save avif (if supported)
    avif_path = outdir / f"{base}.avif"
    try:
        save_avif(img, avif_path)
        print(f"Saved AVIF: {avif_path}")
    except Exception as e:
        print(f"Failed to save AVIF (plugin missing?): {e}")

    # Favicons
    favs = make_favicons(img, outdir, base)
    print("Generated favicons:")
    for f in favs:
        print(f"  - {f}")

    # Optionally remove old logo files (safe list)
    if args.remove_old:
        known_old = [
            'LOGO_ITZENATA.webp',
            'logo.avif',
            'ITZENATA_ICON.avif',
            'it.png',
            'logo.avif',
            'logo-itzanata.webp',
            'favicon.ico',
            'logo.avif'
        ]
        removed = []
        for name in known_old:
            p = outdir / name
            if p.exists():
                try:
                    p.unlink()
                    removed.append(p)
                except Exception as e:
                    print(f"Failed to remove {p}: {e}")
        if removed:
            print("Removed old files:")
            for r in removed:
                print(f"  - {r}")
        else:
            print("No known old files found to remove.")

    print("Done.")
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
