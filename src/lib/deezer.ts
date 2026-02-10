export interface DeezerTrack {
  id: number;
  title: string;
  duration: number;
  artist: {
    id: number;
    name: string;
  };
  album: {
    id: number;
    title: string;
    cover_medium: string;
    cover_big: string;
  };
}

export interface DeezerSearchResponse {
  data: DeezerTrack[];
  total: number;
  next?: string;
}

export async function searchDeezer(query: string, limit = 25): Promise<DeezerTrack[]> {
  const url = `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=${limit}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Deezer API error: ${response.status}`);
  }

  const data: DeezerSearchResponse = await response.json();
  return data.data || [];
}
