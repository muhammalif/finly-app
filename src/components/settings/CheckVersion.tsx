/**
 * CheckVersion component for displaying the current app version in the settings screen.
 * Shows an icon, label, and the current version string.
 * @module CheckVersion
 */

import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '@themes/colors';
import VersionCheck from 'react-native-version-check';

/**
 * Props for CheckVersion component.
 * @property t - Translation function.
 */
interface CheckVersionProps {
  t: (key: string, options?: any) => string;
}

/**
 * Displays the current app version in the settings list.
 * @param props - CheckVersionProps
 */
const CheckVersion: React.FC<CheckVersionProps> = ({ t }) => {
  const version = VersionCheck.getCurrentVersion();
  return (
    <View style={{flexDirection:'row',alignItems:'center',backgroundColor:colors.secondary,borderRadius:16,paddingVertical:16,paddingHorizontal:12,marginBottom:14}}>
      <View style={{width:36,height:36,borderRadius:18,backgroundColor:colors.bgIcon,alignItems:'center',justifyContent:'center',marginRight:16}}>
        <Icon name="update" size={22} color={colors.icon} />
      </View>
      <Text style={{flex:1,fontSize:16,color:'#222',fontWeight:'500'}}>
        {t('check_version', { defaultValue: 'Check Version' })}
      </Text>
      <Text style={{fontSize:15,color:'#888',marginRight:8,fontWeight:'500'}}>
        {t('version', { defaultValue: 'Version' }) + ': v' + version}
      </Text>
    </View>
  );
};

export default CheckVersion; 