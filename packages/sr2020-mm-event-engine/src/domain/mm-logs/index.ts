export interface UserHistoryItem {
  timestamp: string;
  characterId: number;
  data: {
    text: string;
    title: string;
  };
}

export interface MainHistoryItem {
  timestamp: string;
  type: string;
  message: string;
}