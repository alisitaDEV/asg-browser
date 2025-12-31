import { View, Text, Pressable, ScrollView } from 'react-native';

type Tab = {
  id: string;
  url: string;
  canGoBack: boolean;
  canGoForward: boolean;
};

type Props = {
  tabs: Tab[];
  activeTabId?: string;
  colors: { header: string; text: string; icon: string; inputBg: string };
  onSelect: (tab: Tab) => void;
  onClose: (tab: Tab) => void;
  onAddTab: () => void;
};

export default function TabList({ tabs, activeTabId, colors, onSelect, onClose, onAddTab }: Props) {
  return (
    <View
      style={{
        position: 'absolute',
        top: 90,
        left: 16,
        right: 16,
        maxHeight: 350,
        backgroundColor: colors.inputBg,
        borderRadius: 12,
        elevation: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      }}
    >
      {/* HEADER TAB LIST */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: 'bold' }}>
          Tabs
        </Text>

        {/* TOMBOL TAMBAH TAB */}
        <Pressable
          onPress={onAddTab}
          style={{
            backgroundColor: '#1976d2',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 6,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 18 }}>＋</Text>
        </Pressable>
      </View>

      {/* LIST TAB */}
      {tabs.length === 0 ? (
        <Text style={{ color: colors.text }}>No tabs open</Text>
      ) : (
        <ScrollView>
          {tabs.map(tab => (
            <View
              key={tab.id}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 8,
                paddingHorizontal: 12,
                backgroundColor:
                  tab.id === activeTabId ? '#1976d2' : colors.inputBg,
                borderRadius: 8,
                marginBottom: 6,
              }}
            >
              <Pressable onPress={() => onSelect(tab)} style={{ flex: 1 }}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: tab.id === activeTabId ? '#fff' : colors.text,
                    fontWeight: tab.id === activeTabId ? 'bold' : 'normal',
                  }}
                >
                  {tab.url}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => onClose(tab)}
                style={{
                  marginLeft: 12,
                  padding: 4,
                }}
              >
                <Text style={{ color: 'red', fontSize: 16 }}>×</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
