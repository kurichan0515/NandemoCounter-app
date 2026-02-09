import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'カウンター',
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="analysis"
        options={{
          title: '分析',
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="tags"
        options={{
          title: 'タグ',
          tabBarIcon: () => null,
        }}
      />
    </Tabs>
  );
}
