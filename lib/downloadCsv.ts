import { Platform, Share } from 'react-native';

/**
 * Share / save a CSV without expo-sharing (works before native rebuild).
 */
export async function downloadCsvFile(filename: string, csv: string): Promise<void> {
  const safeName = filename.replace(/[^\w.-]+/g, '_');

  if (Platform.OS === 'web') {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = safeName;
    anchor.click();
    URL.revokeObjectURL(url);
    return;
  }

  if (Platform.OS === 'android') {
    await Share.share({
      title: safeName,
      message: csv,
    });
    return;
  }

  const FileSystem = await import('expo-file-system/legacy');
  const base = FileSystem.cacheDirectory;
  if (!base) {
    await Share.share({ title: safeName, message: csv });
    return;
  }

  const uri = `${base}${safeName}`;
  await FileSystem.writeAsStringAsync(uri, csv, { encoding: 'utf8' });
  await Share.share({ url: uri, title: safeName });
}
