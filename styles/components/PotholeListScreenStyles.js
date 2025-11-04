import { StyleSheet } from 'react-native';

export const potholeListStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1A1A', // optional: soft background
    padding: 16,
  },
  card: {
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#FFF8E8', // light background
    borderRadius: 10,
    borderLeftWidth: 10,         // will get color dynamically
  },
  latlng: {
    color: '#000',              // 🔥 black text
    fontWeight: 'bold',
  },
  details: {
    color: '#222',              // 🔥 dark gray text
    marginTop: 4,
  },
  status: {
    color: '#444',
    marginTop: 2,
  },
  emptyText: {
    color: '#444',
    textAlign: 'center',
    marginTop: 20,
  },
  backButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#FFF8E8',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
  },
  backButtonText: {
    color: '#000000',
    fontWeight: 'bold',
  },
});


/** Utility: color-code cards by severity */
export const getSeverityColor = (severity) => {
  if (!severity) return '#555';
  switch (severity.toLowerCase()) {
    case 'minor':
      return '#f4d35e';
    case 'moderate':
      return '#ee964b';
    case 'severe':
      return '#e63946';
    case 'fixed':
      return '#2a9d8f';
    default:
      return '#555';
  }
};
