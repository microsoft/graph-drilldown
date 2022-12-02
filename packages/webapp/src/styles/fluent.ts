/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/**
 * Styling helpers for fluent inline styles.
 */
import type {
	ISpinnerStyleProps,
	ISpinnerStyles,
	IStyleFunctionOrObject,
	ITextProps,
} from '@fluentui/react'

export const COMMANDBAR_HEIGHT = 32
export const COMMANDBAR_MARGIN = 12
export const HEADER_HEIGHT = COMMANDBAR_HEIGHT + COMMANDBAR_MARGIN * 2

export const PANEL_WIDTH = 240
export const APP_PADDING_LEFT = 30

export const BREAD_CRUMB_STYLES = {
	root: {
		marginTop: 0,
	},
	item: { fontSize: 'medium' },
}

export const SPINNER_STYLE: IStyleFunctionOrObject<
	ISpinnerStyleProps,
	ISpinnerStyles
> = {
	root: {
		zIndex: 1,
		marginLeft: 300,
		marginTop: 300,
	},
	label: { fontSize: 32 },
	circle: { width: 200, height: 200 },
}

export const SIDE_PANEL_STYLE: React.CSSProperties = {
	position: 'relative',
}

export const HELP_PANEL_STYLE: React.CSSProperties = { fontSize: '0.8em' }
export const GUTTER = 10
export const ANIMATION_DURATION = 500
// Fluent Text Styles
const tiny = 'tiny' as ITextProps['variant']
const xSmall = 'xSmall' as ITextProps['variant']
const small = 'small' as ITextProps['variant']
const smallPlus = 'smallPlus' as ITextProps['variant']
const medium = 'medium' as ITextProps['variant']
const mediumPlus = 'mediumPlus' as ITextProps['variant']
const large = 'large' as ITextProps['variant']
const xLarge = 'xLarge' as ITextProps['variant']
const xxLarge = 'xxLarge' as ITextProps['variant']
const mega = 'mega' as ITextProps['variant']

export const variants = {
	tiny,
	xSmall,
	small,
	smallPlus,
	medium,
	mediumPlus,
	large,
	xLarge,
	xxLarge,
	mega,
}

export const headerLabel = variants.mediumPlus as ITextProps['variant']
export const subHeaderLabel = variants.small as ITextProps['variant']

export const smallButtonProps = {
	styles: {
		root: {
			minWidth: 'unset',
		},
	},
}

export const pivotStyles = {
	root: {
		textAlign: 'center'
	},
	link: {
		height: 28,
		fontSize: 12
	}
}
