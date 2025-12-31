import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function BookmarkList({
  bookmarks,
  colors,
  onSelect,
  onClose,
}: any) {
  return (
    <Pressable
      onPress={onClose}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 998,
      }}
    >
      <Pressable
        onPress={() => {}}
        style={{
          position: 'absolute',
          top: 90,
          left: 20,
          right: 20,
          maxHeight: 300,
          backgroundColor: colors.inputBg,
          borderRadius: 10,
          elevation: 8,
        }}
      >
        <View
          style={{
            padding: 12,
            borderBottomWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontWeight: 'bold',
              fontSize: 16,
            }}
          >
            Bookmarks
          </Text>
        </View>

        <ScrollView>
          {bookmarks.length === 0 && (
            <Text
              style={{
                padding: 12,
                color: colors.text,
                opacity: 0.6,
              }}
            >
              No bookmarks yet
            </Text>
          )}

          {bookmarks.map((b: string, i: number) => (
            <TouchableOpacity
              key={i}
              onPress={() => onSelect(b)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 12,
                borderBottomWidth: 1,
                borderColor: colors.border,
              }}
            >
              <MaterialIcons
                name="link"
                size={18}
                color={colors.text}
                style={{ marginRight: 8 }}
              />

              <Text
                numberOfLines={1}
                style={{ color: colors.text, flex: 1 }}
              >
                {b}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Pressable>
    </Pressable>
  );
}
