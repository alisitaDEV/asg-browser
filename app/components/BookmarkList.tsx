import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type BookmarkListProps = {
  bookmarks: string[];
  colors: any;
  onSelect: (url: string) => void;
  onClose: () => void;
  onDelete: (url: string) => void; 
};

export default function BookmarkList({
  bookmarks,
  colors,
  onSelect,
  onClose,
  onDelete,
}: BookmarkListProps) {
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
        backgroundColor: 'rgba(0,0,0,0.3)', 
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
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <View
          style={{
            padding: 12,
            borderBottomWidth: 1,
            borderColor: colors.border,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
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
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* List */}
        <ScrollView>
          {bookmarks.length === 0 ? (
            <Text
              style={{
                padding: 16,
                color: colors.text,
                opacity: 0.6,
                textAlign: 'center',
              }}
            >
              No bookmarks yet
            </Text>
          ) : (
            bookmarks.map((b: string, i: number) => (
              <View
                key={i}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 12,
                  borderBottomWidth: i === bookmarks.length - 1 ? 0 : 1,
                  borderColor: colors.border,
                }}
              >
                {/* Bagian kiri: ikon link + URL (bisa diklik untuk buka) */}
                <TouchableOpacity
                  onPress={() => onSelect(b)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
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

                {/* Tombol hapus */}
                <TouchableOpacity
                  onPress={() => onDelete(b)}
                  style={{
                    padding: 8,
                    marginLeft: 8,
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <MaterialIcons
                    name="delete-outline"
                    size={20}
                    color="#ff4444" 
                  />
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      </Pressable>
    </Pressable>
  );
}