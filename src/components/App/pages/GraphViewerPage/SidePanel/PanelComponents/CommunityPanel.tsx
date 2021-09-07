/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { CommunityList } from '../../../../../CommunityList'

import { useArqueroVisibleCommunities } from '~/arquero'

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
