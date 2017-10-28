//import { platform, Platform } from '../../platform/platform.js'
import { DirectoryPresenter as DirectoryPresenterLinux } from './linux/directorypresenter.js'

export function create() {
    
    // switch (platform) {
    //     case Platform.Linux:
            return new DirectoryPresenterLinux()
        // default:
        //     return undefined
//    }
}

