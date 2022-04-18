/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useArqueroVisibleCommunities } from '~/arquero'

import { CommunityList } from '../CommunityList'

export const CommunityPanel: React.FC = () => {
	const communities = useArqueroVisibleCommunities()
	return (
		<CommunityList
			style={{
				background: 'transparent',
			}}
			communities={communities}
		/>
	)
}
