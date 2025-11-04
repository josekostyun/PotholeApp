import { StyleSheet } from 'react-native';

const mapStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1A1A',
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1A1A',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 65 : 20,
    left: 20,
    zIndex: 10,
    backgroundColor: '#FFF8E8',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 10, // ensures it renders above MapView
    elevation: 10, // helps Android too // Android shadow
  },
  backButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
    recenterButton: {
      position: 'absolute',
      bottom: 40,
      right: 20,
      backgroundColor: '#FFF8E8',
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOpacity: 0.25,
      shadowRadius: 4,
      zIndex: 10,
      elevation: 10, // Android shadow
    },
    recenterText: {
      color: '#000000',
      fontSize: 16,
      fontWeight: '600',
    },
});

export default mapStyles;
