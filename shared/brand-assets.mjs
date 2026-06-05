import { copyFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

/**
 * @param {string} iconSource
 * @param {string} assetsDir
 */
export async function writeBrandAssets(iconSource, assetsDir) {
  const sizes = [
    { name: "favicon-16.png", size: 16 },
    { name: "favicon-32.png", size: 32 },
    { name: "apple-touch-icon.png", size: 180 },
    { name: "logo.png", size: 128 },
  ];

  await Promise.all(
    sizes.map(({ name, size }) =>
      sharp(iconSource)
        .resize(size, size, { fit: "contain", background: "#000000" })
        .png()
        .toFile(join(assetsDir, name)),
    ),
  );

  await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 16, g: 24, b: 40, alpha: 1 },
    },
  })
    .composite([
      {
        input: await sharp(iconSource).resize(220, 220, { fit: "contain" }).png().toBuffer(),
        left: 96,
        top: 205,
      },
    ])
    .png()
    .toFile(join(assetsDir, "og-image.png"));

  copyFileSync(join(assetsDir, "favicon-32.png"), join(assetsDir, "favicon.png"));
}
