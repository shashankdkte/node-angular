// API Response interfaces matching backend structure

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
}

export interface TaskResponse extends ApiResponse<any> {
  data?: {
    _id: string;
    title: string;
    description: string;
    status: 'todo' | 'doing' | 'done';
    dueDate?: string | null;
    createdAt?: string;
    updatedAt?: string;
  };
}

export interface TasksResponse extends ApiResponse<any[]> {
  data?: Array<{
    _id: string;
    title: string;
    description: string;
    status: 'todo' | 'doing' | 'done';
    dueDate?: string | null;
    createdAt?: string;
    updatedAt?: string;
  }>;
}

export interface AuthResponse extends ApiResponse<any> {
  data?: {
    token: string;
    user: {
      id: string;
      email: string;
    };
  };
}
