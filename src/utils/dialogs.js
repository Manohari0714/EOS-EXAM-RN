import { Alert, Platform } from 'react-native';

// Alert.alert does nothing on web, so fall back to window.alert / confirm there.
export function notify(title, message, onOk) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
    if (onOk) onOk();
    return;
  }
  Alert.alert(title, message, [{ text: 'OK', onPress: onOk }]);
}

export function confirmDialog(title, message, onConfirm, confirmText = 'Yes') {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    { text: confirmText, style: 'destructive', onPress: onConfirm },
  ]);
}
