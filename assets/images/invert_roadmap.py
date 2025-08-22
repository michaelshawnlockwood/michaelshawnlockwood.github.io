from PIL import Image, ImageOps

img = Image.open("assets/images/subway-roadmap.png").convert("RGB")
inverted = ImageOps.invert(img)
inverted.save("assets/images/subway-roadmap-inverted.jpg", "JPEG", quality=92)

print("✅ Wrote assets/images/subway-roadmap-inverted.jpg")
