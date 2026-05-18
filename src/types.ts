export type User = {
  id: string;
  email: string;
  name: string;
  username: string;
  role: 'student' | 'teacher' | 'admin' | string;
};
