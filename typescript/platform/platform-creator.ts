import * as os from 'os'
import { Linux } from './linux'
import { Windows } from './windows'
import { Platform } from './platform'
export { Platform } from './platform'

export function getPlatform() {
    switch (os.platform()) {
        case 'linux':
            return new Linux() as Platform
        default:
            return new Windows() as Platform
    }
}

