/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import './HierarchyNav.css'

import type { IIconProps } from '@fluentui/react'
import { ActionButton } from '@fluentui/react'
import { SelectionState } from '@thematic/core'
import { useThematic } from '@thematic/react'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'

import type { Breadcrumb } from '~/types'

const caretIcon: IIconProps = { iconName: 'ChevronDownSmall' }

export interface IHierarchyNav {
	items: Breadcrumb[]
	handleBreadcrumbClick: (item: Breadcrumb) => void
}

export const HierarchyNav: React.FC<IHierarchyNav> = memo(
	function HierarchyNav({ items, handleBreadcrumbClick }) {
		const theme = useThematic()
		const highlight = useMemo(
			() => ({
				iconChecked: {
					color: theme
						.node({ selectionState: SelectionState.Selected })
						.fill()
						.hex(),
				},
				root: { cursor: 'revert', maxHeight: 20 },
				label: { fontSize: 'large', fontWeight: 500 },
			}),
			[theme],
		)
		const normal = useMemo(
			() => ({
				root: { maxHeight: 20 },
				iconChecked: {
					color: theme
						.node({ selectionState: SelectionState.Normal })
						.fill()
						.hex(),
				},
			}),
			[theme],
		)

		const reverseList = useMemo(() => items.reverse(), [items])
		const handleListClick = useCallback(
			(item: Breadcrumb, index: number) => {
				if (index !== 0) {
					// leaf is not clickable
					handleBreadcrumbClick(item)
				}
			},
			[handleBreadcrumbClick],
		)

		const nestedContent = useMemo(() => {
			return reverseList.reduce((prevContent, item, i) => {
				const colorStyle = i === 0 ? highlight : normal
				const className = i === reverseList.length - 1 ? 'tree' : 'nested'
				const ranking = reverseList.length - 1 - i
				const content = (
					<ul className={className}>
						<li>
							<NestedContent
								className="tree_label"
								id={`list-item-${ranking}`}
								onClick={() => handleListClick(item, i)}
								onKeyDown={() => handleListClick(item, i)}
								tabIndex={i}
							>
								{i === 0 ? (
									<ActionButton styles={colorStyle} checked={true}>
										{item.text}
									</ActionButton>
								) : (
									<ActionButton
										styles={colorStyle}
										iconProps={caretIcon}
										checked={true}
									>
										{item.text}
									</ActionButton>
								)}
							</NestedContent>
							{prevContent}
						</li>
					</ul>
				)
				prevContent = content
				return prevContent
			}, undefined as any)
		}, [reverseList, highlight, normal, handleListClick])

		return <Container>{nestedContent}</Container>
	},
)

const Container = styled.div``
const NestedContent = styled.div``
