import { platform, Platform } from '../../platform.js'
import { RootPresenter as RootPresenterWindows } from './windows/rootpresenter.js'
import { RootPresenter as RootPresenterLinux } from './linux/rootpresenter.js'

export function create() {
    
    switch (platform) {
        case Platform.Linux:
            return new RootPresenterLinux()
        default:
            return new RootPresenterWindows()
    }
}

