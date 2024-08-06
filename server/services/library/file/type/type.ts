// 来自 AnimeNameTool

export const extensionMap = new Map<RegExp, [string, ExtensionType]>();

export enum ExtensionType {
  Video = "Video",
  Audio = "Audio",
  Subtitle = "Subtitle",
  Image = "Image",
  Archive = "Archive",
  Document = "Document",
  Seed = "Seed",
}

extensionMap.set(/mp4/gi, ["MP4", ExtensionType.Video]);
extensionMap.set(/mkv/gi, ["MKV", ExtensionType.Video]);
extensionMap.set(/mov/gi, ["MOV", ExtensionType.Video]);
extensionMap.set(/avi/gi, ["AVI", ExtensionType.Video]);
extensionMap.set(/wmv/gi, ["WMV", ExtensionType.Video]);
extensionMap.set(/flv/gi, ["FLV", ExtensionType.Video]);
extensionMap.set(/mpg/gi, ["MPG", ExtensionType.Video]);
extensionMap.set(/mpeg/gi, ["MPEG", ExtensionType.Video]);
extensionMap.set(/m4v/gi, ["M4V", ExtensionType.Video]);
extensionMap.set(/webm/gi, ["WebM", ExtensionType.Video]);
extensionMap.set(/m3u8/gi, ["M3U8", ExtensionType.Video]);
extensionMap.set(/m2ts/gi, ["M2TS", ExtensionType.Video]);
extensionMap.set(/mts/gi, ["MTS", ExtensionType.Video]);
extensionMap.set(/ts/gi, ["TS", ExtensionType.Video]);
extensionMap.set(/vob/gi, ["VOB", ExtensionType.Video]);
extensionMap.set(/m2v/gi, ["M2V", ExtensionType.Video]);

extensionMap.set(/mp3/gi, ["MP3", ExtensionType.Audio]);
extensionMap.set(/wav/gi, ["WAV", ExtensionType.Audio]);
extensionMap.set(/flac/gi, ["FLAC", ExtensionType.Audio]);
extensionMap.set(/aac/gi, ["AAC", ExtensionType.Audio]);
extensionMap.set(/m4a/gi, ["M4A", ExtensionType.Audio]);
extensionMap.set(/ogg/gi, ["OGG", ExtensionType.Audio]);

extensionMap.set(/ass|ssa/gi, ["ASS / SSA", ExtensionType.Subtitle]);
extensionMap.set(/srt/gi, ["SRT", ExtensionType.Subtitle]);
extensionMap.set(/vtt/gi, ["VTT", ExtensionType.Subtitle]);

extensionMap.set(/jpg|jpeg/gi, ["JPG", ExtensionType.Image]);
extensionMap.set(/png/gi, ["PNG", ExtensionType.Image]);
extensionMap.set(/gif/gi, ["GIF", ExtensionType.Image]);
extensionMap.set(/bmp/gi, ["BMP", ExtensionType.Image]);
extensionMap.set(/tif/gi, ["TIF", ExtensionType.Image]);
extensionMap.set(/tiff/gi, ["TIFF", ExtensionType.Image]);
extensionMap.set(/webp/gi, ["WEBP", ExtensionType.Image]);
extensionMap.set(/ico/gi, ["ICO", ExtensionType.Image]);
extensionMap.set(/svg/gi, ["SVG", ExtensionType.Image]);
extensionMap.set(/acif/gi, ["AVIF", ExtensionType.Image]);

extensionMap.set(/zip/gi, ["ZIP", ExtensionType.Archive]);
extensionMap.set(/rar/gi, ["RAR", ExtensionType.Archive]);
extensionMap.set(/7z/gi, ["7Z", ExtensionType.Archive]);
extensionMap.set(/tar/gi, ["TAR", ExtensionType.Archive]);
extensionMap.set(/gz/gi, ["GZ", ExtensionType.Archive]);
extensionMap.set(/bz2/gi, ["BZ2", ExtensionType.Archive]);
extensionMap.set(/xz/gi, ["XZ", ExtensionType.Archive]);
extensionMap.set(/zst/gi, ["ZST", ExtensionType.Archive]);
extensionMap.set(/lz/gi, ["LZ", ExtensionType.Archive]);

extensionMap.set(/pdf/gi, ["PDF", ExtensionType.Document]);
extensionMap.set(/doc|docx/gi, ["Word", ExtensionType.Document]);
extensionMap.set(/xls|xlsx/gi, ["Excel", ExtensionType.Document]);
extensionMap.set(/ppt|pptx/gi, ["PowerPoint", ExtensionType.Document]);
extensionMap.set(/txt/gi, ["TXT", ExtensionType.Document]);
extensionMap.set(/md/gi, ["MD", ExtensionType.Document]);
extensionMap.set(/html/gi, ["Web", ExtensionType.Document]);
extensionMap.set(/xml/gi, ["XML", ExtensionType.Document]);
extensionMap.set(/json/gi, ["JSON", ExtensionType.Document]);
extensionMap.set(/csv/gi, ["CSV", ExtensionType.Document]);
extensionMap.set(/yml|yaml/gi, ["YAML", ExtensionType.Document]);
extensionMap.set(/ini/gi, ["INI", ExtensionType.Document]);
extensionMap.set(/cfg/gi, ["CFG", ExtensionType.Document]);
extensionMap.set(/log/gi, ["Log", ExtensionType.Document]);

extensionMap.set(/torrent/gi, ["BitTorrent", ExtensionType.Seed]);
