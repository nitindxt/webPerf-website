import { parse } from "path";
import * as fs from "fs/promises";

import imagemin from "imagemin";
import imageminJpegtran from "imagemin-jpegtran";
import imageminPngquant from "imagemin-pngquant";
import imageminSvgo from "imagemin-svgo";
import imageminGifsicle from "imagemin-gifsicle";

(async () => {
  const files = await imagemin(
    ["public/assets/images/**/!(*.min).{jpg,png,svg,gif}"],
    {
      plugins: [
        imageminJpegtran(),
        imageminPngquant({
          strip: true,
          quality: [0.2, 0.6],
        }),
        imageminSvgo({
          plugins: [{ removeViewBox: false }],
        }),
        imageminGifsicle(),
      ],
    }
  ).then((files) => {
    files.forEach(async (file) => {
      const source = parse(file.sourcePath);
      file.destinationPath = `${source.dir}/${source.name}.min${source.ext}`;
      await fs.writeFile(file.destinationPath, file.data);
    });
  });
})();
