/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IButtonProps } from '@fluentui/react'
import { IconButton } from '@fluentui/react'
import { useCallback } from 'react'
import type { RouteComponentProps } from 'react-router-dom'
import { withRouter } from 'react-router-dom'

export interface RouterLinkIconButtonProps
	extends RouteComponentProps,
		IButtonProps {
	to: any
}

const LinkButton: React.FC<RouterLinkIconButtonProps> = (props) => {
	const { history, location, match, staticContext, to, ...buttonProps } = props
	const handleClick = useCallback(() => {
		history.push(to)
	}, [history, to])
	return <IconButton onClick={handleClick} {...buttonProps} />
}

export const RouterLinkIconButton: any = withRouter(LinkButton as any)
