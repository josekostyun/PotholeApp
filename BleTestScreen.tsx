// BleTestScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
  PermissionsAndroid,
  Platform,
  TextInput,
} from "react-native";
import { BleManager } from "react-native-ble-plx";
import { potholeListStyles as styles } from "./styles/components/PotholeListScreenStyles";
import { Buffer } from "buffer";
import { SafeAreaView } from "react-native-safe-area-context";

global.Buffer = Buffer; // <-- Fixes ReferenceError: Buffer

export default function BleTestScreen() {
  const [manager] = useState(() => new BleManager());
  const [devices, setDevices] = useState<any[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<any>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [scanning, setScanning] = useState(false);
  const [input, setInput] = useState("");

  const SERVICE_UUID = "49535343-fe7d-4ae5-8fa9-9fafd205e455";
  const NOTIFY_UUID = "49535343-1e4d-4bd9-ba61-23c647249616";
  const WRITE_UUID = "49535343-4c8a-39b3-2f49-511cff073b7e";

  // --- Permissions ---
  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === "android") {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]);
      }
    };
    requestPermissions();
    return () => manager.destroy();
  }, [manager]);

  // --- Scan for Devices ---
  const startScan = async () => {
    setDevices([]);
    setScanning(true);
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        Alert.alert("Scan Error", error.message);
        setScanning(false);
        return;
      }
      if (device && device.name && !devices.some((d) => d.id === device.id)) {
        setDevices((prev) => [...prev, device]);
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      setScanning(false);
    }, 8000);
  };

  // --- Connect & Subscribe ---
  const connectToDevice = async (device: any) => {
    try {
      const connected = await manager.connectToDevice(device.id);
      await connected.discoverAllServicesAndCharacteristics();
      setConnectedDevice(connected);
      Alert.alert("Connected", `Connected to ${device.name}`);

      // Subscribe exactly like nRF Connect
      connected.monitorCharacteristicForService(
        SERVICE_UUID,
        NOTIFY_UUID,
        (error, characteristic) => {
          if (error) {
            console.error("Notification error:", error);
            return;
          }
          if (characteristic?.value) {
            const decoded = Buffer.from(
              characteristic.value,
              "base64"
            ).toString("utf8");
            setMessages((prev) => [
              ...prev,
              `[${new Date().toLocaleTimeString()}] ${decoded}`,
            ]);
          }
        }
      );
    } catch (err: any) {
      console.error("Connection error:", err);
      Alert.alert("Connection failed", err.message);
    }
  };

  // --- Write to Device (UART TX) ---
  const sendMessage = async () => {
    if (!connectedDevice || !input.trim()) return;
    try {
      const encoded = Buffer.from(input, "utf8").toString("base64");
      await connectedDevice.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        WRITE_UUID,
        encoded
      );
      setMessages((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] (Sent) ${input}`,
      ]);
      setInput("");
    } catch (err) {
      console.error("Write error:", err);
      Alert.alert("Write failed", err.message);
    }
  };

  // --- Disconnect ---
  const disconnectDevice = async () => {
    if (connectedDevice) {
      await manager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      Alert.alert("Disconnected", "Device disconnected");
    }
  };

  // --- UI ---
  return (
    <SafeAreaView style={[styles.container, { padding: 20 }]}>
      <Text
        style={{
          color: "#FFF",
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        BLE Test Screen
      </Text>

      {!connectedDevice ? (
        <>
          <TouchableOpacity
            onPress={startScan}
            style={[
              styles.button,
              {
                backgroundColor: scanning ? "#555" : "#1e90ff",
                marginBottom: 15,
              },
            ]}
            disabled={scanning}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              {scanning ? "Scanning..." : "Scan for Devices"}
            </Text>
          </TouchableOpacity>

          <FlatList
            data={devices}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: "#2e2e2e", marginBottom: 10 },
                ]}
                onPress={() => connectToDevice(item)}
              >
                <Text style={{ color: "#fff" }}>
                  {item.name || "Unnamed Device"}
                </Text>
                <Text style={{ color: "#888", fontSize: 10 }}>{item.id}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      ) : (
        <>
          <TouchableOpacity
            onPress={disconnectDevice}
            style={[
              styles.button,
              { backgroundColor: "#ff4040", marginBottom: 10 },
            ]}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Disconnect</Text>
          </TouchableOpacity>

          <Text
            style={{
              color: "#0ff",
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            Connected to: {connectedDevice.name || "Unnamed"}
          </Text>

          <ScrollView
            style={{
              backgroundColor: "#1C1A1A",
              padding: 10,
              borderRadius: 10,
              maxHeight: 300,
              marginBottom: 10,
            }}
          >
            {messages.map((msg, i) => (
              <Text
                key={i}
                style={{
                  color: "#fff",
                  fontSize: 14,
                  marginVertical: 2,
                  fontFamily: "Courier",
                }}
              >
                {msg}
              </Text>
            ))}
          </ScrollView>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#1a1a1a",
              borderRadius: 10,
              paddingHorizontal: 10,
            }}
          >
            <TextInput
              style={{
                flex: 1,
                color: "#fff",
                fontSize: 16,
                paddingVertical: 10,
              }}
              placeholder="Type message..."
              placeholderTextColor="#777"
              value={input}
              onChangeText={setInput}
            />
            <TouchableOpacity
              onPress={sendMessage}
              style={{
                backgroundColor: "#1e90ff",
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Send</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
