import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Support from '../Support'

jest.mock('@themes/colors', () => ({
    colors: { secondary: '#fff', bgIcon: '#eee', icon: '#000' },
}))

describe('Support', () => {
    it('calls onShowSupportModal when pressed', () => {
        const onShowSupportModal = jest.fn()
        const { getByText } = render(
            <Support t={(k) => k} onShowSupportModal={onShowSupportModal} />
        )
        fireEvent.press(getByText('support'))
        expect(onShowSupportModal).toHaveBeenCalled()
    })
})