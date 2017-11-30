import { platform, Platform } from '../../platform.js'
import { DirectoryPresenter as DirectoryPresenterLinux } from './linux/directorypresenter.js'
import { DirectoryPresenter as DirectoryPresenterWindows } from './windows/directorypresenter.js'

export function create() {
    
    switch (platform) {
        case Platform.Linux:
            return new DirectoryPresenterLinux()
        case Platform.Windows:
            return new DirectoryPresenterWindows()
    }
}

