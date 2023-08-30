/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Spinner, SpinnerSize } from '@fluentui/react'

import { SPINNER_STYLE } from '~/styles'

export const StyledSpinnner = () => {
	return (
		<Spinner
			label='Loading graph...'
			styles={SPINNER_STYLE}
			size={SpinnerSize.large}
		/>
	)
}
