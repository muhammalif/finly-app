import React from "react";
import { render } from "@testing-library/react-native";
import CheckVersion from '../CheckVersion'

jest.mock('@themes/colors', () => ({
    colors: { secondary: '#fff', bgIcon: '#eee', icon: '#000' },
}))
jest.mock('react-native-version-check', () => ({
    getCurrentVersion: () => '1.2.3',
}))

describe('CheckVersion', () => {
    it('renders version string', () => {
        const { getByText } = render(
            <CheckVersion t={(k, o) => (o?.defaultValue ? o.defaultValue : k)} />
        )
        expect(getByText(/v1.2.3/)).toBeTruthy()
    })
})