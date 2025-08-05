/**
 * Currency component for displaying the currency option in the settings screen.
 * Shows an icon, label, and the current currency (IDR).
 * @module Currency
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '@themes/colors';
import { useTranslation } from 'react-i18next';

/**
 * Displays the currency option in the settings list (currently fixed to IDR).
 */
const Currency = () => {
  const { t } = useTranslation();
  return (
    <TouchableOpacity style={{flexDirection:'row',alignItems:'center',backgroundColor:colors.secondary,borderRadius:16,paddingVertical:16,paddingHorizontal:12,marginBottom:14,opacity:0.6}} disabled>
      <View style={{width:36,height:36,borderRadius:18,backgroundColor:colors.bgIcon,alignItems:'center',justifyContent:'center',marginRight:16}}>
        <Icon name="currency-usd" size={22} color={colors.icon} />
      </View>
      <Text style={{flex:1,fontSize:16,color:'#222',fontWeight:'500'}}>{t('currency')}</Text>
      <Text style={{fontSize:15,color:'#888',marginRight:8,fontWeight:'500'}}>IDR</Text>
    </TouchableOpacity>
  );
};

export default Currency; 