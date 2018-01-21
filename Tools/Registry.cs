using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tools
{
    public class Registry
    {
        public enum Type
        {
            ClassesRoot,
            CurrentUser,
            LocalMachine
        }

        public static Registry Current = new Registry();

        public Item[] GetItems(Type type, string path)
        {
            Registry registry;
            switch (type)
            {
                case Type.ClassesRoot:
                    if (classesRoot == null)
                        classesRoot = new Registry(type);
                    registry = classesRoot;
                    break;
                case Type.CurrentUser:
                    if (currentUser == null)
                        currentUser = new Registry(type);
                    registry = currentUser;
                    break;
                case Type.LocalMachine:
                    if (localMachine == null)
                        localMachine = new Registry(type);
                    registry = localMachine;
                    break;
                default:
                    return null;
            }
            return registry.GetItems(path);
        }

        public Item[] GetItems(string path)
        {
            var key = path.Contains('\\') ? root.OpenSubKey(path.Substring(path.IndexOf('\\') + 1)) : root;


            var parent = path.Contains('\\') ? path.Substring(0, path.LastIndexOf('\\')) : "Registry";

            var subkeys = key.GetSubKeyNames();
            var items = from n in subkeys
                        select Item.CreateRegistryItem(key, n, RegistryValueKind.None, null);

            var props = key.GetValueNames();
            var values = from n in props
                         orderby n
                         select Item.CreateRegistryPropertyItem(n, key.GetValueKind(n), key.GetValue(n));

            return Enumerable.Repeat<Item>(Item.CreateParentItem(parent), 1).Concat(items.Cast<Item>()).Concat(values.Cast<Item>()).ToArray();
        }

        Registry()
        {
        }

        Registry(Type type)
        {
            switch (type)
            {
                case Type.ClassesRoot:
                    root = Microsoft.Win32.Registry.ClassesRoot;
                    break;
                case Type.CurrentUser:
                    root = Microsoft.Win32.Registry.CurrentUser;
                    break;
                case Type.LocalMachine:
                    root = Microsoft.Win32.Registry.LocalMachine;
                    break;
            }
        }

        RegistryKey root;

        static Registry classesRoot;
        static Registry currentUser;
        static Registry localMachine;
    }
}
