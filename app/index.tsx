import { useEffect, useRef, useState } from 'react';
import { BackHandler, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import Header from './components/Header';
import Toolbar from './components/Toolbar';
import MenuSheet from './components/MenuSheet';
import BookmarkList from './components/BookmarkList';

export default function Index() {
  const webViewRef = useRef<WebView>(null);

  const [inputUrl, setInputUrl] = useState('https://example.com');
  const [url, setUrl] = useState(inputUrl);
  const [progress, setProgress] = useState(0);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  const [darkMode, setDarkMode] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  const [showMenu, setShowMenu] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);

  /* ================= ANDROID BACK ================= */
  useEffect(() => {
    const sub = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (showMenu) {
          setShowMenu(false);
          return true;
        }

        if (showBookmarks) {
          setShowBookmarks(false);
          return true;
        }

        if (canGoBack) {
          webViewRef.current?.goBack();
          return true;
        }

        return false;
      }
    );

    return () => sub.remove();
  }, [canGoBack, showMenu, showBookmarks]);

  /* ================= URL ================= */
  const openUrl = () => {
    let finalUrl = inputUrl.trim();
    if (!finalUrl.startsWith('http')) {
      finalUrl = 'https://' + finalUrl;
    }
    setUrl(finalUrl);
    setShowMenu(false);
  };

  /* ================= BOOKMARK ================= */
  const addBookmark = () => {
    if (!bookmarks.includes(url)) {
      setBookmarks([...bookmarks, url]);
    }
  };

  /* ================= COLORS ================= */
  const colors = {
    header: darkMode ? '#121212' : '#1e88e5',
    inputBg: darkMode ? '#1f1f1f' : '#fff',
    text: darkMode ? '#fff' : '#000',
    border: darkMode ? '#333' : '#ccc',
    progress: darkMode ? '#90caf9' : '#1565c0',
    icon: '#fff',
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      {/* ================= HEADER + TOOLBAR ================= */}
      <View style={{ zIndex: 10 }}>
        <Header
          inputUrl={inputUrl}
          setInputUrl={setInputUrl}
          openUrl={openUrl}
          progress={progress}
          colors={colors}
        >
          <Toolbar
            colors={colors}
            canGoBack={canGoBack}
            canGoForward={canGoForward}
            webViewRef={webViewRef}
            onMenu={() => setShowMenu(!showMenu)}
          />
        </Header>

        {/* ================= MENU ================= */}
        {showMenu && (
          <MenuSheet
            colors={colors}
            darkMode={darkMode}
            onToggleDark={() => {
              setDarkMode(!darkMode);
              setShowMenu(false);
            }}
            onAddBookmark={() => {
              addBookmark();
              setShowMenu(false);
            }}
            onShowBookmarks={() => {
              setShowMenu(false);
              setShowBookmarks(true);
            }}
            onClose={() => setShowMenu(false)}
          />
        )}

        {/* ================= BOOKMARK LIST ================= */}
        {showBookmarks && (
          <BookmarkList
            bookmarks={bookmarks}
            colors={colors}
            onSelect={(b: string) => {
              setUrl(b);
              setInputUrl(b);
              setShowBookmarks(false);
            }}
            onClose={() => setShowBookmarks(false)}
          />
        )}
      </View>

      {/* ================= WEBVIEW ================= */}
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        onLoadProgress={({ nativeEvent }) =>
          setProgress(nativeEvent.progress)
        }
        onNavigationStateChange={(nav) => {
          setCanGoBack(nav.canGoBack);
          setCanGoForward(nav.canGoForward);
          setInputUrl(nav.url);
        }}
        {...(Platform.OS === 'android'
          ? { forceDarkOn: darkMode }
          : {})}
      />
    </SafeAreaView>
  );
}
