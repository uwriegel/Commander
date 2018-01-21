using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Tools
{
    class DirectoryProcessor : OperationProcessor
    {
        public DirectoryProcessor(string directory) : base(directory)
        {
        }

        public override ConflictItem[] GetTargetItems(IEnumerable<ConflictItem> source)
        {
            return source.Where(n => File.Exists(Path.Combine(Directory, n.NameWithSubPath))).ToArray();
        }

        public override Item[] GetConflicts(IEnumerable<Item> items, CancellationToken cancellationToken)
        {
            return (from n in items
                    let p = Path.Combine(Directory, n.Name)
                    where File.Exists(p) || System.IO.Directory.Exists(p)
                    where !cancellationToken.IsCancellationRequested
                    select n).ToArray();
        }

        public override void FillConflicts(ConflictItem conflict, bool target)
        {
            if (conflict != null)
            {
                var source = Path.Combine(Directory, conflict.NameWithSubPath);
                var info = new FileInfo(source);
                if (target)
                {
                    conflict.TargetFileSize = info.Length;
                    conflict.TargetVersion = FileVersion.Get(source);
                    conflict.TargetDateTime = info.LastWriteTime;
                }
                else
                {
                    conflict.SourceVersion = FileVersion.Get(source);
                    conflict.SourceDateTime = info.LastWriteTime;
                }
            }
        }

        public override void ExtractSubItems(List<ConflictItem> operationItems, ConflictItem directoryItem, CancellationToken cancellationToken)
        {
            var directoryInfo = new DirectoryInfo(Path.Combine(Directory, directoryItem.NameWithSubPath));
            RefreshFiles(operationItems, directoryInfo, directoryItem.SubPath, cancellationToken);
            var subDirs = RefreshDirectories(directoryInfo, directoryItem.SubPath);
            foreach (var subDir in subDirs)
                ExtractSubItems(operationItems, subDir, cancellationToken);
        }

        public override bool CheckSubordinates(Item[] items, OperationProcessor target)
        {
            var targetProcessor = target as DirectoryProcessor;
            if (targetProcessor == null)
                // verschiedene Processoren, kann nicht untergeordnet sein
                return true;

            var parents = targetProcessor.GetParentItems();
            var directories = items.Where(n => n.Kind == Kind.Directory).ToArray();
            return directories.Any(n => CheckSubordinates(Directory, n, parents) == false) ? false : true;
        }

        public override void Delete(Item[] items)
        {
            var fi = new FileOperation(Directory, Api.FileFuncFlags.FO_DELETE);
            fi.Delete(items);
        }

        protected override string[] GetParentItems()
        {
            var parents = new List<string>();
            var directory = Directory;
            while (true)
            {
                var di = new DirectoryInfo(directory);
                if (di.Parent == null)
                    return parents.ToArray();
                directory = di.Parent.FullName;
                parents.Add(directory);
            }
        }

        void RefreshFiles(List<ConflictItem> operationItems, DirectoryInfo directoryInfo, string subPath, CancellationToken cancellationToken)
        {
            var files = directoryInfo.SafeGetFiles()
                .Where(n => Show(n.Attributes))
                .Select(n => ConflictItem.CreateConflictFileItem(n.Name, n.Extension, n.FullName, n.Length,
                    n.LastWriteTime, CombineSubPath(subPath, directoryInfo.Name)));
            foreach (var file in files)
            {
                if (cancellationToken.IsCancellationRequested)
                    throw new CancelledException();
                operationItems.Add(file);
            }
        }

        ConflictItem[] RefreshDirectories(DirectoryInfo directoryInfo, string subPath)
        {
            return directoryInfo.SafeGetDirectories()
                .Where(n => Show(n.Attributes))
                .OrderBy(n => n.Name)
                .Select(n => ConflictItem.CreateConflictDirectoryItem(n.Name, CombineSubPath(subPath, directoryInfo.Name))).ToArray();
        }

        bool Show(System.IO.FileAttributes attributes)
        {
            // TODO: Show Hidden
            return true;
        }

        string CombineSubPath(string subPath, string directoryName)
        {
            if (subPath == null)
                return directoryName;
            return Path.Combine(subPath, directoryName);
        }

        bool CheckSubordinates(string directory, Item directoryItem, string[] parents)
        {
            var sourceUri = new Uri(Path.Combine(directory, directoryItem.Name));
            var targetUris = parents.Select(n => new Uri(n));
            return targetUris.Any(n => n == sourceUri) ? false : true;
        }
    }
}
