export type AlistLibraryConfig = {
  host: string;
  password: string;
  baseDir: string;
};

export type AlistAPIFile = {
  name: string;
  size: number;
  is_dir: boolean;
  modified: string;
  created: string;
  sign: string;
  thumb: string;
  type: number;
  hashinfo: string;
  hash_info: object;
};
