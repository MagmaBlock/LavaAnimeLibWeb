import { ofetch, type $Fetch } from "ofetch";
import type {
  BangumiAPISubject,
  BangumiAPISubjectPersons,
  BangumiAPISubjectCharacters,
  BangumiAPISubjectSubjects,
  BangumiAPIEpisodes,
  BangumiAPIEpisode,
} from "~/server/types/api/bangumi";

/**
 * 对 BangumiAPI 的实现
 * https://bangumi.github.io/api/#/
 */
export class BangumiAPI {
  private apiHost: string;
  private api: $Fetch;

  constructor(apiHost: string = "https://api.bgm.tv") {
    this.apiHost = apiHost;
    this.api = ofetch.create({
      baseURL: this.apiHost,
      headers: { "User-Agent": "LavaAnimeLibServer/3.0" },
      timeout: 15000,
      retry: 3,
      retryDelay: 1000,
      responseType: "json",
    });
  }

  getSubjects(id: number) {
    return this.api<BangumiAPISubject>(`/v0/subjects/${id}`);
  }

  getSubjectsPersons(id: number) {
    return this.api<BangumiAPISubjectPersons>(`/v0/subjects/${id}/persons`);
  }

  getSubjectsCharacters(id: number) {
    return this.api<BangumiAPISubjectCharacters>(
      `/v0/subjects/${id}/characters`
    );
  }

  getSubjectsSubjects(id: number) {
    return this.api<BangumiAPISubjectSubjects>(`/v0/subjects/${id}/subjects`);
  }

  /**
   * Get Episodes
   * /v0/episodes
   * @param id 条目 ID
   * @param type 参照章节的 `type`
   * - Legacy_EpisodeType
   * - 章节类型
   * - 0 = 本篇
   * - 1 = 特别篇
   * - 2 = OP
   * - 3 = ED
   * - 4 = 预告/宣传/广告
   * - 5 = MAD
   * - 6 = 其他
   * @param limit 分页参数
   * @param offset 分页参数
   * @returns
   */
  getEpisodes(
    subject_id: number,
    type?: number,
    limit?: number,
    offset?: number
  ) {
    return this.api<BangumiAPIEpisodes>(`/v0/episodes`, {
      params: { subject_id, type, limit, offset },
    });
  }

  getEpisode(episodeId: number) {
    return this.api<BangumiAPIEpisode>(`/v0/episodes/${episodeId}`);
  }
}
