/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from 'styled-components'

import { EdgeOpacityControls } from '../../../../components/controls/EdgeOpacityControls'

export const EdgeOpacityControlsPanel = () => {
	return (
		<Content>
			<EdgeOpacityControls />
		</Content>
	)
}

const Content = styled.div`
	margin: 8px;
`
