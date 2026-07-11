import React, { useState, useEffect, useCallback } from 'react';
import { PermissionsAndroid, View, Text, Switch, StyleSheet, StatusBar, FlatList, TouchableOpacity, SafeAreaView, Platform, NativeModules, NativeEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BleManager from 'react-native-ble-manager';


const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
const STORAGE_KEY_REFERENCES = '@arca/reference-devices';

async function loadReferenceIds() {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY_REFERENCES);
    if (json) {
      const ids = JSON.parse(json);
      return new Set(ids);
    }
  } catch (error) {
    console.error('Error loading reference IDs:', error);
  }
  return new Set();
}
async function saveReferenceIds(ids) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY_REFERENCES, JSON.stringify([...ids]));
  } catch (error) {
    console.error('Error saving reference IDs:', error);
  }
}
export default function BluetoothScreen({ navigation }) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error , seterror] = useState('')
  const [active, setActive] = useState(new Set());
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);

  useEffect(() => {
    console.log('Requesting Bluetooth permissions...');
    requestPermissions().then(granted => {
      if (!granted) {
        seterror('Permisos de Bluetooth denegados');
      }
    });
  }, []);

  useEffect(() => {
    console.log('Setting up Bluetooth state listener...');
    const subscription = bleManagerEmitter.addListener('BleManagerDidUpdateState', ({ state }) => {
      if (state === 'on') {
        setIsBluetoothEnabled(true);
        loaddevices();
      } else {
        setIsBluetoothEnabled(false);
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    console.log('Initializing BleManager...');
    let listener;
    async function init() {
        await BleManager.start({
            showAlert:false
        });
        listener = bluetoothOn();
    }
    init();
    return () => {
        listener?.remove();
    };
}, []);

  const requestPermissions = useCallback(async () => {
    if (Platform.OS === 'android') {
      try {
        const permissions = [
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ];
        
        if (Platform.Version < 31) {
          permissions.push(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
        }

        const granted = await PermissionsAndroid.requestMultiple(permissions);
        return Object.values(granted).every((result) => result === PermissionsAndroid.RESULTS.GRANTED);
      } catch (err) {
        console.warn('Error requesting permissions:', err);
        return false;
      }
    }
    return true;
  }, []);

const bluetoothOn = useCallback(() => {
    const listener = BleManager.onDidUpdateState(({ state }) => {
        switch (state) {
            case 'on':
                setIsBluetoothEnabled(true);
                seterror('');
                loaddevices();
                break;
            case 'off':
                setIsBluetoothEnabled(false);
                break;
            default:
                seterror(`Estado Bluetooth: ${state}`);
                break;
        }
    });
    BleManager.checkState();
    return listener;
  }, []);
  const loaddevices = async () => {
    try {
      const bondedPeripherals = await BleManager.getBondedPeripherals();
      const connectedPeripherals = await BleManager.getConnectedPeripherals([]);
      const currentRefs = await loadReferenceIds();
      setActive(currentRefs);
      const mappedDevices = bondedPeripherals.map((p) => ({
        id: p.id,
        name: p.name || (p).advertising?.localName || 'Desconocido',
        connected: connectedPeripherals.some(cp => cp.id === p.id),
        isReference: currentRefs.has(p.id),
      }));
      setDevices(mappedDevices);
    } catch (error) {
      seterror(error.message);
    }finally {
      setLoading(false);
    }
  }
  const connectListener =
    BleManager.onConnectPeripheral(() => {
        loaddevices();
    });

const disconnectListener =
    BleManager.onDisconnectPeripheral(() => {
        loaddevices();
    });
  const toggleReference = useCallback(async (deviceId) => {
    setActive(prev => {
      const next = new Set(prev);
      if (next.has(deviceId)) {
        next.delete(deviceId);
      } else {
        next.add(deviceId);
      }
      saveReferenceIds(next);
      return next;
    });
    setDevices(prev =>
      prev.map(d => d.id === deviceId ? { ...d, isReference: !d.isReference } : d)
    );
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.deviceItem}>
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>{item.name}</Text>
        <Text style={styles.deviceAddress}>{item.id}</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, item.isReference ? styles.connected : styles.disconnected]} />
          <Text style={[styles.statusText, item.isReference ? styles.connectedText : styles.disconnectedText]}>
            {item.connected ? 'Conectado' : 'Desconectado'}
          </Text>
        </View>
      </View>
      <Switch
        value={active.has(item.id)}
        onValueChange={() => toggleReference(item.id)}
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
  else if(!isBluetoothEnabled){
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
        <Text style={styles.loadingText}>Bluetooth está desactivado. Por favor, actívelo para ver los dispositivos vinculados.</Text>
      </SafeAreaView>
    );
  }
  if(error) return <Text style={{color:'red'}}>{error}</Text>
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
