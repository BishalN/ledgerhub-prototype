import {
  Alert,
  Button,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";

import { Text, View } from "@/components/Themed";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TransactionRepository } from "@/data/transaction-repo";
import { TransactionEntity } from "@/data/local/transaction-entity";
import { useState } from "react";
import Dropdown from "react-native-input-select";
import { UserRepository } from "@/data/user-repo";
import { useDebounce } from "@uidotdev/usehooks";
import { UserEntity } from "@/data/local/user-entity";

const transactionRepository = new TransactionRepository();
const userRepository = new UserRepository();

// TODO: use flat list to render transactions
export default function TransactionScreen() {
  const client = useQueryClient();
  const [userSearch, setUserSearch] = useState<string>("");
  const debouncedSearch = useDebounce(userSearch, 300);
  const [isEditing, setIsEditing] = useState(false);

  const [formState, setFormState] =
    useState<Pick<TransactionEntity, "amount" | "type" | "user" | "id">>();

  const getTransactionsQuery = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      return transactionRepository.getTransactions();
    },
  });

  const getCustomersByNameQuery = useQuery({
    queryKey: ["customers", debouncedSearch],
    enabled: debouncedSearch.length > 0,
    queryFn: async () => {
      return userRepository.getCustomersByName(debouncedSearch);
    },
  });

  const createTransactionMutation = useMutation({
    mutationFn: async (data: typeof formState) => {
      // check if formState is not null
      return transactionRepository.createTransaction(data!);
    },
    onSuccess() {
      // show success alert
      Alert.alert("Transaction created successfully");
      client.invalidateQueries({ queryKey: ["transactions"] });
      client.invalidateQueries({ queryKey: ["wholeReport"] });
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: async (transactionId: TransactionEntity["id"]) => {
      return transactionRepository.deleteTransaction(transactionId);
    },
    onSuccess() {
      // show success alert
      Alert.alert("Transaction deleted successfully");
      client.invalidateQueries({ queryKey: ["transactions"] });
      client.invalidateQueries({ queryKey: ["wholeReport"] });
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: async (data: typeof formState) => {
      // check if formState is not null
      return transactionRepository.updateTransaction(data?.id!, data!);
    },
    onSuccess() {
      // show success alert
      Alert.alert("Transaction updated successfully");
      client.invalidateQueries({ queryKey: ["transactions"] });
      client.invalidateQueries({ queryKey: ["wholeReport"] });
    },
  });

  const handleCreateTransaction = async () => {
    try {
      console.log(formState?.amount, "******");
      await createTransactionMutation.mutateAsync(formState);
      setFormState(undefined);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteTransaction = async (
    transactionId: TransactionEntity["id"]
  ) => {
    // TODO: show alert to confirm delete

    try {
      await deleteTransactionMutation.mutateAsync(transactionId);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateTransaction = async (transaction: TransactionEntity) => {
    try {
      await updateTransactionMutation.mutateAsync(transaction);
      setFormState(undefined);
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isEditing ? "Edit" : "Create"} Transactions
      </Text>
      <View className="">
        <TextInput
          style={styles.input}
          placeholder="Amount"
          keyboardType="decimal-pad"
          value={formState?.amount?.toString()}
          onChangeText={(text) =>
            setFormState({ ...formState!, amount: Number(text) })
          }
        />
        <Dropdown
          labelStyle={{ display: "none" }}
          dropdownStyle={{ marginTop: 10 }}
          placeholder="Select a transaction type..."
          options={[
            { label: "Receivable", value: "receivable" },
            { label: "Received", value: "received" },
            { label: "Payable", value: "payable" },
            { label: "Paid", value: "paid" },
          ]}
          selectedValue={formState?.type}
          onValueChange={(
            value: "receivable" | "received" | "payable" | "paid"
          ) => setFormState({ ...formState!, type: value })}
          primaryColor={"green"}
        />

        <Dropdown
          labelStyle={{ display: "none" }}
          placeholder="Select a customer..."
          isSearchable
          searchControls={{
            textInputProps: {
              value: userSearch,
              onChangeText: (text) => setUserSearch(text),
            },
          }}
          // use the query data to populate the dropdown from getCustomersByNameQuery
          options={
            getCustomersByNameQuery.data?.map((customer) => ({
              label: customer.name,
              value: customer,
            })) as any[]
          }
          selectedValue={formState?.user! as any}
          onValueChange={(value: UserEntity) =>
            setFormState({ ...formState!, user: value })
          }
          primaryColor={"green"}
        />

        <Button
          title={`${isEditing ? "Edit" : "Create"}  Transaction`}
          onPress={() => {
            isEditing
              ? handleUpdateTransaction(formState as TransactionEntity)
              : handleCreateTransaction();
          }}
        />
      </View>

      <Text style={[styles.title, { marginTop: 15 }]}>Recent Transactions</Text>
      <View>
        {getTransactionsQuery.isLoading && <Text>Loading...</Text>}
        {getTransactionsQuery.isError && (
          <Text>{getTransactionsQuery.error.message}</Text>
        )}
        <ScrollView>
          {getTransactionsQuery.isSuccess &&
            getTransactionsQuery.data.map((transaction) => (
              <Pressable
                className="bg-gray-100 my-2 p-2 text-lg"
                key={transaction.id}
              >
                <Text>{transaction.user?.name}</Text>
                <Text>{transaction.amount}</Text>
                <Text>{transaction.type}</Text>
                <View className="bg-gray-100 flex flex-row">
                  <Button
                    title="Edit"
                    onPress={() => {
                      // TODO: change the title to edit transaction
                      // set the form state to the transaction
                      // call the update mutation
                      console.log(transaction, "transaction");
                      setFormState(transaction);
                      setIsEditing(true);
                    }}
                  />
                  <Button
                    title="Delete"
                    onPress={() => handleDeleteTransaction(transaction.id)}
                  />
                </View>
              </Pressable>
            ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  input: {
    borderWidth: 2,
    padding: 10,
    width: "100%",
    borderRadius: 5,
  },
});
