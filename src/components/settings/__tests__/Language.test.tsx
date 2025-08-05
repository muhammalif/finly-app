import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Language from '../Language'

jest.mock('@themes/colors', () => ({
    colors: { secondary: '#fff', bgIcon: '#eee', icon: '#000' },
}))

describe('Language', () => {
    it('shows language and calls onShowLangModal when pressed', () => {
        const onShowLangModal = jest.fn()
        const i18n = { language: 'id' }
        const { getByText } = render(
            <Language t={(k) => k} i18n={i18n} onShowLangModal={onShowLangModal} />
        )
        expect(getByText('Indonesia')).toBeTruthy()
        fireEvent.press(getByText('language'))
        expect(onShowLangModal).toHaveBeenCalled()
    })
})