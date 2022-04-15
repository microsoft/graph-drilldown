/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from 'styled-components'

import { NodeSizeControls } from '../../../../components/controls/NodeSizeControls'

export const NodeSizeControlsPanel = () => {
	return (
		<Content>
			<NodeSizeControls />
		</Content>
	)
}

const Content = styled.div`
	margin: 8px;
`
