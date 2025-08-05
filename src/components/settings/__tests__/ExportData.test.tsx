import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ExportData from '../ExportData'

jest.mock('@themes/colors', () => ({
  colors: { secondary: '#fff', bgIcon: '#eee', icon: '#000' },
}));

describe('ExportData', () => {
  it('calls onShowExportModal when pressed', () => {
    const onShowExportModal = jest.fn();
    const { getByText } = render(
      <ExportData t={(k) => k} onShowExportModal={onShowExportModal} />
    );
    fireEvent.press(getByText('export_data'));
    expect(onShowExportModal).toHaveBeenCalled();
  });
});