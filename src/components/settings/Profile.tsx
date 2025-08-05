/**
 * Profile component for displaying the profile option in the settings screen.
 * Shows an icon, label, and chevron, and triggers a modal on press.
 * @module Profile
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '@themes/colors';

/**
 * Props for Profile component.
 * @property t - Translation function.
 * @property onShowProfileModal - Callback to show the profile modal.
 */
interface ProfileProps {
  t: (key: string) => string;
  onShowProfileModal: () => void;
}

/**
 * Displays the profile option in the settings list.
 * @param props - ProfileProps
 */
const Profile: React.FC<ProfileProps> = ({ t, onShowProfileModal }) => {
  return (
    <TouchableOpacity style={{flexDirection:'row',alignItems:'center',backgroundColor:colors.secondary,borderRadius:16,paddingVertical:16,paddingHorizontal:12,marginBottom:14}} onPress={onShowProfileModal}>
      <View style={{width:36,height:36,borderRadius:18,backgroundColor:colors.bgIcon,alignItems:'center',justifyContent:'center',marginRight:16}}>
        <Icon name="account-circle" size={22} color={colors.icon} />
      </View>
      <Text style={{flex:1,fontSize:16,color:'#222',fontWeight:'500'}}>{t('profile')}</Text>
      <Icon name="chevron-right" size={22} color={colors.icon} style={{marginLeft:8}} />
    </TouchableOpacity>
  );
};

export default Profile; 