/**
 * Support component for displaying the support option in the settings screen.
 * Shows an icon, label, and chevron, and triggers a modal on press.
 * @module Support
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '@themes/colors';

/**
 * Props for Support component.
 * @property t - Translation function.
 * @property onShowSupportModal - Callback to show the support modal.
 */
interface SupportProps {
  t: (key: string) => string;
  onShowSupportModal: () => void;
}

/**
 * Displays the support option in the settings list.
 * @param props - SupportProps
 */
const Support: React.FC<SupportProps> = ({ t, onShowSupportModal }) => {
  return (
    <TouchableOpacity style={{flexDirection:'row',alignItems:'center',backgroundColor:colors.secondary,borderRadius:16,paddingVertical:16,paddingHorizontal:12,marginBottom:14}} onPress={onShowSupportModal}>
      <View style={{width:36,height:36,borderRadius:18,backgroundColor:colors.bgIcon,alignItems:'center',justifyContent:'center',marginRight:16}}>
        <Icon name="send" size={22} color={colors.icon} />
      </View>
      <Text style={{flex:1,fontSize:16,color:'#222',fontWeight:'500'}}>{t('support')}</Text>
      <Icon name="chevron-right" size={22} color={colors.icon} style={{marginLeft:8}} />
    </TouchableOpacity>
  );
};

export default Support; 