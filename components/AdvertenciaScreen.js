import React, { useState, useEffect,useCallback } from 'react';
import { View, Text, Switch, TextInput, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  warningEnabled: '@warning_enabled',
  warningTime: '@warning_time',
};

export default function WarningScreen({ navigation }) {
  const [warningEnabled, setWarningEnabled] = useState(false);
  const [warningTime, setWarningTime] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (!loading) {
      saveSettings();
    }
  }, [warningEnabled, warningTime]);

  const loadSettings = async () => {
    try {
      const enabledStored = await AsyncStorage.getItem(STORAGE_KEYS.warningEnabled);
      const timeStored = await AsyncStorage.getItem(STORAGE_KEYS.warningTime);

      if (enabledStored !== null) {
        setWarningEnabled(JSON.parse(enabledStored));
      }

      if (timeStored !== null) {
        setWarningTime(timeStored);
      }
    } catch (error) {
      console.error('Error al cargar la configuracion:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.warningEnabled, JSON.stringify(warningEnabled));
      await AsyncStorage.setItem(STORAGE_KEYS.warningTime, warningTime);
    } catch (error) {
      console.error('Error al guardar la configuracion:', error);
    }
  };

  const handleToggle = (value) => {
    setWarningEnabled(value);
  };

  const handleTimeChange = useCallback((text) => {
    setWarningTime(text.replace(/[^0-9]/g, ''));
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Advertencia</Text>
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
        
        <Text style={styles.headerTitle}>Advertencia</Text>
        
        <TouchableOpacity 
          style={styles.infoBtn}
          onPress={() => alert('Configurar tiempo de advertencia antes de sonar la alarma')}
        >
          <Text style={styles.infoIcon}>ℹ️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.switchRow}>
          <Text style={styles.label}>Activar advertencia antes de sonar</Text>
          <Switch
            value={warningEnabled}
            onValueChange={handleToggle}
          />
        </View>

        {warningEnabled && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tiempo de advertencia (segundos):</Text>
            <TextInput
              style={styles.input}
              value={warningTime}
              onChangeText={handleTimeChange}
              keyboardType="numeric"
              placeholder="Ej: 10"
            />
          </View>
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
  inputContainer: {
    marginTop: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    fontSize: 16,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#888',
  },
});
