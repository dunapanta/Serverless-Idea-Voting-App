export interface BoardRecord {
  id: string;
  pk: string;
  sk: string;

  ownerId: string;
  boardName: string;
  description: string;
  isPublic: boolean;
  date: number;
}
