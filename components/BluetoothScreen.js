import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, SafeAreaView, StatusBar, FlatList, TouchableOpacity } from 'react-native';

const initialDevices = [
  { id: '1', name: 'Xiaomi Band 7', address: 'AA:BB:CC:DD:EE:FF', enabled: false },
  { id: '2', name: 'AirPods Pro', address: '11:22:33:44:55:66', enabled: true },
  { id: '3', name: 'Galaxy Watch', address: '77:88:99:AA:BB:CC', enabled: false },
];

export default function BluetoothScreen({ navigation }) {
  const [devices, setDevices] = useState(initialDevices);

  const toggleDevice = (id) => {
    setDevices(devices.map(d => 
      d.id === id ? { ...d, enabled: !d.enabled } : d
    ));
  };

  const renderItem = ({ item }) => (
    <View style={styles.deviceItem}>
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>{item.name}</Text>
        <Text style={styles.deviceAddress}>{item.address}</Text>
      </View>
      <Switch
        value={item.enabled}
        onValueChange={() => toggleDevice(item.id)}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Bluetooth</Text>
        
        <TouchableOpacity 
          style={styles.infoBtn}
          onPress={() => alert('Administrar dispositivos Bluetooth vinculados')}
        >
          <Text style={styles.infoIcon}>ℹ️</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Dispositivos Vinculados</Text>
      
      <FlatList
        data={devices}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backBtn: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoBtn: {
    padding: 8,
  },
  infoIcon: {
    fontSize: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginTop: 16,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  deviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 12,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '500',
  },
  deviceAddress: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
});