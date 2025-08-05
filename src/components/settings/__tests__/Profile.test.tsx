import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Profile from '../Profile'

jest.mock('@themes/colors', () => ({
  colors: { secondary: '#fff', bgIcon: '#eee', icon: '#000' },
}));

describe('Profile', () => {
  it('calls onShowProfileModal when pressed', () => {
    const onShowProfileModal = jest.fn();
    const { getByText } = render(
      <Profile t={(k) => k} onShowProfileModal={onShowProfileModal} />
    );
    fireEvent.press(getByText('profile'));
    expect(onShowProfileModal).toHaveBeenCalled();
  });
});