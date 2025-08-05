/**
 * Language component for displaying and changing the app language in the settings screen.
 * Shows an icon, label, current language, and chevron.
 * @module Language
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '@themes/colors';

/**
 * Props for Language component.
 * @property t - Translation function.
 * @property i18n - i18n instance for language info.
 * @property onShowLangModal - Callback to show the language modal.
 */
interface LanguageProps {
  t: (key: string) => string;
  i18n: any;
  onShowLangModal: () => void;
}

/**
 * Displays the language option in the settings list.
 * @param props - LanguageProps
 */
const Language: React.FC<LanguageProps> = ({ t, i18n, onShowLangModal }) => {
  return (
    <TouchableOpacity style={{flexDirection:'row',alignItems:'center',backgroundColor:colors.secondary,borderRadius:16,paddingVertical:16,paddingHorizontal:12,marginBottom:14}} onPress={onShowLangModal}>
      <View style={{width:36,height:36,borderRadius:18,backgroundColor:colors.bgIcon,alignItems:'center',justifyContent:'center',marginRight:16}}>
        <Icon name="translate" size={22} color={colors.icon} />
      </View>
      <Text style={{flex:1,fontSize:16,color:'#222',fontWeight:'500'}}>{t('language')}</Text>
      <Text style={{fontSize:15,color:'#888',marginRight:8,fontWeight:'500'}}>{i18n.language === 'id' ? 'Indonesia' : 'English'}</Text>
      <Icon name="chevron-right" size={22} color={colors.icon} style={{marginLeft:8}} />
    </TouchableOpacity>
  );
};

export default Language; 