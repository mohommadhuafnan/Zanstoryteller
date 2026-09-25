import os
import glob
import cv2
import numpy as np

def optimize_all_frames():
    src_dir = r"e:\web desinging\Zanstoryteller\frontend\Zanstoryteller\src\assets\frameimage-original"
    out_dirs = [
        r"e:\web desinging\Zanstoryteller\frontend\Zanstoryteller\src\assets\frameimage-optimized",
        r"e:\web desinging\Zanstoryteller\frontend\Zanstoryteller\assets\frameimage-optimized"
    ]

    for d in out_dirs:
        os.makedirs(d, exist_ok=True)

    files = sorted(glob.glob(os.path.join(src_dir, "*.jpg")))
    total = len(files)
    print(f"Starting processing of {total} frames from {src_dir}...")

    total_orig_size = 0
    total_opt_size = 0

    for idx, f in enumerate(files):
        filename = os.path.basename(f)
        name_no_ext = os.path.splitext(filename)[0]
        out_name = f"{name_no_ext}.webp"

        orig_size = os.path.getsize(f)
        total_orig_size += orig_size

        bgr = cv2.imread(f)
        h, w = bgr.shape[:2]

        # 1. Subtle de-blocking filter to remove 8x8 DCT compression noise
        denoised = cv2.bilateralFilter(bgr, d=5, sigmaColor=10, sigmaSpace=10)

        # 2. High-fidelity 2x Lanczos4 interpolation (1280x720 -> 2560x1440)
        TARGET_W, TARGET_H = 2560, 1440
        upscaled = cv2.resize(denoised, (TARGET_W, TARGET_H), interpolation=cv2.INTER_LANCZOS4)

        # 3. Controlled unsharp masking for micro-contrast enhancement
        blur = cv2.GaussianBlur(upscaled, (0, 0), sigmaX=1.2)
        sharp = cv2.addWeighted(upscaled, 1.30, blur, -0.30, 0)

        # 4. Luminance protection mask: sharpen only camera parts, keep dark background pure
        gray = cv2.cvtColor(upscaled, cv2.COLOR_BGR2GRAY)
        _, mask = cv2.threshold(gray, 12, 255, cv2.THRESH_BINARY)
        mask = cv2.GaussianBlur(mask, (7, 7), 0) / 255.0
        mask = np.stack([mask] * 3, axis=2)

        enhanced = (sharp * mask + upscaled * (1 - mask)).astype(np.uint8)

        # 5. Guarantee edge background consistency: clamp outer 2px to deep black [1,1,1]
        enhanced[0:2, :] = np.clip(enhanced[0:2, :], 0, 2)
        enhanced[-2:, :] = np.clip(enhanced[-2:, :], 0, 2)
        enhanced[:, 0:2] = np.clip(enhanced[:, 0:2], 0, 2)
        enhanced[:, -2:] = np.clip(enhanced[:, -2:], 0, 2)

        # Save to both target output directories
        for out_dir in out_dirs:
            out_path = os.path.join(out_dir, out_name)
            # WebP quality 92 with high compression effort
            cv2.imwrite(out_path, enhanced, [cv2.IMWRITE_WEBP_QUALITY, 92])

        opt_size = os.path.getsize(os.path.join(out_dirs[0], out_name))
        total_opt_size += opt_size

        if (idx + 1) % 10 == 0 or idx == total - 1:
            print(f"Processed [{idx+1}/{total}]: {filename} -> {out_name} ({opt_size/1024:.1f} KB)")

    print("\nProcessing complete!")
    print(f"Original sequence (40 frames, 1280x720 JPEG): {total_orig_size / 1024:.1f} KB ({total_orig_size / (1024*1024):.2f} MB)")
    print(f"Optimized sequence (40 frames, 2560x1440 WebP): {total_opt_size / 1024:.1f} KB ({total_opt_size / (1024*1024):.2f} MB)")
    print(f"Average frame size: {total_opt_size / total / 1024:.1f} KB")

if __name__ == "__main__":
    optimize_all_frames()
