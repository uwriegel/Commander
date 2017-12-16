import { Presenter }  from './presenter.js'
import { create as createRoot }  from './platform/rootcreator.js'
import { create as createDirectory } from './platform/directorycreator.js'
export { Presenter }  from './presenter.js'
import { View }  from '../view.js'


export class PresenterChooser
{
    static readonly rootSelector = "root"

    static get(path: string, currentPresenter: Presenter, view: View): Presenter {
        if (path == "root") {
            if (currentPresenter.checkPath(path))
                return currentPresenter
            else {
                const presenter = createRoot()
                view.setPresenter(presenter)
                return presenter
            }
        }
        else {
            if (currentPresenter.isDefault)
                return currentPresenter
            view.setPresenter(createDirectory()!)
            return view.getPresenter()
        }
    }
}