import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';

export default function HomeScreen({ navigation }) {
  const [alarmOn, setAlarmOn] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar/>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Arca</Text>
        <TouchableOpacity 
          style={styles.settingsBtn}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.statusText}>
          {alarmOn ? 'Alarma Encendida' : 'Alarma Apagada'}
        </Text>

        <TouchableOpacity 
          style={[styles.alarmBtn, alarmOn ? styles.alarmOn : styles.alarmOff]}
          onPress={() => setAlarmOn(!alarmOn)}
        >
          <Text style={styles.alarmBtnText}>
            {alarmOn ? 'Desactivar Alarma' : 'Activar Alarma'}
          </Text>
        </TouchableOpacity>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  settingsBtn: {
    padding: 8,
  },
  settingsIcon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  alarmBtn: {
    width: 200,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alarmOff: {
    backgroundColor: '#4CAF50',
  },
  alarmOn: {
    backgroundColor: '#F44336',
  },
  alarmBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});