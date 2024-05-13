import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  TextInput,
} from "react-native";

import { Text, View } from "@/components/Themed";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserRepository } from "@/data/user-repo";
import { UserEntity } from "@/data/local/user-entity";
import { styled } from "nativewind";

const userRepository = new UserRepository();

const StyledView = styled(View);
const StyledText = styled(Text);

// TODO: use flat list to render customers and add a search by name feature
export default function CustomerScreen() {
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
      <View style={{ display: "flex", gap: 7, flexDirection: "column" }}>
        {getCustomersQuery.isLoading && <ActivityIndicator />}
        {getCustomersQuery.isError && (
          <Text>{getCustomersQuery.error.message}</Text>
        )}
        {getCustomersQuery.isSuccess &&
          getCustomersQuery.data.map((customer) => (
            <CustomerItem key={customer.id} customer={customer} />
          ))}
      </View>
    </View>
  );
}

export const CustomerItem = ({ customer }: { customer: UserEntity }) => {
  return (
    <StyledView className="bg-gray-300 p-3 rounded-md shadow-md">
      <StyledText>{customer.name}</StyledText>
      <StyledText>{customer.description}</StyledText>
      <Text>{customer.createdAt?.toLocaleDateString()}</Text>
      <View className="flex flex-row bg-gray-300 ">
        <Button title="Delete" onPress={() => {}} />
        <Button title="Edit" onPress={() => {}} />
      </View>
    </StyledView>
  );
};

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
