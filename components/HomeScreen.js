import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@alarm_state';

export default function HomeScreen({ navigation }) {
  const [alarmOn, setAlarmOn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlarmState();
  }, []);

  useEffect(() => {
    if (!loading) {
      saveAlarmState(alarmOn);
    }
  }, [alarmOn]);

  const loadAlarmState = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setAlarmOn(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading alarm state:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveAlarmState = async (value) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving alarm state:', error);
    }
  };

  const toggleAlarm = useCallback(() => {
    setAlarmOn((prev) => !prev);
  }, []);

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
          onPress={toggleAlarm}
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
