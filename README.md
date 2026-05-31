# Arca

Aplicación móvil de seguridad con alarma, geocercas y gestión de dispositivos Bluetooth. Construida con React Native (Expo).

## Funcionalidades

- **Alarma** — Activar/desactivar desde la pantalla principal. Estado persistente.
- **Bluetooth** — Visualiza y gestiona dispositivos Bluetooth vinculados. Consulta una API local (`/devices`).
- **Zona segura** — Define una geocerca en el mapa. Activa la seguridad automáticamente al salir del perímetro.
- **Advertencia** — Configura un tiempo de advertencia antes de que suene la alarma.

## Stack

- React 19 + React Native 0.81
- Expo SDK 54
- React Navigation (native-stack)
- react-native-maps + expo-location
- AsyncStorage
- Axios
- react-native-paper + @expo/vector-icons

## Requisitos

- Node.js >= 18
- Expo CLI
- Dispositivo/emulador físico (GPS, Bluetooth)

## Instalación

```bash
npm install
npx expo start
```

## API

La pantalla Bluetooth consume una API REST en `http://192.168.1.45:3434/devices`. Ajusta la URL en `components/BluetoothScreen.js` según tu red.

## Licencia

0BSD
