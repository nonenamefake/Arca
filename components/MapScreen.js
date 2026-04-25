import React, { useState } from 'react';
import { View, Text, Switch, TextInput, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, Modal } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';

const initialRegion = {
  latitude: 19.4326,
  longitude: -99.1332,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export default function MapScreen({ navigation }) {
  const [securityAuto, setSecurityAuto] = useState(false);
  const [safeZone, setSafeZone] = useState(null);
  const [meters, setMeters] = useState('15');
  const [showMap, setShowMap] = useState(false);

  const handleMapPress = (event) => {
    if (securityAuto) {
      setSafeZone(event.nativeEvent.coordinate);
    }
  };

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
            onValueChange={(value) => {
              setSecurityAuto(value);
              setShowMap(value);
              if (!value) setSafeZone(null);
            }}
          />
        </View>

        {showMap && (
          <>
            <Text style={styles.sectionTitle}>Seleccionar Zona Segura</Text>
            
            <MapView
              style={styles.map}
              initialRegion={initialRegion}
              onPress={handleMapPress}
            >
              {safeZone && (
                <>
                  <Marker coordinate={safeZone} />
                  <Circle
                    center={safeZone}
                    radius={parseInt(meters) || 15}
                    fillColor="rgba(0, 128, 255, 0.3)"
                    strokeColor="rgba(0, 128, 255, 0.8)"
                  />
                </>
              )}
            </MapView>

            <View style={styles.meterInput}>
              <Text style={styles.label}>Metros de la zona segura (mín 15m):</Text>
              <TextInput
                style={styles.input}
                value={meters}
                onChangeText={(text) => {
                  const num = parseInt(text) || 15;
                  setMeters(num < 15 ? '15' : String(num));
                }}
                keyboardType="numeric"
                placeholder="15"
              />
            </View>
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
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    width: 100,
    marginLeft: 12,
  },
});