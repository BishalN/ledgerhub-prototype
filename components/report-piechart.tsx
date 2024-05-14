import { useState } from "react";
import { Text, View } from "react-native";
import { Pie, PolarChart } from "victory-native";

interface WholeReportProps {
  paid?: number;
  receivable?: number;
  payable?: number;
  received?: number;
}

export const PieData = (data: WholeReportProps) => {
  return [
    { value: data.paid || 0, color: "#1d4ed8", label: "Paid" },
    { value: data.payable || 0, color: "#3b82f6", label: "Payable" },
    { value: data.receivable || 0, color: "#15803d", label: "Receivable" },
    { value: data.received || 0, color: "#22c55e", label: "Received" },
  ];
};

export function ReportPieChart({ data }: { data: ReturnType<typeof PieData> }) {
  return (
    <View>
      <View
        style={{
          height: "45%",
        }}
      >
        <PolarChart
          data={data}
          colorKey={"color"}
          valueKey={"value"}
          labelKey={"label"}
        >
          <Pie.Chart></Pie.Chart>
        </PolarChart>
      </View>

      <View style={{ flexGrow: 1, padding: 15 }}>
        <Text>
          TODO: Add a legend here. The legend should show the colors and the
          labels of the pie chart.
        </Text>
      </View>
    </View>
  );
}

//TODO: create a good error message in ide when used ts and trying todo tsx stuff
