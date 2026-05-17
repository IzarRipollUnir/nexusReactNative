export type Book = {
  id: number;
  title: string;
  author: string;
  category: string;
  year: number;
  description: string;
  cover: string;
  price: number;
  ISBN: string;
};

export type Category = {
  id: number;
  name: string;
};

export type BookFilters = {
  category?: string;
  author?: string;
  title?: string;
  year?: number;
  priceMax?: number;
  ISBN?: string;
};
