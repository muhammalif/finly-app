/**
 * Utility for checking if a new app version is available and prompting the user to update.
 * @module checker
 */
import { Alert, Linking } from 'react-native'
import VersionCheck from 'react-native-version-check'

/**
 * Checks for app updates and prompts the user if a new version is available.
 * @returns Promise resolving when the check is complete
 */
export const checkForUpdate = async () => {
    try {
        const updateInfo = await VersionCheck.needUpdate()
        if (updateInfo.isNeeded) {
            Alert.alert(
                'Update Available',
                `A new version (${updateInfo.latestVersion}) is available`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Update', onPress: () => Linking.openURL(updateInfo.storeUrl) }
                ]
            )
        }
    } catch (error) {
        console.error('Update check failed:', error)
    }
} 