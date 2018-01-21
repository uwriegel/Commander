using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Tools
{
    /// <summary>
    /// Entweder die Quelle oder das Ziel einer Operation
    /// </summary>
    class OperationProcessor
    {
        public string Directory { get; private set; }

        public OperationProcessor(string directory)
        {
            Directory = directory;
        }

        public static OperationProcessor Create(string directory)
        {
            switch (directory)
            {
                case "drives":
                    return new DriveProcessor();
                case "Dienste":
                    throw new ServiceNotSupportedException();
                case "Favoriten":
                    throw new FavoriteException();
                default:
                    return new DirectoryProcessor(directory);
            }
        }

        public virtual ConflictItem[] GetTargetItems(IEnumerable<ConflictItem> source)
        {
            return new ConflictItem[0];
        }

        public virtual bool CheckSelection(Item[] items)
        {
            return true;
        }

        public virtual bool CheckSubordinates(Item[] items, OperationProcessor target)
        {
            return true;
        }

        public virtual bool HandleOperation(Operation operation)
        {
            return false;
        }

        public virtual void TargetOperationOperate(string sourceDirectory, Item[] items)
        {
        }

        public virtual Item[] GetConflicts(IEnumerable<Item> items, CancellationToken cancellationToken)
        {
            return new Item[0];
        }

        public virtual void FillConflicts(ConflictItem oi, bool target)
        {
        }

        public virtual void ExtractSubItems(List<ConflictItem> operationItems, ConflictItem directoryItem, CancellationToken cancellationToken)
        {
        }

        public virtual void Delete(Item[] items)
        {
        }

        protected virtual string[] GetParentItems()
        {
            return new string[0];
        }
    }
}
