using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tools
{
    class FileOperation
    {
        public FileOperation(string path, Api.FileFuncFlags function) : this(path, null, function)
        {
        }

        public FileOperation(string sourcePath, string targetPath, Api.FileFuncFlags function)
        {
            this.sourcePath = sourcePath;
            this.targetPath = targetPath;
            fileop = new Api.SHFILEOPSTRUCT();
            fileop.hwnd = Api.GetForegroundWindow();
            fileop.lpszProgressTitle = "Captain Kirk";
            fileop.fFlags = Api.FILEOP_FLAGS.FOF_NOCONFIRMATION | Api.FILEOP_FLAGS.FOF_NOCONFIRMMKDIR;

            fileop.wFunc = function;
        }

        public void Copy(Item[] items)
        {
            if (items.Count() == 0)
                return;

            fileop.pFrom = CreateFileOperationPaths(items.Select(n => Path.Combine(sourcePath, n.Name)));
            fileop.pTo = CreateFileOperationPaths(Enumerable.Repeat<string>(targetPath, items.Length));
            int ret = Api.SHFileOperation(ref fileop);
        }

        public void Rename(string oldName, string newName)
        {
            fileop.fFlags = Api.FILEOP_FLAGS.FOF_NOCONFIRMATION | Api.FILEOP_FLAGS.FOF_NOCONFIRMMKDIR;
            fileop.pFrom = CreateFileOperationPaths(new[] { Path.Combine(sourcePath, oldName) });
            fileop.pTo = CreateFileOperationPaths(new[] { Path.Combine(sourcePath, newName) });
            int ret = Api.SHFileOperation(ref fileop);
        }

        public void Move(Item[] items)
        {
            if (items.Count() == 0)
                return;

            fileop.pFrom = CreateFileOperationPaths(items.Select(n => Path.Combine(sourcePath, n.Name)));
            fileop.pTo = CreateFileOperationPaths(Enumerable.Repeat<string>(targetPath, items.Length));
            int ret = Api.SHFileOperation(ref fileop);
        }

        public void Copy(Item[] noConflictItems, IEnumerable<ConflictItem> operationitems, ConflictItem[] conflictItems)
        {
            var noConflictsInConflicts = operationitems.Where(n => !conflictItems.Contains(n));
            if (noConflictsInConflicts.Count() == 0 && noConflictItems.Length == 0)
                return;

            fileop.fFlags |= Api.FILEOP_FLAGS.FOF_MULTIDESTFILES;

            var sourceNoConflicts = noConflictItems.Select(n => Path.Combine(sourcePath, n.Name));
            var sourceNoConflictsInConflicts = noConflictsInConflicts.Select(n => Path.Combine(sourcePath, n.NameWithSubPath));
            var sourceFiles = sourceNoConflicts.Concat(sourceNoConflictsInConflicts);
            fileop.pFrom = CreateFileOperationPaths(sourceFiles);

            var targetNoConflicts = noConflictItems.Select(n => Path.Combine(targetPath, n.Name));
            var targetNoConflictsInConflicts = noConflictsInConflicts.Select(n => Path.Combine(targetPath, n.NameWithSubPath));
            var targetFiles = targetNoConflicts.Concat(targetNoConflictsInConflicts);
            fileop.pTo = CreateFileOperationPaths(targetFiles);

            int ret = Api.SHFileOperation(ref fileop);
        }

        public void Delete(Item[] items)
        {
            if (items.Count() == 0)
                return;

            fileop.fFlags = Api.FILEOP_FLAGS.FOF_NOCONFIRMATION | Api.FILEOP_FLAGS.FOF_ALLOWUNDO;
            fileop.pFrom = CreateFileOperationPaths(items.Select(n => Path.Combine(sourcePath, n.Name)));
            fileop.pTo = null;
            int ret = Api.SHFileOperation(ref fileop);
        }

        string CreateFileOperationPaths(IEnumerable<string> paths)
        {
            var sb = new StringBuilder();
            foreach (var path in paths)
            {
                sb.Append(path);
                sb.Append("\x0");
            }
            sb.Append("\x0");
            return sb.ToString();
        }

        string sourcePath;
        string targetPath;
        Api.SHFILEOPSTRUCT fileop;
    }
}
