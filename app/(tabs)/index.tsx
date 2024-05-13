import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  TextInput,
} from "react-native";

import { Text, View } from "@/components/Themed";
import { useState } from "react";
import { TasksRepository } from "@/data/task-repo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const tasksRepository = new TasksRepository();

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reports</Text>
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
