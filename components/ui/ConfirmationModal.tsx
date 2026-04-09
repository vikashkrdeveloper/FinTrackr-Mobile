import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Dimensions,
  Pressable
} from 'react-native';
import { TOKENS } from '../../theme/tokens';
import { useAppTheme } from '../../hooks/useAppTheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: 'danger' | 'info';
  icon?: string;
}

const { width } = Dimensions.get('window');

export const ConfirmationModal = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  type = 'info',
  icon = 'help-circle'
}: ConfirmationModalProps) => {
  const { theme } = useAppTheme();

  const confirmColor = type === 'danger' ? theme.error : theme.accent;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
          <View style={[styles.iconContainer, { backgroundColor: `${confirmColor}20` }]}>
            <MaterialCommunityIcons name={icon as any} size={32} color={confirmColor} />
          </View>
          
          <Text style={[styles.title, { color: theme.primary }]}>{title}</Text>
          <Text style={[styles.message, { color: theme.secondary }]}>{message}</Text>
          
          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton, { borderColor: theme.surfaceLighter }]} 
              onPress={onClose}
            >
              <Text style={[styles.cancelText, { color: theme.secondary }]}>{cancelLabel}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: confirmColor }]} 
              onPress={onConfirm}
            >
              <Text style={styles.confirmText}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: width - 40,
    maxWidth: 400,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: TOKENS.spacing.xl,
  },
  title: {
    ...TOKENS.typography.heading,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    ...TOKENS.typography.body,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  cancelText: {
    ...TOKENS.typography.body,
    fontWeight: '700',
  },
  confirmText: {
    ...TOKENS.typography.body,
    fontWeight: '700',
    color: '#000000',
  }
});
