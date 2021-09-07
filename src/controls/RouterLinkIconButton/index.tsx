/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IButtonProps, IconButton } from '@fluentui/react'
import { useCallback } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'

interface RouterLinkIconButtonProps extends RouteComponentProps, IButtonProps {
	to: any
}

const LinkButton: React.FC<RouterLinkIconButtonProps> = props => {
	const { history, location, match, staticContext, to, ...buttonProps } = props
	const handleClick = useCallback(() => {
		history.push(to)
	}, [history, to])
	return <IconButton onClick={handleClick} {...buttonProps} />
}

export const RouterLinkIconButton = withRouter(LinkButton)
