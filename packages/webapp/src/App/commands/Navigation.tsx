/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useLocation } from 'react-router-dom'

import { RouterLinkIconButton } from '../../controls/RouterLinkIconButton'

export const Navigation: React.FC = () => {
	const { search, pathname } = useLocation()
	return (
		<>
			<RouterLinkIconButton
				to={{
					pathname: '/',
					search,
				}}
				checked={pathname === '/'}
				title={'Graph viewer page'}
				iconProps={{
					iconName: 'Relationship',
				}}
			/>
			<RouterLinkIconButton
				to={{
					pathname: '/files',
					search,
				}}
				checked={pathname === '/files'}
				title={'Data management page'}
				iconProps={{
					iconName: 'DataConnectionLibrary',
				}}
			/>
		</>
	)
}
