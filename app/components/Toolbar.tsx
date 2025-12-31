import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import IconBtn from './IconBtn';

export default function Toolbar({
  colors,
  canGoBack,
  canGoForward,
  webViewRef,
  onMenu,
  onTab,
}: any) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 6,
        paddingBottom: 6,
        backgroundColor: colors.header,
      }}
    >
      {/* LEFT */}
      <View style={{ flexDirection: 'row' }}>
        <IconBtn
          onPress={() => webViewRef.current?.goBack()}
          disabled={!canGoBack}
        >
          <Ionicons name="arrow-back" size={22} color={colors.icon} />
        </IconBtn>

        <IconBtn
          onPress={() => webViewRef.current?.goForward()}
          disabled={!canGoForward}
        >
          <Ionicons name="arrow-forward" size={22} color={colors.icon} />
        </IconBtn>

        <IconBtn onPress={() => webViewRef.current?.reload()}>
          <Ionicons name="refresh" size={22} color={colors.icon} />
        </IconBtn>
      </View>

      {/* RIGHT */}
      <View style={{ flexDirection: 'row' }}>
        {/* TAB BUTTON */}
        <IconBtn onPress={onTab}>
          <Ionicons name="albums-outline" size={22} color={colors.icon} />
        </IconBtn>

        {/* MENU */}
        <IconBtn onPress={onMenu}>
          <Ionicons
            name="ellipsis-vertical"
            size={22}
            color={colors.icon}
          />
        </IconBtn>
      </View>
    </View>
  );
}
  