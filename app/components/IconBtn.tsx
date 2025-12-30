import { TouchableOpacity } from 'react-native';

export default function IconBtn({
  children,
  onPress,
  disabled = false,
}: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        paddingHorizontal: 10,
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {children}
    </TouchableOpacity>
  );
}
