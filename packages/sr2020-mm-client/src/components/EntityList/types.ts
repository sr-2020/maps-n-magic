export interface EntitiyListItem {
  id: number;
  title: string;
  subtitle: string;
}

export const makeLinkGenerator = (root: string) => (id: number, name: string) => `/${root}/${id}/${name}`;