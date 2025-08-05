import React from "react";
import { render } from "@testing-library/react-native";
import PrivacyPolicy from '../PrivacyPolicy'

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ i18n: { language: 'en' } }),
}))

describe('PrivacyPolicy', () => {
    it('renders privacy policy title', () => {
        const { getByText } = render(<PrivacyPolicy />)
        expect(getByText('Privacy Policy')).toBeTruthy()
    })
})