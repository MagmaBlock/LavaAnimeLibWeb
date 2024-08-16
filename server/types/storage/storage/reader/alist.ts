export type AlistStorageConfig = {
  host: string;
  username: string;
  password: string;
  baseDir: string;
};

// 通用响应结构
export interface AlistApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 文件/文件夹信息
export interface AlistFileInfo {
  name: string;
  size: number;
  is_dir: boolean;
  modified: string;
  created?: string;
  sign: string;
  thumb: string;
  type: number;
  hashinfo?: string;
  hash_info?: null;
}

// 目录列表响应
export interface AlistListResponse {
  content: AlistFileInfo[];
  total: number;
  readme: string;
  header: string;
  write: boolean;
  provider: string;
}

// 文件/目录信息响应
export interface AlistGetResponse extends AlistFileInfo {
  raw_url: string;
  readme: string;
  header: string;
  provider: string;
  related: null;
}

// 搜索结果项
export interface AlistSearchResultItem {
  parent: string;
  name: string;
  is_dir: boolean;
  size: number;
  type: number;
}

// 搜索响应
export interface AlistSearchResponse {
  content: AlistSearchResultItem[];
  total: number;
}

// 目录项
export interface AlistDirItem {
  name: string;
  modified: string;
}

// 任务信息
export interface AlistTaskInfo {
  id: string;
  name: string;
  state: number;
  status: string;
  progress: number;
  error: string;
}

// 上传/下载任务响应
export interface AlistTaskResponse {
  task: AlistTaskInfo;
}

// 批量任务响应
export interface AlistBatchTaskResponse {
  tasks: AlistTaskInfo[];
}

// 重命名对象
export interface AlistRenameObject {
  src_name: string;
  new_name: string;
}

// 批量重命名请求
export interface AlistBatchRenameRequest {
  src_dir: string;
  rename_objects: AlistRenameObject[];
}

// 正则重命名请求
export interface AlistRegexRenameRequest {
  src_dir: string;
  src_name_regex: string;
  new_name_regex: string;
}

// 移动/复制文件请求
export interface AlistMoveOrCopyRequest {
  src_dir: string;
  dst_dir: string;
  names: string[];
}

// 删除文件请求
export interface AlistRemoveRequest {
  names: string[];
  dir: string;
}

// 离线下载请求
export interface AlistAddOfflineDownloadRequest {
  path: string;
  urls: string[];
  tool: "aria2" | "SimpleHttp" | "qBittorrent";
  delete_policy:
    | "delete_on_upload_succeed"
    | "delete_on_upload_failed"
    | "delete_never"
    | "delete_always";
}
