import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MenuSheet({
  colors,
  darkMode,
  onToggleDark,
  onAddBookmark,
  onShowBookmarks,
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
        zIndex: 999,
      }}
    >
      <Pressable
        onPress={() => {}}
        style={{
          position: 'absolute',
          top: 90,
          right: 10,
          backgroundColor: colors.inputBg,
          borderRadius: 8,
          elevation: 6,
          minWidth: 220,
        }}
      >
        <MenuItem
          icon="bookmark-outline"
          label="Add Bookmark"
          onPress={onAddBookmark}
          colors={colors}
        />

        <MenuItem
          icon="bookmarks-outline"
          label="Show Bookmarks"
          onPress={onShowBookmarks}
          colors={colors}
        />

        <MenuItem
          icon={darkMode ? 'sunny-outline' : 'moon-outline'}
          label={darkMode ? 'Light Mode' : 'Dark Mode'}
          onPress={onToggleDark}
          colors={colors}
        />
      </Pressable>
    </Pressable>
  );
}

function MenuItem({ icon, label, onPress, colors }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
      }}
    >
      <Ionicons name={icon} size={20} color={colors.text} />
      <Text style={{ marginLeft: 12, color: colors.text }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
