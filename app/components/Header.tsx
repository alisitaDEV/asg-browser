import {
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function Header({
  inputUrl,
  setInputUrl,
  openUrl,
  progress,
  colors,
  children,
}: any) {
  return (
    <View style={{ backgroundColor: colors.header }}>
      {/* ADDRESS BAR */}
      <View style={{ flexDirection: 'row', padding: 8 }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.inputBg,
            borderRadius: 6,
          }}
        >
          <TextInput
            value={inputUrl}
            onChangeText={setInputUrl}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            returnKeyType="go"
            onSubmitEditing={openUrl}
            placeholder="Search or enter address"
            placeholderTextColor="#888"
            style={{
              flex: 1,
              paddingHorizontal: 10,
              height: 40,
              color: colors.text,
            }}
          />

          {inputUrl.length > 0 && (
            <TouchableOpacity onPress={() => setInputUrl('')}>
              <MaterialIcons
                name="close"
                size={20}
                color={colors.text}
                style={{ marginRight: 8 }}
              />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          onPress={openUrl}
          style={{ paddingHorizontal: 10 }}
        >
          <Ionicons
            name="arrow-forward-circle"
            size={26}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {/* TOOLBAR */}
      {children}

      {/* PROGRESS */}
      {progress < 1 && (
        <View
          style={{
            height: 3,
            width: `${progress * 100}%`,
            backgroundColor: colors.progress,
          }}
        />
      )}
    </View>
  );
}
