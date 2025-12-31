import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import CatfishLogo from '../components/CatfishLogo';
import { aboutStyles } from '../styles';
import colors from '../colors';

const AboutScreen = ({ onScanClick, onHistoryClick, onProfileClick }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={aboutStyles.container}>
      <ScrollView style={aboutStyles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={aboutStyles.header}>
          <Text style={aboutStyles.title}>About & Education</Text>
        </View>

        {/* Logo and Branding */}
        <View style={aboutStyles.logoSection}>
          <View style={aboutStyles.logoContainer}>
            <CatfishLogo />
          </View>
          {/* <Text style={aboutStyles.brandName}>CATFISH CRASHER</Text> */}
          <Text style={aboutStyles.tagline}>AI Detection Technology</Text>
        </View>

        {/* Our Mission */}
        <View style={aboutStyles.card}>
          <Text style={aboutStyles.cardTitle}>Our Mission</Text>
          <Text style={aboutStyles.cardBody}>
            Catfish Crasher helps you identify AI-generated images and protect yourself from online deception. With advanced detection algorithms, we analyze images for telltale signs of synthetic content. Our technology examines patterns, artifacts, and metadata to provide you with confidence scores and detailed explanations about each image you scan.
          </Text>
        </View>

        {/* What is Catfishing? */}
        <View style={aboutStyles.card}>
          <Text style={aboutStyles.cardTitle}>What is Catfishing?</Text>
          <Text style={aboutStyles.cardBody}>
            Catfishing is when someone creates a fake online identity to deceive others, often using stolen or AI-generated photos. This deception can lead to emotional manipulation, financial scams, or identity theft. With the rise of AI image generation, it's easier than ever for bad actors to create convincing fake profiles. Catfish Crasher gives you the tools to verify authenticity and stay safe.
          </Text>
        </View>

        {/* Safety Tips */}
        <View style={aboutStyles.card}>
          <Text style={aboutStyles.cardTitle}>Safety Tips</Text>
          
          <View style={aboutStyles.tipItem}>
            <View style={aboutStyles.tipIconContainer}>
              <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <Rect width="47.9983" height="47.9983" rx="23.9991" fill="#0AB4E0" fillOpacity="0.1" />
                <Path
                  d="M23.9058 32.3898C23.8394 32.3898 23.7563 32.3759 23.6567 32.3483C23.5627 32.3261 23.4631 32.2874 23.3579 32.2321C22.2013 31.5735 21.2218 30.9925 20.4194 30.4889C19.6226 29.9853 18.9806 29.4983 18.4937 29.028C18.0122 28.552 17.6608 28.0402 17.4395 27.4923C17.2236 26.9389 17.1157 26.2887 17.1157 25.5416V19.2828C17.1157 18.8567 17.207 18.5496 17.3896 18.3615C17.5723 18.1678 17.8351 18.0017 18.1782 17.8634C18.3719 17.7859 18.6375 17.6836 18.9751 17.5563C19.3127 17.4235 19.6834 17.2823 20.0874 17.1329C20.4969 16.978 20.9036 16.8286 21.3076 16.6847C21.7171 16.5353 22.0907 16.4025 22.4282 16.2863C22.7658 16.1645 23.0314 16.0704 23.2251 16.004C23.3358 15.9708 23.4465 15.9432 23.5571 15.921C23.6733 15.8989 23.7896 15.8878 23.9058 15.8878C24.022 15.8878 24.1382 15.8989 24.2544 15.921C24.3706 15.9432 24.484 15.9708 24.5947 16.004C24.7884 16.0704 25.0513 16.1645 25.3833 16.2863C25.7209 16.4025 26.0916 16.5353 26.4956 16.6847C26.9051 16.8341 27.3118 16.9835 27.7158 17.1329C28.1253 17.2823 28.4989 17.4207 28.8364 17.548C29.174 17.6753 29.4396 17.7804 29.6333 17.8634C29.9819 18.0073 30.2448 18.1733 30.4219 18.3615C30.6045 18.5496 30.6958 18.8567 30.6958 19.2828V25.5416C30.6958 26.2887 30.5907 26.9445 30.3804 27.5089C30.1701 28.0678 29.8242 28.5908 29.3428 29.0778C28.8669 29.5647 28.2277 30.0573 27.4253 30.5553C26.6284 31.0533 25.6379 31.6123 24.4536 32.2321C24.3485 32.2874 24.2461 32.3261 24.1465 32.3483C24.0524 32.3759 23.9722 32.3898 23.9058 32.3898ZM20.8262 27.2184C20.8262 27.8437 21.1167 28.1564 21.6978 28.1564H26.1304C26.717 28.1564 27.0103 27.8437 27.0103 27.2184V23.8151C27.0103 23.2229 26.7585 22.9103 26.2549 22.8771V21.8727C26.2549 21.0813 26.0391 20.4449 25.6074 19.9635C25.1758 19.4821 24.6113 19.2413 23.9141 19.2413C23.2168 19.2413 22.6523 19.4821 22.2207 19.9635C21.7891 20.4449 21.5732 21.0813 21.5732 21.8727V22.8771C21.0752 22.9103 20.8262 23.2229 20.8262 23.8151V27.2184ZM22.4697 22.8688V21.7731C22.4697 21.275 22.6025 20.8738 22.8682 20.5695C23.1338 20.2596 23.4824 20.1046 23.9141 20.1046C24.3512 20.1046 24.6999 20.2596 24.96 20.5695C25.2256 20.8738 25.3584 21.275 25.3584 21.7731V22.8688H22.4697Z"
                  fill="#0AB4E0"
                />
              </Svg>
            </View>
            <View style={aboutStyles.tipContent}>
              <Text style={aboutStyles.tipTitle}>Stay Protected</Text>
              <Text style={aboutStyles.tipText}>
                Always verify profiles before sharing personal information online.
              </Text>
            </View>
          </View>

          <View style={aboutStyles.tipItem}>
            <View style={aboutStyles.tipIconContainer}>
              <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <Rect width="47.9983" height="47.9983" rx="23.9991" fill="#0AB4E0" fillOpacity="0.1" />
                <Path
                  d="M18.4341 31.4601C17.7424 31.4601 17.1004 31.236 16.5083 30.7877C15.9162 30.345 15.4098 29.7169 14.9893 28.9034C14.5742 28.09 14.2809 27.1354 14.1094 26.0397C14.3197 26.3551 14.5936 26.6014 14.9312 26.7784C15.2743 26.95 15.6644 27.0358 16.1016 27.0358C16.8265 27.0358 17.4076 26.8061 17.8447 26.3468C18.2819 25.882 18.5005 25.2705 18.5005 24.5123C18.5005 23.7653 18.2819 23.1621 17.8447 22.7028C17.4076 22.2379 16.8265 22.0055 16.1016 22.0055C15.609 22.0055 15.1802 22.1134 14.8149 22.3292C14.4552 22.545 14.1785 22.8439 13.9849 23.2257C14.0623 21.892 14.3058 20.7272 14.7153 19.7311C15.1248 18.7295 15.6533 17.9519 16.3008 17.3986C16.9482 16.8396 17.6593 16.5602 18.4341 16.5602C19.0594 16.5602 19.6405 16.74 20.1772 17.0997C20.7196 17.4594 21.1955 17.9685 21.605 18.6271C22.0145 19.2856 22.3327 20.0714 22.5596 20.9845C22.792 21.892 22.9082 22.8992 22.9082 24.006C22.9082 25.1128 22.792 26.1227 22.5596 27.0358C22.3327 27.9489 22.0145 28.7347 21.605 29.3932C21.1955 30.0517 20.7196 30.5608 20.1772 30.9205C19.6405 31.2802 19.0594 31.4601 18.4341 31.4601ZM15.4209 24.2135C15.2715 24.1858 15.1525 24.0973 15.064 23.9479C14.981 23.7929 14.9561 23.6186 14.9893 23.4249C15.0225 23.2368 15.1055 23.0846 15.2383 22.9684C15.3711 22.8522 15.5094 22.8079 15.6533 22.8356C15.8083 22.8632 15.9272 22.9545 16.0103 23.1095C16.0933 23.2644 16.1154 23.436 16.0767 23.6241C16.0379 23.8123 15.9549 23.9645 15.8276 24.0807C15.7059 24.1969 15.5703 24.2412 15.4209 24.2135ZM28.7852 31.4601C28.0879 31.4601 27.4432 31.236 26.8511 30.7877C26.259 30.345 25.7554 29.7169 25.3403 28.9034C24.9253 28.09 24.632 27.1354 24.4604 26.0397C24.6707 26.3551 24.9447 26.6014 25.2822 26.7784C25.6198 26.95 26.0072 27.0358 26.4443 27.0358C27.1693 27.0358 27.7503 26.8061 28.1875 26.3468C28.6302 25.882 28.8516 25.2705 28.8516 24.5123C28.8516 23.7653 28.6302 23.1621 28.1875 22.7028C27.7503 22.2379 27.1693 22.0055 26.4443 22.0055C25.9574 22.0055 25.5312 22.1134 25.166 22.3292C24.8063 22.545 24.5296 22.8439 24.3359 23.2257C24.4079 21.892 24.6486 20.7272 25.0581 19.7311C25.4731 18.7295 26.0016 17.9519 26.6436 17.3986C27.291 16.8396 28.0049 16.5602 28.7852 16.5602C29.4049 16.5602 29.986 16.74 30.5283 17.0997C31.0706 17.4594 31.5465 17.9685 31.9561 18.6271C32.3656 19.2856 32.6838 20.0714 32.9106 20.9845C33.1431 21.892 33.2593 22.8992 33.2593 24.006C33.2593 25.1128 33.1431 26.1227 32.9106 27.0358C32.6838 27.9489 32.3656 28.7347 31.9561 29.3932C31.5465 30.0517 31.0706 30.5608 30.5283 30.9205C29.986 31.2802 29.4049 31.4601 28.7852 31.4601ZM25.772 24.2135C25.617 24.1803 25.498 24.089 25.415 23.9396C25.332 23.7902 25.3071 23.6186 25.3403 23.4249C25.3735 23.2368 25.4565 23.0846 25.5894 22.9684C25.7222 22.8522 25.8605 22.8079 26.0044 22.8356C26.1593 22.8577 26.2756 22.949 26.353 23.1095C26.436 23.2644 26.4609 23.436 26.4277 23.6241C26.389 23.8123 26.306 23.9645 26.1787 24.0807C26.0514 24.1969 25.9159 24.2412 25.772 24.2135Z"
                  fill="#0AB4E0"
                />
              </Svg>
            </View>
            <View style={aboutStyles.tipContent}>
              <Text style={aboutStyles.tipTitle}>Watch for Red Flags</Text>
              <Text style={aboutStyles.tipText}>
                Be cautious of profiles with limited photos or inconsistent details.
              </Text>
            </View>
          </View>

          <View style={aboutStyles.tipItem}>
            <View style={aboutStyles.tipIconContainer}>
              <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <Rect width="47.9983" height="47.9983" rx="23.9991" fill="#0AB4E0" fillOpacity="0.1" />
                <Path
                  d="M20.3345 26.7618H26.8755C27.0304 26.7618 27.1577 26.7093 27.2573 26.6041C27.3569 26.499 27.4067 26.3717 27.4067 26.2223C27.4067 26.0729 27.3569 25.9484 27.2573 25.8488C27.1577 25.7491 27.0304 25.6993 26.8755 25.6993H20.3345C20.1795 25.6993 20.0495 25.7491 19.9443 25.8488C19.8447 25.9484 19.7949 26.0729 19.7949 26.2223C19.7949 26.3717 19.8447 26.499 19.9443 26.6041C20.0495 26.7093 20.1795 26.7618 20.3345 26.7618ZM20.3345 29.3268H23.4224C23.5773 29.3268 23.7046 29.277 23.8042 29.1774C23.9038 29.0778 23.9536 28.956 23.9536 28.8121C23.9536 28.6627 23.9038 28.5354 23.8042 28.4303C23.7046 28.3252 23.5773 28.2726 23.4224 28.2726H20.3345C20.1795 28.2726 20.0495 28.3252 19.9443 28.4303C19.8447 28.5354 19.7949 28.6627 19.7949 28.8121C19.7949 28.956 19.8447 29.0778 19.9443 29.1774C20.0495 29.277 20.1795 29.3268 20.3345 29.3268ZM23.6133 23.9562C24.1611 23.9562 24.6647 23.8178 25.124 23.5411C25.5889 23.2589 25.9596 22.8881 26.2363 22.4288C26.5186 21.964 26.6597 21.4521 26.6597 20.8932C26.6597 20.3343 26.5213 19.8252 26.2446 19.3658C25.9735 18.901 25.6055 18.5302 25.1406 18.2535C24.6813 17.9768 24.1722 17.8385 23.6133 17.8385C23.0544 17.8385 22.5425 17.9768 22.0776 18.2535C21.6183 18.5302 21.2503 18.901 20.9736 19.3658C20.6969 19.8252 20.5586 20.3343 20.5586 20.8932C20.5586 21.4576 20.6969 21.9723 20.9736 22.4371C21.2503 22.8964 21.6183 23.2644 22.0776 23.5411C22.5425 23.8178 23.0544 23.9562 23.6133 23.9562ZM22.8579 22.7028C22.6808 22.7028 22.5923 22.6087 22.5923 22.4205C22.5923 22.3375 22.6172 22.2711 22.667 22.2213C22.7168 22.1715 22.7804 22.1466 22.8579 22.1466H23.4058V20.9264H22.8496C22.7721 20.9264 22.7085 20.9043 22.6587 20.86C22.6144 20.8157 22.5923 20.7493 22.5923 20.6608C22.5923 20.5778 22.6144 20.5114 22.6587 20.4615C22.7085 20.4062 22.7721 20.3785 22.8496 20.3785H23.6797C23.8568 20.3785 23.9453 20.4726 23.9453 20.6608V22.1466H24.4268C24.5042 22.1466 24.5651 22.1743 24.6094 22.2296C24.6592 22.2794 24.6841 22.3431 24.6841 22.4205C24.6841 22.6087 24.5983 22.7028 24.4268 22.7028H22.8579ZM23.5967 19.8141C23.4639 19.8141 23.3504 19.7698 23.2563 19.6813C23.1623 19.5872 23.1152 19.4738 23.1152 19.3409C23.1152 19.1971 23.1623 19.0781 23.2563 18.984C23.3504 18.8899 23.4639 18.8429 23.5967 18.8429C23.735 18.8429 23.8512 18.8899 23.9453 18.984C24.0449 19.0781 24.0947 19.1971 24.0947 19.3409C24.0947 19.4738 24.0449 19.5872 23.9453 19.6813C23.8512 19.7698 23.735 19.8141 23.5967 19.8141ZM16.6157 30.2565V17.6642C16.6157 16.8009 16.8288 16.1507 17.2549 15.7135C17.6865 15.2763 18.3312 15.0577 19.189 15.0577H28.0044C28.8621 15.0577 29.5041 15.2763 29.9302 15.7135C30.3618 16.1507 30.5776 16.8009 30.5776 17.6642V30.2565C30.5776 31.1253 30.3618 31.7755 29.9302 32.2072C29.5041 32.6388 28.8621 32.8546 28.0044 32.8546H19.189C18.3312 32.8546 17.6865 32.6388 17.2549 32.2072C16.8288 31.7755 16.6157 31.1253 16.6157 30.2565Z"
                  fill="#0AB4E0"
                />
              </Svg>
            </View>
            <View style={aboutStyles.tipContent}>
              <Text style={aboutStyles.tipTitle}>Trust Your Instincts</Text>
              <Text style={aboutStyles.tipText}>
                If something feels off, take a step back and investigate further.
              </Text>
            </View>
          </View>
        </View>

        {/* Learn More */}
        <View style={aboutStyles.learnMoreSection}>
          <Text style={aboutStyles.learnMoreTitle}>Learn More</Text>
          
          <TouchableOpacity style={aboutStyles.learnMoreButton}>
            <Text style={aboutStyles.learnMoreButtonText}>FBI Internet Crime Report</Text>
            <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <Path
                d="M6 2H14V10M14 2L2 14"
                stroke={colors.primary}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>

          <TouchableOpacity style={aboutStyles.learnMoreButton}>
            <Text style={aboutStyles.learnMoreButtonText}>Online Safety Resources</Text>
            <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <Path
                d="M6 2H14V10M14 2L2 14"
                stroke={colors.primary}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>

          <TouchableOpacity style={aboutStyles.learnMoreButton}>
            <Text style={aboutStyles.learnMoreButtonText}>How AI Detection Works</Text>
            <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <Path
                d="M6 2H14V10M14 2L2 14"
                stroke={colors.primary}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        </View>
        {/* Footer */}
        <View style={aboutStyles.footer}>
          <Text style={aboutStyles.footerText}>Version 1.0.0</Text>
          <Text style={aboutStyles.footerText}>© 2025 Catfish Crasher. All rights reserved.</Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[aboutStyles.bottomNav, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity style={aboutStyles.navItem} onPress={onScanClick}>
          <Svg width="24" height="24" viewBox="0 0 21 16" fill="none">
            <Path
              d="M16.4771 6.3667C16.1893 6.3667 15.9458 6.26709 15.7466 6.06787C15.5474 5.86312 15.4478 5.61963 15.4478 5.3374C15.4478 5.04964 15.5474 4.80615 15.7466 4.60693C15.9458 4.40771 16.1893 4.30811 16.4771 4.30811C16.7593 4.30811 17 4.40771 17.1992 4.60693C17.404 4.80615 17.5063 5.04964 17.5063 5.3374C17.5063 5.61963 17.404 5.86312 17.1992 6.06787C17 6.26709 16.7593 6.3667 16.4771 6.3667ZM2.60645 15.8296C1.73763 15.8296 1.08464 15.6138 0.647461 15.1821C0.21582 14.756 0 14.1141 0 13.2563V4.56543C0 3.71322 0.21582 3.07406 0.647461 2.64795C1.08464 2.21631 1.73763 2.00049 2.60645 2.00049H4.92236C5.24886 2.00049 5.48958 1.96175 5.64453 1.88428C5.79948 1.80127 5.96826 1.65739 6.15088 1.45264L6.81494 0.705566C7.02523 0.478678 7.25212 0.304362 7.49561 0.182617C7.74463 0.0608724 8.08219 0 8.5083 0H11.8203C12.2464 0 12.584 0.0608724 12.833 0.182617C13.082 0.304362 13.3089 0.478678 13.5137 0.705566L14.1777 1.45264C14.305 1.59098 14.4185 1.70166 14.5181 1.78467C14.6232 1.86214 14.7422 1.91748 14.875 1.95068C15.0078 1.98389 15.1849 2.00049 15.4062 2.00049H17.7803C18.6436 2.00049 19.2938 2.21631 19.731 2.64795C20.1681 3.07406 20.3867 3.71322 20.3867 4.56543V13.2563C20.3867 14.1141 20.1681 14.756 19.731 15.1821C19.2938 15.6138 18.6436 15.8296 17.7803 15.8296H2.60645ZM2.62305 14.4932H17.7554C18.1649 14.4932 18.4831 14.3853 18.71 14.1694C18.9368 13.9481 19.0503 13.6216 19.0503 13.1899V4.64014C19.0503 4.2085 18.9368 3.88477 18.71 3.66895C18.4831 3.44759 18.1649 3.33691 17.7554 3.33691H15.0742C14.6979 3.33691 14.3936 3.29541 14.1611 3.2124C13.9342 3.12386 13.7157 2.96338 13.5054 2.73096L12.8579 2.00049C12.62 1.73486 12.4097 1.55778 12.2271 1.46924C12.0444 1.3807 11.7705 1.33643 11.4053 1.33643H8.92334C8.55811 1.33643 8.28418 1.3807 8.10156 1.46924C7.91895 1.55778 7.70866 1.73486 7.4707 2.00049L6.82324 2.73096C6.61296 2.96338 6.3916 3.12386 6.15918 3.2124C5.93229 3.29541 5.6307 3.33691 5.25439 3.33691H2.62305C2.21354 3.33691 1.89535 3.44759 1.66846 3.66895C1.4471 3.88477 1.33643 4.2085 1.33643 4.64014V13.1899C1.33643 13.6216 1.4471 13.9481 1.66846 14.1694C1.89535 14.3853 2.21354 14.4932 2.62305 14.4932ZM10.1934 13.2979C9.5625 13.2979 8.97314 13.1816 8.42529 12.9492C7.87744 12.7168 7.396 12.3931 6.98096 11.978C6.57145 11.563 6.24772 11.0815 6.00977 10.5337C5.77734 9.98584 5.66113 9.39372 5.66113 8.75732C5.66113 8.12646 5.77734 7.53711 6.00977 6.98926C6.24772 6.44141 6.57145 5.95996 6.98096 5.54492C7.396 5.12988 7.87744 4.80615 8.42529 4.57373C8.97314 4.34131 9.5625 4.2251 10.1934 4.2251C11.029 4.2251 11.7899 4.42708 12.4761 4.83105C13.1623 5.23503 13.7074 5.78011 14.1113 6.46631C14.5153 7.15251 14.7173 7.91618 14.7173 8.75732C14.7173 9.39372 14.6011 9.98584 14.3687 10.5337C14.1362 11.0815 13.8125 11.563 13.3975 11.978C12.9824 12.3931 12.501 12.7168 11.9531 12.9492C11.4053 13.1816 10.8187 13.2979 10.1934 13.2979ZM10.1934 12.0361C10.7965 12.0361 11.3444 11.8895 11.8369 11.5962C12.335 11.3029 12.7306 10.91 13.0239 10.4175C13.3172 9.91943 13.4639 9.36605 13.4639 8.75732C13.4639 8.15413 13.3172 7.60628 13.0239 7.11377C12.7306 6.61572 12.335 6.22005 11.8369 5.92676C11.3444 5.62793 10.7965 5.47852 10.1934 5.47852C9.59017 5.47852 9.03955 5.62793 8.5415 5.92676C8.04899 6.22005 7.65332 6.61572 7.35449 7.11377C7.0612 7.60628 6.91455 8.15413 6.91455 8.75732C6.91455 9.36605 7.0612 9.91943 7.35449 10.4175C7.65332 10.91 8.04899 11.3029 8.5415 11.5962C9.03955 11.8895 9.59017 12.0361 10.1934 12.0361Z"
              fill={colors.accent.lightGreyBlue}
            />
          </Svg>
          <Text style={aboutStyles.navText}>Scan</Text>
        </TouchableOpacity>

        <TouchableOpacity style={aboutStyles.navItem} onPress={onHistoryClick}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            {/* Clock circle */}
            <Circle cx="12" cy="12" r="10" stroke={colors.text.white} strokeWidth="2" fill="none" />
            {/* Clock hands */}
            <Path
              d="M12 8V12L15 15"
              stroke={colors.text.white}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </Svg>
          <Text style={aboutStyles.navText}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity style={aboutStyles.navItem}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="10" stroke={colors.primary} strokeWidth="2" fill="none" />
            <Path
              d="M12 16V12M12 8H12.01"
              stroke={colors.primary}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </Svg>
          <Text style={[aboutStyles.navText, { color: colors.primary }]}>About</Text>
        </TouchableOpacity>

        <TouchableOpacity style={aboutStyles.navItem} onPress={onProfileClick}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
              fill={colors.text.white}
            />
          </Svg>
          <Text style={aboutStyles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="light" />
    </View>
  );
};

export default AboutScreen;

