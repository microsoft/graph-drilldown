/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { atom, useRecoilState } from 'recoil'

// note - separating this from 'settings' as they would likely become non-user-visible flags
const DEFAULT_FEATURES = {
	enableSmallMultiples: true,
	enableZoomToCommunity: true,
}

export const featuresState = atom({
	key: 'features',
	default: DEFAULT_FEATURES,
})

export function useFeatures() {
	return useRecoilState(featuresState)
}
