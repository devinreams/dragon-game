import { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import * as FileSystem from 'expo-file-system/legacy';
import { Asset } from 'expo-asset';

async function prepareLocalGameFiles() {
  const htmlAsset = Asset.fromModule(require('./assets/game/dragon-game.html'));

  await htmlAsset.downloadAsync();

  const gameDir = `${FileSystem.cacheDirectory}game/`;
  await FileSystem.makeDirectoryAsync(gameDir, { intermediates: true });

  const htmlTarget = `${gameDir}dragon-game.html`;

  await FileSystem.copyAsync({ from: htmlAsset.localUri || htmlAsset.uri, to: htmlTarget });

  return htmlTarget;
}

export default function App() {
  const [uri, setUri] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const htmlUri = await prepareLocalGameFiles();
        setUri(htmlUri);
      } catch (err) {
        console.error(err);
        setError(err);
      }
    })();
  }, []);

  if (error) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#050814' }}>
      <StatusBar barStyle="light-content" />
      {uri ? (
        <WebView
          originWhitelist={['*']}
          source={{ uri }}
          allowFileAccess
          allowingReadAccessToURL={uri}
          javaScriptEnabled
          domStorageEnabled
          scrollEnabled={false}
          bounces={false}
          overScrollMode="never"
          scalesPageToFit={false}
          contentMode="mobile"
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          style={{ flex: 1 }}
        />
      ) : (
        <ActivityIndicator style={{ flex: 1 }} size="large" color="#3b8dff" />
      )}
    </SafeAreaView>
  );
}
