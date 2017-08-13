
/**
 * Verwaltung der Favoriten
 */
var Favorites = (function ()
{
    /**
     * Abfrage der Favoriten
     * @param lastCurrentDir Das Verzeichnis, welches durch dieses ersetzt werden soll
     */
    function getItems(lastCurrentDir: string): GetItemsOutput
    {
        return {
            currentDirectory: "Favoriten",
            items: getFavoriteItems(lastCurrentDir)
        }
    }

    function addItem(path: string, itemName: string)
    {
        var favorites = get()

        if (find(favorites, path, itemName) == -1)
        {
            favorites.push({
                name: itemName,
                item: itemName,
                path: path
            })

            favorites = favorites.sort((a, b) =>
            {
                /// <param name="a" type="Item">Das erste zu vergleichende Item</param>
                /// <param name="b" type="Item">Das zweite zu vergleichende Item</param>
                return a.name.localeCompare(b.name)
            })

            safe(favorites)
        }
    }

    function renameItem(path: string, name: string, newName: string)
    {
        var favorites = get()

        var pos = find(favorites, path, name)
        if (pos != -1)
            favorites[pos].name = newName;

        favorites = favorites.sort((a, b) =>
        {
            /// <param name="a" type="Item">Das erste zu vergleichende Item</param>
            /// <param name="b" type="Item">Das zweite zu vergleichende Item</param>
            return a.name.localeCompare(b.name)
        })

        safe(favorites)
    }

    function deleteItems(items: Item[])
    {
        var favorites = get()

        items.forEach(n =>
        {
            var index = find(favorites, n.parent, n.name)
            if (index != -1)
                favorites.splice(index, 1)
        })

        safe(favorites)
    }

    function getFavoriteItems(lastCurrentDir: string): Item[]
    {
        return [{
            imageUrl: "images/parentfolder.png",
            kind: ItemsKind.Parent,
            name: "..",
            fileSize: 0,
            parent: "drives"
        }].concat(get().map(n =>
            {
            return {
                imageUrl: "images/favorite.png",
                kind: ItemsKind.Favorite,
                name: n.name,
                favoriteTarget: n.item,
                fileSize: 0,
                parent: n.path
            }
            }))
    }

    function get(): Favorite[]
    {
        var favoritesString = localStorage["favorites"]
        if (!favoritesString)
            return []
        return JSON.parse(favoritesString)
    }

    function safe(favorites: Favorite[])
    {
        localStorage["favorites"] = JSON.stringify(favorites)
    }

    function find(favorites: Favorite[], path: string, itemName: string)
    {
        var index = -1
        return favorites.find((n, i) =>
        {
            index = i
            return (n.name == itemName && n.path == path)
        }) ? index : -1
    }

    return {
        getItems: getItems,
        addItem: addItem,
        renameItem: renameItem,
        deleteItems: deleteItems
    }
})()