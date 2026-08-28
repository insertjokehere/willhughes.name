#!/bin/bash
# Strip GPS and XMP-EXIF tags from a source image before committing it.
set -euo pipefail
exec exiftool -gps:all= -xmp-exif:all= "$@"
