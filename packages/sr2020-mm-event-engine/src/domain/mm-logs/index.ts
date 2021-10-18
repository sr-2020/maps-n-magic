export interface HistoryItem {
  timestamp: string;
  characterId: number;
  data: {
    text: string;
    title: string;
  };
}

export interface OrgHistoryItem {
  timestamp: number;
  type: string;
  message: string;
}