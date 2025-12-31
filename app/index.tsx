import { useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  Platform,
  View,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Header from './components/Header';
import Toolbar from './components/Toolbar';
import MenuSheet from './components/MenuSheet';
import BookmarkList from './components/BookmarkList';

const HEADER_HEIGHT = 50;

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

  const overlayVisible = showMenu || showBookmarks;

  /* ================= LOAD STORAGE ================= */
  useEffect(() => {
    (async () => {
      try {
        const d = await AsyncStorage.getItem('darkMode');
        const b = await AsyncStorage.getItem('bookmarks');
        if (d) setDarkMode(JSON.parse(d));
        if (b) setBookmarks(JSON.parse(b));
      } catch (e) {
        console.error('Failed to load storage', e);
      }
    })();
  }, []);

  /* ================= SAVE STORAGE ================= */
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem('darkMode', JSON.stringify(darkMode));
      } catch (e) {
        console.error('Failed to save darkMode', e);
      }
    })();
  }, [darkMode]);

  /* ================= BOOKMARK ================= */
  const addBookmark = async () => {
    if (!bookmarks.includes(url)) {
      const newBookmarks = [...bookmarks, url];
      setBookmarks(newBookmarks);
      try {
        await AsyncStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
      } catch (e) {
        console.error('Failed to save bookmark', e);
      }
    }
  };

  /* ================= ANDROID BACK ================= */
  useEffect(() => {
    if (Platform.OS !== 'android') return;

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

      {/* ================= HEADER ================= */}
      <View style={{ zIndex: 50 }}>
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
            onMenu={() => setShowMenu(prev => !prev)}
          />
        </Header>
      </View>

      {/* ================= TOUCH BLOCKER ================= */}
      {overlayVisible && (
        <Pressable
          style={{
            position: 'absolute',
            top: HEADER_HEIGHT,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 20,
          }}
          onPress={() => {
            setShowMenu(false);
            setShowBookmarks(false);
          }}
        />
      )}

      {/* ================= MENU ================= */}
      {showMenu && (
        <View
          style={{
            position: 'absolute',
            top: HEADER_HEIGHT,
            right: 8,
            zIndex: 60,
          }}
        >
          <MenuSheet
            colors={colors}
            darkMode={darkMode}
            onToggleDark={() => {
              setDarkMode(p => !p);
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
        </View>
      )}

      {/* ================= BOOKMARK LIST (FIXED) ================= */}
      {showBookmarks && (
        <View
          style={{
            position: 'absolute',
            top: HEADER_HEIGHT,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 60,
          }}
        >
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
        </View>
      )}

      {/* ================= CONTENT ================= */}
      {Platform.OS === 'web' ? (
        <iframe
          src={url}
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      ) : (
        <WebView
          ref={webViewRef}
          source={{ uri: url }}
          scrollEnabled={!overlayVisible}
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
      )}
    </SafeAreaView>
  );
}