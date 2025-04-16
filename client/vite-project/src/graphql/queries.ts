import { gql } from '@apollo/client';

export const GET_TASKS = gql`
  query GetTasks {
    tasks {
      id
      title
      description
      completed
      priority
      category
      createdAt
      updatedAt
      dueDate
      isRecurring
      recurrencePattern
    }
  }
`;

export const GET_TASKS_BY_STATUS = gql`
  query GetTasksByStatus($completed: Boolean!) {
    tasksByStatus(completed: $completed) {
      id
      title
      description
      completed
      priority
      category
      createdAt
      updatedAt
      dueDate
      isRecurring
      recurrencePattern
    }
  }
`;

export const GET_RECURRING_TASKS = gql`
  query GetRecurringTasks {
    tasks {
      id
      title
      description
      priority
      category
      createdAt
      updatedAt
      isRecurring
      recurrencePattern
      lastRecurrenceDate
    }
  }
`;