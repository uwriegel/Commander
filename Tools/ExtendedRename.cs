using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tools
{
    static class ExtendedRename
    {
        public static void Execute(ItemsInput items)
        {
            try
            {
                foreach (var item in items.Items)
                    CacheRename(items.Directory, item);
                foreach (var item in items.Items)
                    VerifyRename(items.Directory, item);
                foreach (var item in items.Items)
                    RenameFile(items.Directory, item);
            }
            catch
            {
                foreach (var item in items.Items)
                    UndoRename(items.Directory, item);
                throw;
            }
        }

        static void CacheRename(string directory, Item item) => File.Move(Path.Combine(directory, item.Name), GetMaskedName(directory, item));

        static void VerifyRename(string directory, Item item)
        {
            if (File.Exists(GetRenamedName(directory, item)))
                throw new Exception("Datei exisitert");
        }

        static void RenameFile(string directory, Item item)
        {
            File.Move(GetMaskedName(directory, item), GetRenamedName(directory, item));
        }

        static void UndoRename(string directory, Item item)
        {
            File.Move(GetMaskedName(directory, item), Path.Combine(directory, item.Name));
        }

        static string GetMaskedName(string directory, Item item) => Path.Combine(directory, $"#{ExtractNameonly(item.Name)}{item.Extension}");

        static string GetRenamedName(string directory, Item item) => Path.Combine(directory, $"{item.renamedName}{item.Extension}");

        static string ExtractNameonly(string file)
        {
            var pos = file.LastIndexOf('.');
            if (pos != -1)
                return file.Substring(0, pos);
            else
                return file;
        }
    }
}
