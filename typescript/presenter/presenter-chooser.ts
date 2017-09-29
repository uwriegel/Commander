import { Presenter }  from './presenter'
import { RootPresenter }  from './rootpresenter'
import { DirectoryPresenter }  from './directory-presenter'
export { Presenter }  from './presenter'
import { View }  from '../view'

export class PresenterChooser
{
    static get(path: string, currentPresenter: Presenter, view: View): Presenter {
        if (path == "root") {
            if (currentPresenter.checkPath(path))
                return currentPresenter
            else {
                const presenter = new RootPresenter()
                view.setPresenter(presenter)
                return presenter
            }
        }
        else {
            if (currentPresenter.isDefault)
                return currentPresenter
            const presenter = new DirectoryPresenter()
            view.setPresenter(presenter)
            return presenter
        }
    }
}