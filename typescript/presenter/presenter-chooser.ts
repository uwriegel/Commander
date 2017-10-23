// import { Presenter }  from './presenter.js'
import { RootPresenter }  from './rootpresenter.js'
import { DirectoryPresenter }  from './directory-presenter.js'
// export { Presenter }  from './presenter.js'
// import { View }  from '../view.js'

export class PresenterChooser
{
    static readonly rootSelector = "root"

    static get(path: string, currentPresenter: Presenter, view: View): Presenter {
        if (path == "root") {
            if (currentPresenter.checkPath(path))
                return currentPresenter
            else {
                const presenter = new RootPresenter()
                view.Presenter =presenter
                return presenter
            }
        }
        else {
            if (currentPresenter.isDefault)
                return currentPresenter
            view.Presenter = new DirectoryPresenter() 
            return view.Presenter
        }
    }
}