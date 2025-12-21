import { StyleSheet } from 'react-native';
import colors from './colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoBox: {
    padding: 20,
    marginBottom: 20,
  },
  brandTextContainer: {
    alignItems: 'center',
  },
  brandText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
    letterSpacing: 2,
  },
  brandSubtext: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text.primary,
    letterSpacing: 1,
    marginTop: 4,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.white,
    marginBottom: 8,
  },
  taglineText: {
    fontSize: 16,
    color: colors.accent.lightGreyBlue,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10,
    alignItems: 'center',
  },
  getStartedButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 345,
  },
  getStartedText: {
    color: colors.text.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export const permissionStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: colors.accent.lightGreyBlue,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 20,
  },
  signInButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 12,
  },
  signInButtonText: {
    color: colors.text.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  guestButton: {
    backgroundColor: colors.background.dark,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  guestButtonDisabled: {
    opacity: 0.6,
  },
  guestButtonText: {
    color: colors.text.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export const scanStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: colors.background.dark,
  },
  headerLeft: {
    flex: 1,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  scansRemaining: {
    fontSize: 14,
    color: colors.text.white,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent.yellow,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 6,
  },
  upgradeIcon: {
    fontSize: 16,
  },
  upgradeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  contentArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  scanCircleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  scanCircle: {
    width: 400,
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  gradientLayer1: {
    position: 'absolute',
    width: '150%',
    height: '150%',
    borderRadius: 1000,
    backgroundColor: 'rgba(10, 180, 224, 0.15)',
    top: '-25%',
    left: '-25%',
  },
  gradientLayer2: {
    position: 'absolute',
    width: '120%',
    height: '120%',
    borderRadius: 1000,
    backgroundColor: 'rgba(26, 58, 74, 0.6)',
    top: '-10%',
    left: '-10%',
  },
  gradientLayer3: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#0A1A24',
  },
  topMostCircleContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  topMostCircleSvg: {
    width: 351,
    height: 351,
  },
  outerCircleContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  outerCircleSvg: {
    width: 272,
    height: 272,
  },
  circlesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  circleSvg: {
    width: 192,
    height: 192,
  },
  cameraIconContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    width: 184,
    height: 184,
    shadowColor: '#0AB4E0',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 15,
  },
  tapToScanText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.white,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    color: colors.text.white,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 24,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: colors.background.dark,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 12,
    color: colors.text.white,
    marginTop: 4,
  },
});

export const historyStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: colors.background.dark,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  cardImage: {
    width: 100,
    height: 100,
    marginRight: 12,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  percentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.white,
  },
  dot: {
    fontSize: 12,
    color: colors.accent.lightGreyBlue,
    marginHorizontal: 8,
  },
  date: {
    fontSize: 14,
    color: colors.text.white,
  },
  description: {
    fontSize: 14,
    color: colors.accent.lightGreyBlue,
    lineHeight: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: colors.background.dark,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 12,
    color: colors.text.white,
    marginTop: 4,
  },
});

export const aboutStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: colors.background.dark,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 20,
  },
  brandName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    letterSpacing: 2,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: colors.text.white,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.white,
    marginBottom: 12,
  },
  cardBody: {
    fontSize: 16,
    color: colors.text.white,
    lineHeight: 24,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.white,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: colors.text.white,
    lineHeight: 20,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  linkText: {
    fontSize: 16,
    color: colors.primary,
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: colors.text.white,
    marginBottom: 4,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: colors.background.dark,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 12,
    color: colors.text.white,
    marginTop: 4,
  },
});

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: colors.background.dark,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userIconContainer: {
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.white,
    marginBottom: 4,
  },
  accountType: {
    fontSize: 14,
    color: colors.accent.lightGreyBlue,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
  },
  statItem: {
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.white,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.accent.lightGreyBlue,
  },
  upgradeCard: {
    backgroundColor: colors.accent.gold,
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  priceText: {
    marginBottom: 16,
  },
  dollarSign: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.white,
  },
  priceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.text.white,
  },
  pricePeriod: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.white,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent.goldButton,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginBottom: 12,
    gap: 8,
  },
  crownIcon: {
    fontSize: 18,
  },
  upgradeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.white,
  },
  upgradeTerms: {
    fontSize: 12,
    color: colors.text.white,
    textAlign: 'center',
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.white,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.white,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: colors.accent.lightGreyBlue,
  },
  accountActions: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  actionText: {
    fontSize: 16,
    color: colors.text.white,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: colors.background.dark,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 12,
    color: colors.text.white,
    marginTop: 4,
  },
});

