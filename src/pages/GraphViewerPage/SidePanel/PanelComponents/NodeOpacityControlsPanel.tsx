/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { NodeOpacityControls } from '../../../../components/controls/NodeOpacityControls'

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
