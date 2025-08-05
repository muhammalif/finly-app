import React from "react";
import { render } from "@testing-library/react-native";
import TermsOfUse from '../TermsOfUse'

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ i18n: { language: 'en' } }),
}))

describe('TermsOfUse', () => {
    it('renders terms of use title', () => {
        const { getByText } = render(<TermsOfUse />)
        expect(getByText('Terms of Use')).toBeTruthy()
    })
})