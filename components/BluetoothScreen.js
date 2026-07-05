import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { PermissionsAndroid, View, Text, Switch, StyleSheet, StatusBar, FlatList, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@linked_devices';

export default function BluetoothScreen({ navigation }) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error , seterror] = useState('')
  const [active, setActive] = useState([]);



  
  const renderItem = ({ item }) => (
    <View style={styles.deviceItem}>
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>{item.nombre}</Text>
        <Text style={styles.deviceAddress}>{item.DireccionMac}</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, item.Estado ? styles.connected : styles.disconnected]} />
          <Text style={[styles.statusText, item.Estado ? styles.connectedText : styles.disconnectedText]}>
            {item.Estado ? 'Conectado' : 'Desconectado'}
          </Text>
        </View>
      </View>
      <Switch
        value={active.some(a => a.id === item.id && a.active) ? true : false}
        onValueChange={() => toggleDevice(item)}
      />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bluetooth</Text>
          <View style={styles.infoBtn}>
            <Text style={styles.infoIcon}>ℹ️</Text>
          </View>
        </View>
        <Text style={styles.loadingText}>Cargando dispositivos...</Text>
      </SafeAreaView>
    );
  }
  if(error) return <Text style={{Color:'red'}}>{error}</Text>
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
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay dispositivos vinculados</Text>
        }
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  connected: {
    backgroundColor: '#4CAF50',
  },
  disconnected: {
    backgroundColor: '#9E9E9E',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  connectedText: {
    color: '#4CAF50',
  },
  disconnectedText: {
    color: '#9E9E9E',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#888',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#888',
  },
});
