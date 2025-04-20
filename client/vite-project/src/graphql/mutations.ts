import { gql } from '@apollo/client';

export const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      title
      description
      completed
      priority
      category
      createdAt
      dueDate
      isRecurring
      recurrencePattern
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      id
      title
      description
      completed
      priority
      category
      updatedAt
      dueDate
      isRecurring
      recurrencePattern
    }
  }
`;


export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

export const TOGGLE_TASK_STATUS = gql`
  mutation ToggleTaskStatus($id: ID!) {
    toggleTaskStatus(id: $id) {
      id
      completed
    }
  }
`;

export const CREATE_RECURRING_TASK_INSTANCE = gql`
  mutation CreateRecurringTaskInstance($id: ID!) {
    createRecurringTaskInstance(id: $id) {
      id
      title
      description
      completed
      priority
      category
      dueDate
    }
  }
`;