import os
import cv2
import numpy as np
from PIL import Image

src_path = r'e:\web desinging\Zanstoryteller\frontend\Zanstoryteller\src\assets\frameimage\ezgif-frame-001.jpg'
bgr = cv2.imread(src_path)

# Subtle bilateral filter for de-blocking flat regions while preserving edges
denoised = cv2.bilateralFilter(bgr, d=5, sigmaColor=12, sigmaSpace=12)

# Lanczos4 upscale to 1920x1080 (1.5x) and 2560x1440 (2x)
up_1080 = cv2.resize(denoised, (1920, 1080), interpolation=cv2.INTER_LANCZOS4)
up_1440 = cv2.resize(denoised, (2560, 1440), interpolation=cv2.INTER_LANCZOS4)

def enhance_frame(img):
    # Unsharp mask for micro-detail enhancement
    blur = cv2.GaussianBlur(img, (0, 0), sigmaX=1.2)
    sharp = cv2.addWeighted(img, 1.35, blur, -0.35, 0)

    # Protect the dark background (luminance < 12) from noise amplification
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, mask = cv2.threshold(gray, 10, 255, cv2.THRESH_BINARY)
    mask = cv2.GaussianBlur(mask, (5, 5), 0) / 255.0
    mask = np.stack([mask] * 3, axis=2)

    result = (sharp * mask + img * (1 - mask)).astype(np.uint8)
    return result

res_1080 = enhance_frame(up_1080)
res_1440 = enhance_frame(up_1440)

cv2.imwrite('test_1080.webp', res_1080, [cv2.IMWRITE_WEBP_QUALITY, 92])
cv2.imwrite('test_1440.webp', res_1440, [cv2.IMWRITE_WEBP_QUALITY, 90])

print(f"Original 720p JPG: {os.path.getsize(src_path) / 1024:.1f} KB")
print(f"Optimized 1080p WebP: {os.path.getsize('test_1080.webp') / 1024:.1f} KB")
print(f"Optimized 1440p WebP: {os.path.getsize('test_1440.webp') / 1024:.1f} KB")
