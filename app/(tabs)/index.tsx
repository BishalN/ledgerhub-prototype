import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";

import { Text, View } from "@/components/Themed";
import { useState } from "react";
import { TasksRepository } from "@/data/task-repo";
import { useQuery } from "@tanstack/react-query";
import Dropdown from "react-native-input-select";

import { generateUserReport, generateWholeReport } from "@/data/reports";
import { useDebounce } from "@uidotdev/usehooks";
import { UserRepository } from "@/data/user-repo";
import { UserEntity } from "@/data/local/user-entity";
import { PieData } from "@/components/report-piechart";
import { ReportPieChart } from "@/components/report-piechart";

const tasksRepository = new TasksRepository();
const userRepository = new UserRepository();

export default function ReportsScreen() {
  const [userSearch, setUserSearch] = useState<string>("");
  const debouncedSearch = useDebounce(userSearch, 300);

  const [selectedUser, setSelectedUser] = useState<UserEntity | null>(null);

  const getCustomersByNameQuery = useQuery({
    queryKey: ["customers", debouncedSearch],
    enabled: debouncedSearch.length > 0,
    queryFn: async () => {
      return userRepository.getCustomersByName(debouncedSearch);
    },
  });

  const getWholeReport = useQuery({
    queryKey: ["wholeReport"],
    queryFn: async () => {
      return generateWholeReport();
    },
  });

  const getUserReport = useQuery({
    enabled: !!selectedUser?.id,
    queryKey: ["userReport", selectedUser?.id],
    queryFn: async () => {
      return generateUserReport(selectedUser!.id);
    },
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Whole Report</Text>
      {getWholeReport.isLoading && <ActivityIndicator />}
      {getWholeReport.isError && (
        <Text>Error: {getWholeReport.error.message}</Text>
      )}
      {getWholeReport.isSuccess && (
        <View>
          <Text>{JSON.stringify(getWholeReport.data, null, 2)}</Text>
          <ReportPieChart data={PieData(getWholeReport.data)} />
        </View>
      )}

      <Text style={styles.title}>User Report</Text>
      <Dropdown
        labelStyle={{ display: "none" }}
        placeholder="Search a user for report..."
        isSearchable
        searchControls={{
          textInputProps: {
            value: userSearch,
            onChangeText: (text) => setUserSearch(text),
          },
        }}
        options={
          getCustomersByNameQuery.data?.map((customer) => ({
            label: customer.name,
            value: customer,
          }))! ?? [
            {
              label: "Loading",
              value: "",
            },
          ]
        }
        selectedValue={selectedUser!}
        onValueChange={(value: UserEntity) => setSelectedUser(value)}
        primaryColor={"green"}
      />

      {getUserReport.isLoading && <ActivityIndicator />}
      {getUserReport.isError && (
        <Text>Error: {getUserReport.error.message}</Text>
      )}
      {getUserReport.isSuccess && (
        <View>
          <Text>{JSON.stringify(getUserReport.data, null, 2)}</Text>
          <ReportPieChart data={PieData(getUserReport.data)} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
