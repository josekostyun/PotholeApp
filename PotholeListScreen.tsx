import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { potholeListStyles, getSeverityColor } from "./styles/components/PotholeListScreenStyles";

const BASE_URL = "https://potholeappbackend.onrender.com";

export default function PotholeListScreen({ navigation }: any) {
  const [potholes, setPotholes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/potholes`)
      .then((res) => setPotholes(res.data))
      .catch((err) => console.error("Error fetching potholes:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={potholeListStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#333" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[potholeListStyles.container, { paddingTop: StatusBar.currentHeight || 30 }]}>
      <FlatList
        data={potholes}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const color = getSeverityColor(item.severity);
          return (
            <View style={[potholeListStyles.card, { borderLeftColor: color }]}>
              <Text style={potholeListStyles.latlng}>
                Lat: {item.lat?.toFixed(4)}, Lng: {item.lng?.toFixed(4)}
              </Text>
              <Text style={potholeListStyles.details}>
                Severity: {item.severity || "N/A"} | Depth: {item.depth || "N/A"} in
              </Text>
              <Text style={potholeListStyles.status}>
                Status: {item.status || "Unknown"}
              </Text>
            </View>
          );
        }}
        ListHeaderComponent={<View style={{ height: 20 }} />}
        contentContainerStyle={{ paddingBottom: 60, paddingTop: 10 }}
        ListEmptyComponent={
          <Text style={potholeListStyles.emptyText}>No potholes found.</Text>
        }
      />

      <TouchableOpacity
        style={potholeListStyles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={potholeListStyles.backButtonText}>← Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
