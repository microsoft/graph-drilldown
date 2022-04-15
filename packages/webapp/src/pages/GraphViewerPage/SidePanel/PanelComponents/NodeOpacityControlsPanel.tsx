/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from 'styled-components'

import { NodeOpacityControls } from '../../../../components/controls/NodeOpacityControls'

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
