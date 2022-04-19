/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { RecoilRoot } from 'recoil'

export const StateContext: React.FC<{
	children: JSX.Element | JSX.Element[]
}> = memo(function StateContext({ children }) {
	return <RecoilRoot>{children}</RecoilRoot>
})
