import { source } from "./local/database";
import { TaskEntity } from "./local/task-entity";

export class TasksRepository {
  async getTasks(): Promise<TaskEntity[]> {
    if (!source.isInitialized) await source.initialize();

    const tasks = await TaskEntity.find();

    return tasks;
  }

  async getTask(taskId: TaskEntity["id"]): Promise<TaskEntity> {
    if (!source.isInitialized) await source.initialize();

    const task = await TaskEntity.findOneByOrFail({ id: taskId });
    return task;
  }

  async createTask(payload: Pick<TaskEntity, "title" | "description">) {
    if (!source.isInitialized) await source.initialize();

    const task = new TaskEntity();
    task.title = payload.title;
    task.description = payload.description;
    await task.save();
  }

  async updateTask(
    taskId: TaskEntity["id"],
    payload: Partial<Pick<TaskEntity, "title" | "description" | "completed">>
  ) {
    if (!source.isInitialized) await source.initialize();

    const task = await TaskEntity.findOneByOrFail({ id: taskId });
    task.title = payload.title ?? task.title;
    task.description = payload.description ?? task.description;
    task.completed = payload.completed ?? task.completed;
    await task.save();
  }

  async deleteTask(taskId: TaskEntity["id"]) {
    if (!source.isInitialized) await source.initialize();

    await TaskEntity.delete(taskId);
  }
}
