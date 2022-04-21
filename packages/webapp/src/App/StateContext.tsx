/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ReactNode } from 'react'
import { memo } from 'react'
import { RecoilRoot } from 'recoil'

export const StateContext: React.FC<{
	children?: ReactNode
}> = memo(function StateContext({ children }) {
	return <RecoilRoot>{children}</RecoilRoot>
})
