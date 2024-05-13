import { Alert, Button, StyleSheet, TextInput } from "react-native";

import { Text, View } from "@/components/Themed";
import { useState } from "react";
import { TasksRepository } from "@/data/task-repo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const tasksRepository = new TasksRepository();

export default function TabTwoScreen() {
  const [task, setTask] = useState("");

  const client = useQueryClient();

  const createTaskMutation = useMutation({
    async mutationFn(data: { title: string; description: string }) {
      return tasksRepository.createTask(data);
    },
    onSuccess() {
      return client.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const getTaskQuery = useQuery({
    queryKey: ["tasks"],
    queryFn() {
      return tasksRepository.getTasks();
    },
  });

  const handleCreateTask = async () => {
    try {
      await createTaskMutation.mutateAsync({ title: task, description: "" });
      setTask("");
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customers pages</Text>

      <View>
        <TextInput
          style={{ borderWidth: 2, padding: 4, width: "100%" }}
          placeholder="Enter a task here"
          value={task}
          onChangeText={setTask}
        />
        <Button onPress={handleCreateTask} title="Submit" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
