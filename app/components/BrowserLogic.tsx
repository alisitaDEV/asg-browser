// app/components/BrowserLogic.tsx

import { useEffect, useRef, useState } from 'react';
import { Platform, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';

export type Tab = {
  id: string;
  url: string;
  canGoBack: boolean;
  canGoForward: boolean;
};

export type BrowserLogicReturn = {
  webViewRef: React.RefObject<WebView>;
  inputUrl: string;
  setInputUrl: React.Dispatch<React.SetStateAction<string>>;
  url: string;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  progress: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  canGoBack: boolean;
  setCanGoBack: React.Dispatch<React.SetStateAction<boolean>>;
  canGoForward: boolean;
  setCanGoForward: React.Dispatch<React.SetStateAction<boolean>>;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  bookmarks: string[];
  setBookmarks: React.Dispatch<React.SetStateAction<string[]>>;
  tabs: Tab[];
  setTabs: React.Dispatch<React.SetStateAction<Tab[]>>;
  activeTabId: string | undefined;
  setActiveTabId: React.Dispatch<React.SetStateAction<string | undefined>>;
  showMenu: boolean;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  showBookmarks: boolean;
  setShowBookmarks: React.Dispatch<React.SetStateAction<boolean>>;
  showTabs: boolean;
  setShowTabs: React.Dispatch<React.SetStateAction<boolean>>;
  openUrl: () => void;
  addBookmark: () => Promise<void>;
  deleteBookmark: (url: string) => Promise<void>;
  closeAllSheets: () => void;
  colors: {
    header: string;
    inputBg: string;
    text: string;
    border: string;
    progress: string;
    icon: string;
  };
};

export function useBrowserLogic(): BrowserLogicReturn {
  const webViewRef = useRef<WebView>(null);

  const [inputUrl, setInputUrl] = useState('https://example.com');
  const [url, setUrl] = useState(inputUrl);
  const [progress, setProgress] = useState(0);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | undefined>(undefined);
  const [showMenu, setShowMenu] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showTabs, setShowTabs] = useState(false);

  const closeAllSheets = () => {
    setShowMenu(false);
    setShowBookmarks(false);
    setShowTabs(false);
  };

  // Load storage
  useEffect(() => {
    (async () => {
      try {
        const [d, b] = await Promise.all([
          AsyncStorage.getItem('darkMode'),
          AsyncStorage.getItem('bookmarks'),
        ]);
        if (d !== null) setDarkMode(JSON.parse(d));
        if (b !== null) setBookmarks(JSON.parse(b));
      } catch (e) {
        console.error('Failed to load storage', e);
      }
    })();
  }, []);

  // Save dark mode
  useEffect(() => {
    AsyncStorage.setItem('darkMode', JSON.stringify(darkMode)).catch(console.error);
  }, [darkMode]);

  const addBookmark = async () => {
    if (bookmarks.includes(url)) return;
    const newBookmarks = [...bookmarks, url];
    setBookmarks(newBookmarks);
    await AsyncStorage.setItem('bookmarks', JSON.stringify(newBookmarks)).catch(console.error);
  };

  const deleteBookmark = async (urlToDelete: string) => {
    const newBookmarks = bookmarks.filter(b => b !== urlToDelete);
    setBookmarks(newBookmarks);
    await AsyncStorage.setItem('bookmarks', JSON.stringify(newBookmarks)).catch(console.error);
  };

  const openUrl = () => {
    let finalUrl = inputUrl.trim();
    if (!finalUrl.startsWith('http')) finalUrl = 'https://' + finalUrl;
    setUrl(finalUrl);

    const existingTab = tabs.find(t => t.url === finalUrl);
    if (!existingTab) {
      const newTab: Tab = {
        id: Date.now().toString(),
        url: finalUrl,
        canGoBack: false,
        canGoForward: false,
      };
      setTabs(prev => [...prev, newTab]);
      setActiveTabId(newTab.id);
    } else {
      setActiveTabId(existingTab.id);
    }

    closeAllSheets();
  };

  // Android back button
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showMenu || showBookmarks || showTabs) {
        closeAllSheets();
        return true;
      }
      if (canGoBack) {
        webViewRef.current?.goBack();
        return true;
      }
      return false;
    });

    return () => subscription.remove();
  }, [canGoBack, showMenu, showBookmarks, showTabs]);

  const colors = {
    header: darkMode ? '#121212' : '#1e88e5',
    inputBg: darkMode ? '#1f1f1f' : '#fff',
    text: darkMode ? '#fff' : '#000',
    border: darkMode ? '#333' : '#ccc',
    progress: darkMode ? '#90caf9' : '#1565c0',
    icon: '#fff',
  };

  return {
    webViewRef,
    inputUrl,
    setInputUrl,
    url,
    setUrl,
    progress,
    setProgress,
    canGoBack,
    setCanGoBack,
    canGoForward,
    setCanGoForward,
    darkMode,
    setDarkMode,
    bookmarks,
    setBookmarks,
    tabs,
    setTabs,
    activeTabId,
    setActiveTabId,
    showMenu,
    setShowMenu,
    showBookmarks,
    setShowBookmarks,
    showTabs,
    setShowTabs,
    openUrl,
    addBookmark,
    deleteBookmark,
    closeAllSheets,
    colors,
  };
}

export default useBrowserLogic;