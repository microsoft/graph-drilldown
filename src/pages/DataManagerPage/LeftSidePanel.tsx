/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PreviewGraph } from '../../components/PreviewGraph'
import { QuickDrop } from '../../components/QuickDrop'

import styled from 'styled-components'
import { useSettings } from '~/state'
import { PANEL_WIDTH } from '~/styles'

const PREVIEW_SIZE = PANEL_WIDTH - 16

export const LeftSidePanel = () => {
	const [settings] = useSettings()
	return (
		<Container>
			<Section>
				<SectionTitle>Quick import</SectionTitle>
				<QuickDrop />
			</Section>
			{settings.showPreviewMap ? (
				<Section>
					<SectionTitle>Preview</SectionTitle>
					<Preview>
						<PreviewGraph width={PREVIEW_SIZE} height={PREVIEW_SIZE} />
					</Preview>
				</Section>
			) : null}
		</Container>
	)
}

const Container = styled.div`
	width: ${PANEL_WIDTH}px;
`

const SectionTitle = styled.h2`
	font-size: 0.8em;
	text-align: center;
`

const Section = styled.div`
	margin-top: 20px;
`

const Preview = styled.div`
	margin-left: 8px;
`
