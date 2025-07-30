import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { TouchableOpacity, View, useColorScheme } from 'react-native';

export default function HomeTabsLayout() {
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: isDark ? '#aaa' : '#888',
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '500',
        },
        tabBarStyle: {
          height: 72,
          paddingBottom: 10,
          paddingTop: 8,
          backgroundColor: isDark ? '#1c1c1e' : '#ffffffee',
          borderTopWidth: 0.5,
          borderTopColor: isDark ? '#333' : '#ddd',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 6,
          elevation: 4,
          position: 'absolute',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="plus"
        options={{
            tabBarLabel: () => null,
            tabBarIcon: () => null, 
            tabBarButton: (props) => (
            <View style={{ position: 'absolute', top: -30, alignSelf: 'center' }}>
                <TouchableOpacity
                onPress={props.onPress}
                style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: '#007AFF',
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: '#007AFF',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.25,
                    shadowRadius: 8,
                    elevation: 6,
                }}
                >
                <Ionicons name="add" size={30} color="#fff" />
                </TouchableOpacity>
            </View>
            ),
        }}
        />

      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
