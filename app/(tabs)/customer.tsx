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
import { UserRepository } from "@/data/user-repo";

const userRepository = new UserRepository();

export default function TabTwoScreen() {
  const [customerName, setCustomerName] = useState("");
  const [customerDescription, setCustomerDescription] = useState("");

  const client = useQueryClient();

  const createCustomerMutation = useMutation({
    async mutationFn(data: { name: string; description: string }) {
      return userRepository.createCustomer(data);
    },
    onSuccess() {
      Alert.alert("Customer created successfully");
      return client.invalidateQueries({ queryKey: ["customers"] });
    },
    onSettled() {},
  });

  const getCustomersQuery = useQuery({
    queryKey: ["customers"],
    queryFn() {
      return userRepository.getCustomers();
    },
  });

  const handleCreateCustomer = async () => {
    try {
      await createCustomerMutation.mutateAsync({
        name: customerName,
        description: customerDescription,
      });
      setCustomerName("");
      setCustomerDescription("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Customer</Text>
      <View style={styles.form_container}>
        <TextInput
          value={customerName}
          onChangeText={setCustomerName}
          style={styles.input}
          placeholder="name of customer"
        />
        <TextInput
          value={customerDescription}
          onChangeText={setCustomerDescription}
          style={[styles.input, styles.textarea]}
          placeholder="description"
        />
        <View style={{ alignSelf: "flex-start" }}>
          <Button title="Create Customer" onPress={handleCreateCustomer} />
        </View>
      </View>

      <Text style={styles.title}>Current Customers</Text>
      <View style={{ backgroundColor: "gray", padding: 5, borderRadius: 4 }}>
        {getCustomersQuery.isLoading && <ActivityIndicator />}
        {getCustomersQuery.isError && (
          <Text>{getCustomersQuery.error.message}</Text>
        )}
        {getCustomersQuery.isSuccess &&
          getCustomersQuery.data.map((customer) => (
            <View key={customer.id}>
              <Text>{customer.name}</Text>
              <Text>Created {customer?.createdAt?.toLocaleDateString()}</Text>
            </View>
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    padding: 3,
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
  form_container: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  input: {
    borderWidth: 2,
    padding: 10,
    width: "100%",
    borderRadius: 5,
  },
  textarea: {
    height: 100,
  },
});
