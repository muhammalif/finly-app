/**
 * ExportData component for displaying the export data option in the settings screen.
 * Shows an icon, label, and chevron, and triggers a modal on press.
 * @module ExportData
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '@themes/colors';

/**
 * Props for ExportData component.
 * @property t - Translation function.
 * @property onShowExportModal - Callback to show the export modal.
 */
interface ExportDataProps {
  t: (key: string) => string;
  onShowExportModal: () => void;
}

/**
 * Displays the export data option in the settings list.
 * @param props - ExportDataProps
 */
const ExportData: React.FC<ExportDataProps> = ({ t, onShowExportModal }) => {
  return (
    <TouchableOpacity style={{flexDirection:'row',alignItems:'center',backgroundColor:colors.secondary,borderRadius:16,paddingVertical:16,paddingHorizontal:12,marginBottom:14}} onPress={onShowExportModal}>
      <View style={{width:36,height:36,borderRadius:18,backgroundColor:colors.bgIcon,alignItems:'center',justifyContent:'center',marginRight:16}}>
        <Icon name="file-export" size={22} color={colors.icon} />
      </View>
      <Text style={{flex:1,fontSize:16,color:'#222',fontWeight:'500'}}>{t('export_data')}</Text>
      <Icon name="chevron-right" size={22} color={colors.icon} style={{marginLeft:8}} />
    </TouchableOpacity>
  );
};

export default ExportData; 