
export enum Platform {
    Linux,
    Windows
}

export var platform = (() => navigator.platform.startsWith("Linux") ? Platform.Linux : Platform.Windows)()

