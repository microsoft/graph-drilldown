/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { EdgeOpacityControls } from '../../../../../controls/EdgeOpacityControls'

import styled from 'styled-components'

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
