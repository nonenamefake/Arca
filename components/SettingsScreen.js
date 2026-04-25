import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';

export default function SettingsScreen({ navigation }) {
  const menuItems = [
    { id: 'bluetooth', title: 'Bluetooth', screen: 'Bluetooth' },
    { id: 'map', title: 'Zona segura', screen: 'Map' },
    { id: 'Advertencia', title: 'Advertencia', screen: 'Advertencia' },
  ];

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
        
        <Text style={styles.headerTitle}>Configuración</Text>
        
        <TouchableOpacity 
          style={styles.infoBtn}
          onPress={() => alert('Configuración general de la aplicación')}
        >
          <Text style={styles.infoIcon}>ℹ️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menu}>
        {menuItems.map((item) => (
          <TouchableOpacity 
            key={item.id}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Text style={styles.menuText}>{item.title}</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
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
  menu: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 12,
  },
  menuText: {
    fontSize: 16,
  },
  arrow: {
    fontSize: 24,
    color: '#888',
  },
});