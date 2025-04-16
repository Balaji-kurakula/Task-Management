export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: number;
  category?: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  isRecurring?: boolean;
  recurrencePattern?: string;
  lastRecurrenceDate?: string;
}
