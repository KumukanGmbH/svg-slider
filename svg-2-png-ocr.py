# -*- coding: utf-8 -*-

try:
    import Image
except ImportError:
    from PIL import Image

import logging
import cairosvg
import pytesseract

from os import listdir
from os.path import isfile, join

logger = logging.getLogger('svg-2-png-ocr')

path = './assets/manuals/33/'

svgs = [f for f in listdir(path) if isfile(join(path, f)) and f.endswith('.svg')]

for svg_file in svgs:
    svg_path = join(path, svg_file)
    logger.info('The SVG Path: %s' % svg_path)

    with open(svg_path, 'r') as svg:

        svg_code = svg.read()
        target_png = svg_path.replace('.svg', '.png')
        logger.info('The target PNG Path: %s' % target_png)

    with open(target_png, 'w') as fout:

        cairosvg.svg2png(bytestring=svg_code,
                         write_to=fout)

    target_txt = svg_path.replace('.svg', '.txt')
    text = pytesseract.image_to_string(Image.open(target_png),
                                       lang='deu')

    if text:
        with open(target_txt, 'w') as txt:
            txt.write(text)
