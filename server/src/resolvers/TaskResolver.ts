import { 
  Resolver, 
  Query, 
  Mutation, 
  Arg, 
  ID 
} from "type-graphql";
import { Task } from "../entities/Task";
import { CreateTaskInput, UpdateTaskInput } from "../inputs/TaskInput";
import { LessThan, MoreThanOrEqual } from "typeorm";
  
@Resolver()
export class TaskResolver {
  // Query to get all tasks
  @Query(() => [Task])
  async tasks(): Promise<Task[]> {
    return Task.find({ order: { priority: "DESC", createdAt: "DESC" } });
  }

  @Query(() => Task, { nullable: true })
  async task(@Arg("id", () => ID) id: number): Promise<Task | null> {
    return Task.findOne({ where: { id } });
  }
  

  // Query to get tasks by completion status
  @Query(() => [Task])
  async tasksByStatus(@Arg("completed") completed: boolean): Promise<Task[]> {
    return Task.find({ 
      where: { completed }, 
      order: { priority: "DESC", createdAt: "DESC" } 
    });
  }

  // Query to get tasks by category
  @Query(() => [Task])
  async tasksByCategory(@Arg("category") category: string): Promise<Task[]> {
    return Task.find({ 
      where: { category }, 
      order: { priority: "DESC", createdAt: "DESC" } 
    });
  }

  // Query to get tasks due today
  @Query(() => [Task])
  async tasksDueToday(): Promise<Task[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return Task.find({
      where: {
        dueDate: MoreThanOrEqual(today) && LessThan(tomorrow)
      },
      order: { priority: "DESC" }
    });
  }

  // Query to get overdue tasks
  @Query(() => [Task])
  async overdueTasks(): Promise<Task[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return Task.find({
      where: {
        completed: false,
        dueDate: LessThan(today)
      },
      order: { priority: "DESC", dueDate: "ASC" }
    });
  }

  // Mutation to create a task
  @Mutation(() => Task)
  async createTask(
    @Arg("input") input: CreateTaskInput
  ): Promise<Task> {
    const task = Task.create({
      ...input
    });
    await task.save();
    return task;
  }

  // Mutation to update a task
  @Mutation(() => Task)
  async updateTask(
    @Arg("id", () => ID) id: number,
    @Arg("input") input: UpdateTaskInput
  ): Promise<Task> {
    const task = await Task.findOne({ where: { id } });
    if (!task) throw new Error("Task not found");
    
    Object.assign(task, input);
    await task.save();
    return task;
  }

  // Mutation to delete a task
  @Mutation(() => Boolean)
  async deleteTask(@Arg("id", () => ID) id: number): Promise<boolean> {
    const task = await Task.findOne({ where: { id } });
    if (!task) throw new Error("Task not found");
    
    await task.remove();
    return true;
  }

  // Mutation to toggle task completion status
  @Mutation(() => Task)
  async toggleTaskStatus(@Arg("id", () => ID) id: number): Promise<Task> {
    const task = await Task.findOne({ where: { id } });
    if (!task) throw new Error("Task not found");
    
    task.completed = !task.completed;
    await task.save();
    return task;
  }

  // Mutation for the unique feature - create recurring task instance
  @Mutation(() => Task)
  async createRecurringTaskInstance(@Arg("id", () => ID) id: number): Promise<Task> {
    const sourceTask = await Task.findOne({ where: { id } });
    if (!sourceTask) throw new Error("Task not found");
    if (!sourceTask.isRecurring) throw new Error("This is not a recurring task");
    
    // Create a new instance based on the recurring task template
    const newTask = Task.create({
      title: sourceTask.title,
      description: sourceTask.description,
      priority: sourceTask.priority,
      category: sourceTask.category,
      completed: false,
      isRecurring: false,
      // Set due date based on pattern - simplified implementation
      dueDate: new Date() // Would calculate next due date based on recurrence pattern
    });
    
    // Update the last recurrence date on the source task
    sourceTask.lastRecurrenceDate = new Date();
    await sourceTask.save();
    
    await newTask.save();
    return newTask;
  }
}