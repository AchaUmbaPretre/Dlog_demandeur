import React from 'react';
import {
    Image,
    Platform,
    Pressable,
    StyleSheet,
    Text,
} from 'react-native';

type ItemProps = {
  icon: number;
  label: string;
  onPress?: () => void;
};

export const Item: React.FC<ItemProps> = ({ icon, label, onPress }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.item,
      pressed && { transform: [{ scale: 0.98 }], opacity: 0.8 },
    ]}
  >
    <Image source={icon} style={styles.icon} />
    <Text style={styles.text}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  item: {
    width: '48%',
    marginBottom: 16,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  icon: {
    width: 48,
    height: 48,
    marginBottom: 12,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});
