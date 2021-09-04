/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Settings } from '~/components/Settings'
import { useSettings, useSettingsGroups } from '~/state'

export const SettingsContainer: React.FC = () => {
	const [settings, setSettings] = useSettings()
	const groups = useSettingsGroups()
	const handleSettingsChange = useCallback(
		(updated: any) => setSettings(updated),
		[setSettings],
	)
	return (
		<Container>
			<Settings
				settings={settings}
				groups={groups}
				onChange={handleSettingsChange}
			/>
		</Container>
	)
}

const Container = styled.div``
