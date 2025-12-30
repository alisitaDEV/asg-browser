import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import IconBtn from './IconBtn';

export default function Toolbar({
  colors,
  canGoBack,
  canGoForward,
  webViewRef,
  onMenu,
}: any) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 6,
        paddingBottom: 6,
        backgroundColor: colors.header, // PENTING
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

      {/* MENU */}
      <IconBtn onPress={onMenu}>
        <Ionicons
          name="ellipsis-vertical"
          size={22}
          color={colors.icon}
        />
      </IconBtn>
    </View>
  );
}
