import * as os from 'os'
import { Platform, Linux } from './linux'
import { Windows } from './windows'
export { Platform } from './linux'

export function getPlatform() {
    switch (os.platform()) {
        case 'linux':
            return new Linux() as Platform
        default:
            return new Windows() as Platform
    }
}

