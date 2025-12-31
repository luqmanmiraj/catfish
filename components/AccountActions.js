import React from 'react';
import { View } from 'react-native';
import { profileStyles } from '../styles';
import LogoutButton from './LogoutButton';
import DeleteAccountButton from './DeleteAccountButton';

const AccountActions = ({ onLogOut, onDeleteAccount }) => {
  return (
    <View style={profileStyles.accountActions}>
      <LogoutButton onPress={onLogOut} />
      <DeleteAccountButton onPress={onDeleteAccount} />
    </View>
  );
};

export default AccountActions;

