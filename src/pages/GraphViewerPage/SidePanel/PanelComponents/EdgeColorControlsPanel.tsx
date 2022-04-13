/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { EdgeColorControls } from '../../../../components/controls/EdgeColorControls'

import styled from 'styled-components'

export const EdgeColorControlsPanel = () => {
	return (
		<Content>
			<EdgeColorControls />
		</Content>
	)
}

const Content = styled.div`
	margin: 8px;
`
