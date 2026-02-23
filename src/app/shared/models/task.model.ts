export interface Task {
  _id?: string;
  title: string;
  description: string;
  status: 'todo' | 'doing' | 'done';
  dueDate?: Date | string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
