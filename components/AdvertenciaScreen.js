import React, { useState } from 'react';
import { View, Text, Switch, TextInput, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';

export default function WarningScreen({ navigation }) {
  const [warningEnabled, setWarningEnabled] = useState(false);
  const [warningTime, setWarningTime] = useState('');

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
            onValueChange={setWarningEnabled}
          />
        </View>

        {warningEnabled && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tiempo de advertencia (segundos):</Text>
            <TextInput
              style={styles.input}
              value={warningTime}
              onChangeText={setWarningTime}
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
});