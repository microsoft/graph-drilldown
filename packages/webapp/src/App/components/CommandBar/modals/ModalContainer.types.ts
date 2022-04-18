/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface ButtonOptions {
	key: string
	iconName: string
	title: string
	type: ModalPageType
}

export enum ModalPageType {
	Upload = 'upload',
	Export = 'export',
	Settings = 'settings',
	Help = 'help',
}
