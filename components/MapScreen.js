import React, { useState, useEffect , useCallback} from 'react';
import { View, Text, Switch, TextInput, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, Modal, PermissionsAndroid,Platform } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  securityAuto: '@map_security_auto',
  safeZone: '@map_safe_zone',
  meters: '@map_meters',
};

export default function MapScreen({ navigation }) {
  const [securityAuto, setSecurityAuto] = useState(false);
  const [safeZone, setSafeZone] = useState(null);
  const [location, setLocation] = useState(null);
  const [ubication, setUbication] = useState(null);
  const [meters, setMeters] = useState('15');
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (!loading) {
      saveSettings();
    }
  }, [securityAuto, safeZone, meters]);

const getCurrentLocation = useCallback(async () => {
    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      console.log('Permiso denegado');
      return;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    setLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  } , [securityAuto]);
useEffect(() => {
  (async () => {
    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') return;

    subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 100,
        distanceInterval: 1,
      },
      (location) => {
        setUbication({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    );
  })();
}, []);
  const loadSettings = useCallback(async () => {
    try {
      const securityAutoStored = await AsyncStorage.getItem(STORAGE_KEYS.securityAuto);
      const safeZoneStored = await AsyncStorage.getItem(STORAGE_KEYS.safeZone);
      const metersStored = await AsyncStorage.getItem(STORAGE_KEYS.meters);

      if (securityAutoStored !== null) {
        const autoValue = JSON.parse(securityAutoStored);
        setSecurityAuto(autoValue);
        setShowMap(autoValue);
      }

      if (safeZoneStored !== null) {
        setSafeZone(JSON.parse(safeZoneStored));
      }

      if (metersStored !== null) {
        setMeters(metersStored);
      }
    } catch (error) {
      console.error('Error al cargar la configuracion:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.securityAuto, JSON.stringify(securityAuto));
      if (safeZone) {
        await AsyncStorage.setItem(STORAGE_KEYS.safeZone, JSON.stringify(safeZone));
      }
      await AsyncStorage.setItem(STORAGE_KEYS.meters, meters);
    } catch (error) {
      console.error('Error al guardar la configuracion:', error);
    }
  };
  const handleMapPress = (event) => {
    if (securityAuto) {
      setSafeZone(event.nativeEvent.coordinate);
    }
  };
  const handleSecurityToggle = (value) => {
    setSecurityAuto(value);
    setShowMap(value);
  };
  const handleMetersChange = useCallback((text) => {
    setMeters(text.replace(/[^0-9]/g, ''));
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Zona segura</Text>
          <View style={styles.infoBtn}>
            <Text style={styles.infoIcon}>ℹ️</Text>
          </View>
        </View>
        <Text style={styles.loadingText}>Cargando configuración...</Text>
      </SafeAreaView>
    );
  }
  
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
        
        <Text style={styles.headerTitle}>Zona segura</Text>
        
        <TouchableOpacity 
          style={styles.infoBtn}
          onPress={() => alert('Configurar zona segura para Alarm')}
        >
          <Text style={styles.infoIcon}>ℹ️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.switchRow}>
          <Text style={styles.label}>Seguridad automática al salir de zona</Text>
          <Switch
            value={securityAuto}
            onValueChange={handleSecurityToggle}
          />
        </View>

        {showMap && (
          <>
            <Text style={styles.sectionTitle}>Seleccionar Zona Segura</Text>
              <View style={styles.meterInput}>
              <Text style={styles.label}>Metros de la zona segura (mín 15m):</Text>
              <TextInput
                style={styles.input}
                value={meters}
                onChangeText={handleMetersChange}
                keyboardType="numeric"
                placeholder="15"
              />
            </View>
            <MapView
              style={styles.map}
              initialRegion={location}
              onPress={handleMapPress}
            >
              {safeZone && (
                <>
                  <Circle
                    center={safeZone}
                    radius={parseInt(meters) || 15}
                    fillColor="rgba(0, 128, 255, 0.3)"
                    strokeColor="rgba(0, 128, 255, 0.8)"
                  />
                </>
              )}
              {ubication && (
                <>
                  <Marker coordinate={ubication}
                  anchor={{ x: 0.5, y: 0.5 }}
                  image={require('../assets/rastreador.png')}
                  />
                </>
              )}
            </MapView>
          </>
        )}
      </View>
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
  content: {
    flex: 1,
    padding: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  label: {
    fontSize: 16,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
  },
  map: {
    height: 300,
    borderRadius: 12,
  },
  meterInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    width: 100,
    marginLeft: 12,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#888',
  },
});
