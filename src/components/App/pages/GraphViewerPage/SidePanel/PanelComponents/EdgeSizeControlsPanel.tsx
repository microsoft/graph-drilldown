/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { EdgeSizeControls } from '../../../../../controls/EdgeSizeControls'
import React from 'react'
import styled from 'styled-components'

export const EdgeSizeControlsPanel = () => {
	return (
		<Content>
			<EdgeSizeControls />
		</Content>
	)
}

const Content = styled.div`
	margin: 8px;
`
