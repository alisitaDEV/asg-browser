import { useEffect, useRef, useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import Toast, { BaseToast } from 'react-native-toast-message';
import {
  BackHandler,
  Platform,
  View,
  Pressable,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from './components/Header';
import Toolbar from './components/Toolbar';
import MenuSheet from './components/MenuSheet';
import BookmarkList from './components/BookmarkList';
import TabList from './components/TabList';

const HEADER_HEIGHT = 50;

type Tab = {
  id: string;
  url: string;
  canGoBack: boolean;
  canGoForward: boolean;
};

export default function Index() {
  const webViewRef = useRef<WebView>(null);
  const [inputUrl, setInputUrl] = useState('https://almuhsinin.my.id');
  const [url, setUrl] = useState('about:blank');
  const [progress, setProgress] = useState(0);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>();
  const [showTabs, setShowTabs] = useState(false);

  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    url: string;
    x: number;
    y: number;
  }>({
    visible: false,
    url: '',
    x: 0,
    y: 0,
  });

  const overlayVisible = showMenu || showBookmarks || showTabs;

  const closeAllSheets = () => {
    setShowMenu(false);
    setShowBookmarks(false);
    setShowTabs(false);
  };

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

  /* ================= SAVE DARK MODE ================= */
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
      await AsyncStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
      
      Toast.show({
        type: 'success',
        text1: 'Bookmark ditambahkan!',
        position: 'bottom',
        visibilityTime: 2000,
      });
    } else {
      Toast.show({
        type: 'success',
        text1: 'Sudah ada di bookmark',
        position: 'bottom',
        visibilityTime: 2000,
      });
    }
  };

  const deleteBookmark = async (urlToDelete: string) => {
    const newBookmarks = bookmarks.filter(b => b !== urlToDelete);
    setBookmarks(newBookmarks);
    try {
      await AsyncStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
    } catch (e) {
      console.error('Failed to delete bookmark', e);
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
        if (showTabs) {
          setShowTabs(false);
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
  }, [canGoBack, showMenu, showBookmarks, showTabs]);

  /* ================= URL ================= */
  const openUrl = () => {
    let finalUrl = inputUrl.trim();

    if (!finalUrl) return;

    if (!finalUrl.startsWith('http')) {
      finalUrl = 'https://' + finalUrl;
    }
    setUrl(finalUrl);

    if (activeTabId) {
      setTabs(prev =>
        prev.map(t =>
          t.id === activeTabId
            ? { ...t, url: finalUrl }
            : t
        )
      );
      setUrl(finalUrl); 
    } else {
      const newTab: Tab = {
        id: Date.now().toString(),
        url: finalUrl,
        canGoBack: false,
        canGoForward: false,
      };
      setTabs([newTab]);
      setActiveTabId(newTab.id);
      setUrl(finalUrl);
    }

    closeAllSheets();
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

  const toastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: '#4caf50',
          backgroundColor: darkMode ? '#333333' : '#ffffff',  // background ikut dark mode
          borderRadius: 8,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 15,
          fontWeight: '600',
          color: darkMode ? '#ffffff' : '#000000',  // teks ikut dark mode
        }}
        text2Style={{
          fontSize: 13,
          color: darkMode ? '#cccccc' : '#666666',
        }}
      />
    ),

    // Optional: kalau mau error toast juga custom
    error: (props) => (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: '#f44336',
          backgroundColor: darkMode ? '#333333' : '#ffffff',
        }}
        text1Style={{
          color: darkMode ? '#ffffff' : '#000000',
        }}
        text2Style={{
          color: darkMode ? '#cccccc' : '#666666',
        }}
      />
    ),
  };

  /* ================= INITIAL TAB ================= */
  useEffect(() => {
    if (tabs.length === 0) {
      const initialTab: Tab = {
        id: Date.now().toString(),
        url: 'about:blank',
        canGoBack: false,
        canGoForward: false,
      };
      setTabs([initialTab]);
      setActiveTabId(initialTab.id);
      setUrl('about:blank');
      setInputUrl('');
    }
  }, [tabs.length]); // hanya jalan saat tabs kosong

  /* INJECT KONSTANTA INI DI SINI */
  const INJECTED_JAVASCRIPT = `(function() {
    let longPressTimer;
    const LONG_PRESS_DURATION = 500;

    // Mencegah context menu default
    document.addEventListener('contextmenu', function(e) {
      if (e.target.tagName === 'A' || e.target.closest('a')) {
        e.preventDefault();
      }
    });

    document.addEventListener('touchstart', function(e) {
      const anchor = e.target.tagName === 'A' ? e.target : e.target.closest('a');
      
      if (anchor) {
        const link = anchor.href;
        if (!link) return;

        longPressTimer = setTimeout(function() {
          const touch = e.touches[0];
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'LONG_PRESS_LINK',
            url: link,
            x: touch.clientX,
            y: touch.clientY
          }));
        }, LONG_PRESS_DURATION);
      }
    }, { passive: true });

    document.addEventListener('touchend', function() {
      clearTimeout(longPressTimer);
    });

    document.addEventListener('touchmove', function() {
      clearTimeout(longPressTimer);
    });

    // Support mouse right click (untuk emulator/web)
    document.addEventListener('mousedown', function(e) {
      if (e.target.tagName === 'A' && e.button === 2) {
        e.preventDefault();
        const link = e.target.href;
        if (link) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'LONG_PRESS_LINK',
            url: link,
            x: e.clientX,
            y: e.clientY
          }));
        }
      }
    });
  })();`;

  /* ================= RENDER ================= */
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
            onMenu={() => {
              setShowMenu(prev => !prev);
              setShowBookmarks(false);
              setShowTabs(false);
            }}
            onTab={() => {
              setShowTabs(prev => !prev);
              setShowMenu(false);
              setShowBookmarks(false);
            }}
          />
        </Header>
      </View>

      {/* ================= TAB LIST ================= */}
      {showTabs && (
        <View
          style={{
            position: 'absolute',
            top: HEADER_HEIGHT,
            left: 0,
            right: 0,
            zIndex: 70,
            backgroundColor: colors.header,
          }}
        >
          <TabList
            tabs={tabs}
            activeTabId={activeTabId}
            colors={colors}
            onSelect={(tab) => {
              setActiveTabId(tab.id);
              setUrl(tab.url); // Penting agar state sinkron
              setInputUrl(tab.url === 'about:blank' ? '' : tab.url);
              setCanGoBack(tab.canGoBack); // Ambil status back dari tab tersebut
              setCanGoForward(tab.canGoForward);
              closeAllSheets();
            }}
            onClose={(tab) => {
              setTabs(prev => prev.filter(t => t.id !== tab.id));
              if (tab.id === activeTabId && tabs.length > 1) {
                const nextTab = tabs.find(t => t.id !== tab.id);
                if (nextTab) {
                  setActiveTabId(nextTab.id);
                  setUrl(nextTab.url);
                  setInputUrl(nextTab.url);
                }
              } else if (tabs.length === 1) {
                setActiveTabId(undefined);
                setUrl('about:blank');
                setInputUrl('');
              }
            }}
            onAddTab={() => {
              const newTab: Tab = {
                id: Date.now().toString(),
                url: 'about:blank',
                canGoBack: false,
                canGoForward: false,
              };
              setTabs(prev => [...prev, newTab]);
              setActiveTabId(newTab.id);
              setUrl('about:blank');
              setInputUrl('');
              closeAllSheets();
            }}
          />
        </View>
      )}

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
          onPress={closeAllSheets}
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
              closeAllSheets();
            }}
            onAddBookmark={() => {
              addBookmark();
              closeAllSheets();
            }}
            onShowBookmarks={() => {
              setShowMenu(false);
              setShowBookmarks(true);
              setShowTabs(false);
            }}
            onClose={closeAllSheets}
          />
        </View>
      )}

      {/* ================= BOOKMARK LIST ================= */}
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
              closeAllSheets();
            }}
            onClose={closeAllSheets}
            onDelete={deleteBookmark} 
          />
        </View>
      )}

      {/* ================= WEBVIEW / IFRAME ================= */}
      {contextMenu.visible && (
        <>
          {/* Blocker agar bisa tap di luar untuk close */}
          <Pressable
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 90,
            }}
            onPress={() => setContextMenu({ visible: false, url: '', x: 0, y: 0 })}
          />

          {/* Menu itu sendiri */}
          <View
            style={{
              position: 'absolute',
              left: contextMenu.x,
              top: contextMenu.y,
              backgroundColor: darkMode ? '#333' : '#fff',
              borderRadius: 8,
              paddingVertical: 8,
              elevation: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              zIndex: 100,
              minWidth: 180,
            }}
          >
            <Pressable
              onPress={async () => {
                await Clipboard.setStringAsync(contextMenu.url);
                Toast.show({
                  type: 'success',
                  text1: 'Link berhasil disalin!',
                  position: 'bottom',
                  visibilityTime: 2000,
                });
                setContextMenu({ visible: false, url: '', x: 0, y: 0 });
              }}
              style={{ padding: 12 }}
            >
              <Text style={{ color: colors.text }}>Copy Link</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                const newTab: Tab = {
                  id: Date.now().toString(),
                  url: contextMenu.url,
                  canGoBack: false,
                  canGoForward: false,
                };
                setTabs(prev => [...prev, newTab]);
                setActiveTabId(newTab.id);
                setUrl(newTab.url);
                setInputUrl(newTab.url);
                setContextMenu({ visible: false, url: '', x: 0, y: 0 });
              }}
              style={{ padding: 12 }}
            >
              <Text style={{ color: colors.text }}>Open in New Tab</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setUrl(contextMenu.url);
                setInputUrl(contextMenu.url);
                setTabs(prev => prev.map(t =>
                  t.id === activeTabId ? { ...t, url: contextMenu.url } : t
                ));
                setContextMenu({ visible: false, url: '', x: 0, y: 0 });
              }}
              style={{ padding: 12, borderTopWidth: 1, borderTopColor: colors.border }}
            >
              <Text style={{ color: colors.text }}>Open in Current Tab</Text>
            </Pressable>

            <Pressable
              onPress={() => setContextMenu({ visible: false, url: '', x: 0, y: 0 })}
              style={{ padding: 12 }}
            >
              <Text style={{ color: 'gray' }}>Cancel</Text>
            </Pressable>
          </View>
        </>
      )}

      {/* ================= MULTI-TAB WEBVIEW RENDERER ================= */}
      {tabs.map((tab) => (
        <View
          key={tab.id}
          style={{
            flex: 1,
            // Jika tab ID cocok dengan yang aktif, tampilkan. Jika tidak, sembunyikan (tapi tetap ada di memori)
            display: tab.id === activeTabId ? 'flex' : 'none',
          }}
        >
          {tab.url === 'about:blank' || tab.url === '' ? (
            /* Tampilan Halaman Utama (ASG Browser) */
            <View style={{ 
              flex: 1, 
              justifyContent: 'center', 
              alignItems: 'center', 
              backgroundColor: darkMode ? '#121212' : '#f5f5f5' 
            }}>
              <Text style={{ 
                fontSize: 42, 
                fontWeight: 'bold', 
                color: colors.progress, 
                marginBottom: 10 
              }}>
                ASG Browser
              </Text>
              <Text style={{ 
                fontSize: 16, 
                color: colors.text, 
                opacity: 0.7 
              }}>
                Browser privat dibuat oleh M Ali Muhsinin
              </Text>
            </View>
          ) : (
            /* Mesin Browser per Tab */
            Platform.OS === 'web' ? (
              <iframe
                src={tab.url}
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            ) : (
              <WebView
                // Ref hanya ditempelkan pada tab yang aktif agar toolbar mengontrol halaman yang benar
                ref={tab.id === activeTabId ? webViewRef : null}
                source={{ uri: tab.url }}
                scrollEnabled={!overlayVisible}
                injectedJavaScript={INJECTED_JAVASCRIPT}  
                onMessage={(event) => {                  
                  try {
                    const data = JSON.parse(event.nativeEvent.data);
                    if (data.type === 'LONG_PRESS_LINK') {
                      setContextMenu({
                        visible: true,
                        url: data.url,
                        x: data.x - 80,
                        y: data.y + HEADER_HEIGHT + 10,
                      });
                    }
                  } catch (e) {
                    console.log('Invalid message');
                  }
                }}
                onLoadProgress={({ nativeEvent }) => {
                  // Hanya update progress bar jika tab ini yang sedang dilihat
                  if (tab.id === activeTabId) {
                    setProgress(nativeEvent.progress);
                  }
                }}
                onNavigationStateChange={nav => {
                  // Update data di daftar tabs secara spesifik untuk ID tab ini
                  setTabs(prev =>
                    prev.map(t =>
                      t.id === tab.id
                        ? { ...t, canGoBack: nav.canGoBack, canGoForward: nav.canGoForward, url: nav.url }
                        : t
                    )
                  );

                  // Jika tab yang sedang berubah ini adalah tab aktif, update UI utama
                  if (tab.id === activeTabId) {
                    setCanGoBack(nav.canGoBack);
                    setCanGoForward(nav.canGoForward);
                    setInputUrl(nav.url);
                    setUrl(nav.url);
                  }
                }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                mediaPlaybackRequiresUserAction={false}
                allowsFullscreenVideo={true}
                {...(Platform.OS === 'android' ? { forceDarkOn: darkMode } : {})}
              />
            )
          )}
        </View>
      ))}

      <Toast config={toastConfig} />
    </SafeAreaView>
  );
}