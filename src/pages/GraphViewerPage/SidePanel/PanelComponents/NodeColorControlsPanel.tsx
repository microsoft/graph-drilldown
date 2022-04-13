/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { NodeColorControls } from '../../../../components/controls/NodeColorControls'

import styled from 'styled-components'

export const NodeColorControlsPanel = () => {
	return (
		<Content>
			<NodeColorControls />
		</Content>
	)
}

const Content = styled.div`
	margin: 8px;
`
