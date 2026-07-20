// AniList 장르(영문) → 한국어 라벨. 스팀 장르는 이미 한국어로 수집됨.
const GENRE_KO: Record<string, string> = {
  Action: "액션",
  Adventure: "모험",
  Comedy: "코미디",
  Drama: "드라마",
  Ecchi: "에치",
  Fantasy: "판타지",
  Horror: "호러",
  "Mahou Shoujo": "마법소녀",
  Mecha: "메카",
  Music: "음악",
  Mystery: "미스터리",
  Psychological: "심리",
  Romance: "로맨스",
  "Sci-Fi": "SF",
  "Slice of Life": "일상",
  Sports: "스포츠",
  Supernatural: "초자연",
  Thriller: "스릴러",
};

export function genreLabel(name: string): string {
  return GENRE_KO[name] ?? name;
}

/** 태그 목록에서 숨길 장르 (성인용) */
export const HIDDEN_GENRES = new Set(["Hentai"]);