export const cameraScanStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: colors.background.dark,
  },
  headerLeft: {
    flex: 1,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  scansRemaining: {
    fontSize: 14,
    color: colors.text.white,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent.yellow,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 6,
  },
  upgradeIcon: {
    fontSize: 16,
  },
  upgradeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  upperSection: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#0A1A24',
    zIndex: 1,
  },
  gradientLayer1: {
    position: 'absolute',
    width: '150%',
    height: '150%',
    borderRadius: 1000,
    backgroundColor: 'rgba(10, 180, 224, 0.15)',
    top: '-25%',
    left: '-25%',
  },
  gradientLayer2: {
    position: 'absolute',
    width: '120%',
    height: '120%',
    borderRadius: 1000,
    backgroundColor: 'rgba(26, 58, 74, 0.6)',
    top: '-10%',
    left: '-10%',
  },
  gradientLayer3: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#0A1A24',
  },
  topMostCircleContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  topMostCircleSvg: {
    width: 351,
    height: 351,
  },
  outerCircleContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  outerCircleSvg: {
    width: 272,
    height: 272,
  },
  circlesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  circleSvg: {
    width: 192,
    height: 192,
  },
  cameraIconContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    width: 184,
    height: 184,
    shadowColor: '#0AB4E0',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 15,
  },
  bottomSection: {
    flex: 1.2,
    backgroundColor: '#1E2F3A',
    zIndex: 100,
    elevation: 100,
  },
  bottomScrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    alignItems: 'center',
  },
  dialogTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.white,
    textAlign: 'center',
    marginBottom: 12,
  },
  dialogDescription: {
    fontSize: 16,
    color: colors.accent.lightGreyBlue,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  takePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0AB4E0',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
    marginBottom: 16,
    gap: 12,
  },
  buttonIcon: {
    marginRight: 0,
  },
  takePhotoText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.white,
  },
  uploadGalleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A3A4A',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
    marginBottom: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(10, 180, 224, 0.4)',
  },
  uploadGalleryText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.white,
  },
  cancelButton: {
    paddingVertical: 12,
  },
  cancelText: {
    fontSize: 16,
    color: colors.text.white,
    textAlign: 'center',
  },
});

export const analysisStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    overflow: 'hidden',
    marginBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  progressSection: {
    width: '100%',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  analyzingText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.white,
  },
  percentageText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  statusMessage: {
    fontSize: 14,
    color: colors.primary,
    textAlign: 'center',
  },
});

export const resultsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  scrollView: {
    flex: 1,
  },
  summarySection: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  scanCompleteText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  dateTimeText: {
    fontSize: 14,
    color: colors.accent.lightGreyBlue,
    marginBottom: 30,
  },
  shieldContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  resultText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.accent.green,
    marginBottom: 8,
  },
  resultTextWarning: {
    color: '#FF3B30', // Bright red for deepfake detected
  },
  resultTextInconclusive: {
    color: colors.accent.lightGreyBlue, // Light grey for inconclusive
  },
  confidenceText: {
    fontSize: 16,
    color: colors.accent.lightGreyBlue,
  },
  analysisCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.white,
  },
  analysisSummary: {
    fontSize: 16,
    color: colors.text.white,
    lineHeight: 24,
    marginBottom: 20,
  },
  detailsList: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: colors.accent.lightGreyBlue,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.white,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  scanAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 8,
  },
  scanAgainText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.white,
  },
  bottomActions: {
    flexDirection: 'row',
    gap: 12,
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 8,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.white,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.white,
  },
});

export const signInStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
    backgroundColor: colors.background.dark,
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.text.white,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.accent.lightGreyBlue,
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.white,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text.white,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.primary,
  },
  signInButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signInButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.white,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.text.white,
  },
  footerLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});

export const signUpStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
    backgroundColor: colors.background.dark,
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.text.white,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.accent.lightGreyBlue,
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.white,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text.white,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  helperText: {
    fontSize: 12,
    color: colors.accent.lightGreyBlue,
    marginTop: 4,
  },
  signUpButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signUpButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.white,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.text.white,
  },
  footerLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});

export const verificationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
    backgroundColor: colors.background.dark,
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.text.white,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.accent.lightGreyBlue,
    textAlign: 'center',
    lineHeight: 24,
  },
  emailText: {
    color: colors.primary,
    fontWeight: '600',
  },
  form: {
    marginBottom: 30,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 12,
  },
  codeInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 16,
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.white,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  verifyButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  verifyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.white,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: colors.text.white,
  },
  resendLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});

export const forgotPasswordStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
    backgroundColor: colors.background.dark,
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.text.white,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.accent.lightGreyBlue,
    lineHeight: 24,
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.white,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text.white,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.white,
  },
});

export const resetPasswordStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
    backgroundColor: colors.background.dark,
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.text.white,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.accent.lightGreyBlue,
    textAlign: 'left',
    lineHeight: 24,
  },
  emailText: {
    color: colors.primary,
    fontWeight: '600',
  },
  form: {
    marginBottom: 30,
  },
  codeContainer: {
    marginBottom: 24,
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  codeInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 16,
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.white,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.white,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text.white,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  helperText: {
    fontSize: 12,
    color: colors.accent.lightGreyBlue,
    marginTop: 4,
  },
  resetButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  resetButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.white,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: colors.text.white,
  },
  resendLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default styles;

