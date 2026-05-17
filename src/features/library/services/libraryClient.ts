import { apiClient } from '../../../shared/api/apiClient';
import { Book, BookFilters, Category } from '../types';

function normalizeBook(book: Book): Book {
  const cover = book.cover?.trim();

  return {
    ...book,
    cover: cover ? cover.replace('ssl=1g', 'ssl=1') : '',
  };
}

export async function getBooks(): Promise<Book[]> {
  const books = (await apiClient.get('/books')) as Book[];
  return books.map(normalizeBook);
}

export async function getBestSellers(): Promise<Book[]> {
  const books = (await apiClient.get('/books/top')) as Book[];
  return books.map(normalizeBook);
}

export async function getCategories(): Promise<Category[]> {
  return apiClient.get('/categories');
}

export async function getBookByCategory(id: string): Promise<Book[]> {
  const books = (await apiClient.get(`/categories/${id}/books`)) as Book[];
  return books.map(normalizeBook);
}

export async function getBookDetail(id: string): Promise<Book> {
  const book = (await apiClient.get(`/books/${id}`)) as Book;
  return normalizeBook(book);
}

export async function getBooksWithFilters(filters?: BookFilters): Promise<Book[]> {
  const params = new URLSearchParams();

  if (filters?.category) params.append('category', filters.category);
  if (filters?.author) params.append('author', filters.author);
  if (filters?.title) params.append('title', filters.title);
  if (filters?.year !== undefined) params.append('year', filters.year.toString());
  if (filters?.priceMax !== undefined) params.append('priceMax', filters.priceMax.toString());
  if (filters?.ISBN) params.append('ISBN', filters.ISBN);

  const queryString = params.toString();
  const books = (await apiClient.get(`/books${queryString ? `?${queryString}` : ''}`)) as Book[];
  return books.map(normalizeBook);
}

export async function getHistoric(userId: string): Promise<Book[]> {
  const books = (await apiClient.get(`/users/${userId}/purchase`)) as Book[];
  return books.map(normalizeBook);
}

export async function purchaseBooks(userId: number, bookIds: number[]): Promise<{ success: boolean; message?: string }> {
  return apiClient.post('/purchases', {
    userId,
    bookId: bookIds,
  });
}
