/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton } from '@fluentui/react'
import { memo } from 'react'

import { AUTOLAYOUT_URL } from '~/constants'

export interface UmapLayoutProps {
	onClick: () => void
}

/**
 * Config for UMAP autolayout. Right now it just uses default params,
 * but only exposes the button if a service URL has been configured.
 */
export const UmapLayout: React.FC<UmapLayoutProps> = memo(function UmapLayout({
	onClick,
}) {
	return (
		<>
			{AUTOLAYOUT_URL ? (
				<DefaultButton text={'UMAP'} onClick={onClick} />
			) : null}
		</>
	)
})
