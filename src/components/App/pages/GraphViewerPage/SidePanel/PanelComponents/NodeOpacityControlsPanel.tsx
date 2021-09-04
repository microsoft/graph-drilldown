/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { NodeOpacityControls } from '../../../../../controls/NodeOpacityControls'
import React from 'react'
import styled from 'styled-components'

export const NodeOpacityControlsPanel = () => {
	return (
		<Content>
			<NodeOpacityControls />
		</Content>
	)
}

const Content = styled.div`
	margin: 8px;
`
