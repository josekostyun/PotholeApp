import { StyleSheet, Dimensions } from 'react-native';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBackground: {
    width: 189,
    height: 189,
    backgroundColor: '#ff5722',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carIcon: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  inputContainer: {
    width: 210,
    height: 56,
    marginBottom: 36, // Same spacing between text boxes
    position: 'relative',
  },
  input: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 4,
    paddingLeft: 16,
    paddingRight: 52,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Roboto',
  },
  clearButton: {
    position: 'absolute',
    right: 4,
    top: 4,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  loginButtonContainer: {
    marginBottom: 36, // Same spacing as text boxes
  },
  loginButton: {
    width: 89,
    height: 50,
    backgroundColor: '#1C1A1A',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Roboto',
  },
  settingsContainer: {
    position: 'absolute',
    bottom: 30, // Closer to bottom
    right: 30, // More to the right
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
});