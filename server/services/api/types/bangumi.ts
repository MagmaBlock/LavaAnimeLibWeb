export type BangumiAPISubject = {
  date: string;
  platform: string;
  images: {
    small: string;
    grid: string;
    large: string;
    medium: string;
    common: string;
  };
  summary: string;
  name: string;
  name_cn: string;
  tags: Array<{
    name: string;
    count: number;
  }>;
  infobox: Array<{
    key: string;
    value: any;
  }>;
  rating: {
    rank: number;
    total: number;
    count: {
      "1": number;
      "2": number;
      "3": number;
      "4": number;
      "5": number;
      "6": number;
      "7": number;
      "8": number;
      "9": number;
      "10": number;
    };
    score: number;
  };
  total_episodes: number;
  collection: {
    on_hold: number;
    dropped: number;
    wish: number;
    collect: number;
    doing: number;
  };
  id: number;
  eps: number;
  volumes: number;
  locked: boolean;
  nsfw: boolean;
  type: number;
};

export type BangumiAPISubjectPersons = Array<{
  images: {
    small: string;
    grid: string;
    large: string;
    medium: string;
  };
  name: string;
  relation: string;
  career: Array<string>;
  type: number;
  id: number;
}>;

export type BangumiAPISubjectCharacters = Array<{
  images: {
    small: string;
    grid: string;
    large: string;
    medium: string;
  };
  name: string;
  relation: string;
  actors: Array<{
    images: {
      small: string;
      grid: string;
      large: string;
      medium: string;
    };
    name: string;
    short_summary: string;
    career: Array<string>;
    id: number;
    type: number;
    locked: boolean;
  }>;
  type: number;
  id: number;
}>;

export type BangumiAPISubjectSubjects = Array<{
  images: {
    small: string;
    grid: string;
    large: string;
    medium: string;
    common: string;
  };
  name: string;
  name_cn: string;
  relation: string;
  type: number;
  id: number;
}>;

export type BangumiAPIEpisodes = {
  data: Array<BangumiAPIEpisode>;
  total: number;
  limit: number;
  offset: number;
};

export type BangumiAPIEpisode = {
  airdate: string;
  name: string;
  name_cn: string;
  duration: string;
  desc: string;
  ep: number;
  sort: number;
  id: number;
  subject_id: number;
  comment: number;
  type: number;
  disc: number;
  duration_seconds: number;
};
