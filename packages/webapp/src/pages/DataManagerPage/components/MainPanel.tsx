/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ArqueroDetailsList } from '@essex/arquero-react'
import { DefaultButton } from '@fluentui/react'
import { FileTable } from '@graph-drilldown/components'
import styled from 'styled-components'

import { useFileManagement } from '~/hooks/files'

export const MainPanel: React.FC = () => {
	const { files, selectedFile, onFileSelected, doClearAll, hasData } =
		useFileManagement()

	return (
		<Container>
			<Files>
				<FileTable
					files={files}
					selected={selectedFile}
					onClick={onFileSelected}
				/>
				<Reset>
					{hasData ? (
						<DefaultButton text='Clear all' onClick={doClearAll} />
					) : null}
				</Reset>
			</Files>

			{selectedFile?.table ? (
				<Viewer>
					<ArqueroDetailsList
						table={selectedFile.table}
						isHeadersFixed
						features={{
							smartHeaders: true,
						}}
					/>
				</Viewer>
			) : null}
		</Container>
	)
}

const Container = styled.div``

const Files = styled.div`
	display: flex;
	flex-direction column;
	gap: 10px;
	margin-bottom: 10px;
`

const Viewer = styled.div`
	height: 600px;
	border: 1px solid ${({ theme }) => theme.application().border().hex()};
`

const Reset = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-end;
`
