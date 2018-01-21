using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Tools
{
    /// <summary>
    /// Die Operation wird in der Extension angelegt und solange gespeichert, wie sie benötigt wird
    /// Falls mehrere Operations gleichzeitig (Serverbetrieb!) ablaufen können sollen, muss eine Sessionverwaltung eingeführt werden
    /// </summary>
    class Operation
    {
        public Operation(string sourceDir, string targetDir, Item[] items)
        {
            this.items = items.Where(n => n.Kind != Kind.Parent && n.Kind != Kind.Drive).ToArray();
            sourceProcessor = OperationProcessor.Create(sourceDir);
            if (!string.IsNullOrEmpty(targetDir))
                targetProcessor = OperationProcessor.Create(targetDir);
        }

        public bool CheckDirectories()
        {
            if (!IsDualOperation())
                return true;
            return string.Compare(sourceProcessor.Directory, targetProcessor.Directory, true) != 0;
        }

        public bool CheckSelection()
        {
            if (items.Count() == 0)
                return false;
            if (targetProcessor == null)
                return true;
            else
                return targetProcessor.CheckSelection(items);
        }

        public bool CheckSubordinates()
        {
            if (!IsDualOperation())
                return true;
            return sourceProcessor.CheckSubordinates(items, targetProcessor);
        }

        public bool CheckCompatibility()
        {
            if (!IsDualOperation())
                return true;
            return CheckExtendedCompatibility();
        }

        public virtual string CheckException()
        {
            return null;
        }

        /// <summary>
        /// Vorbereitung auf die Operation
        /// </summary>
        /// <returns>Einträge, die Konflikte verusachen können</returns>
        public ConflictItem[] Prepare(CancellationToken cancellationToken)
        {
            if (!IsDualOperation())
            {
                TakeItems(items, cancellationToken);
                return new ConflictItem[0];
            }

            var conflictItems = GetConflicts(cancellationToken);

            ExtractSubItems(conflictItems, cancellationToken);
            var result = targetProcessor.GetTargetItems(operationItems);
            foreach (var conflict in result)
            {
                sourceProcessor.FillConflicts(conflict, false);
                targetProcessor.FillConflicts(conflict, true);
            }
            if (result.Length > 0)
                this.conflictItems = result;
            return result;
        }

        public void Operate(bool ignoreConflicts, Action finished)
        {
            OperationRunner.Operate(() =>
            {
                RunOperation(operationItems, ignoreConflicts);
            }, finished);
        }

        protected virtual bool CheckExtendedCompatibility()
        {
            return true;
        }

        protected virtual bool IsDualOperation()
        {
            return false;
        }

        protected virtual void RunOperation(IEnumerable<ConflictItem> operationItems, bool ignoreConflicts)
        {
        }

        Item[] GetConflicts(CancellationToken cancellationToken)
        {
            var conflicts = targetProcessor.GetConflicts(items, cancellationToken);
            nonConflicts = items.Except(conflicts).ToArray();
            return conflicts;
        }

        void ExtractSubItems(Item[] items, CancellationToken cancellationToken)
        {
            try
            {
                operationItems.Clear();
                foreach (var item in items.Where(n => n.Kind == Kind.File))
                {
                    if (cancellationToken.IsCancellationRequested)
                        throw new CancelledException();
                    operationItems.Add(ConflictItem.CreateConflictFileItem(item));
                }
                var dirs = items.Where(n => n.Kind == Kind.Directory).Select(n => ConflictItem.CreateConflictDirectoryItem(n.Name, null));
                foreach (var item in dirs)
                {
                    var odi = ConflictItem.CreateConflictDirectoryItem(item.Name, null);

                    sourceProcessor.ExtractSubItems(operationItems, odi, cancellationToken);
                }
            }
            catch (CancelledException)
            {
                throw;
            }
            catch (Exception e)
            {
                var var = e;
            }
        }

        void TakeItems(Item[] items, CancellationToken cancellationToken)
        {
            operationItems.Clear();
            foreach (var item in items.Where(n => n.Kind == Kind.Directory))
            {
                if (cancellationToken.IsCancellationRequested)
                    throw new CancelledException();
                operationItems.Add(ConflictItem.CreateConflictDirectoryItem(item.Name, null));
            }
            foreach (var item in items.Where(n => n.Kind == Kind.File))
            {
                if (cancellationToken.IsCancellationRequested)
                    throw new CancelledException();
                operationItems.Add(ConflictItem.CreateConflictFileItem(item));
            }
        }

        protected OperationProcessor sourceProcessor;
        protected OperationProcessor targetProcessor;
        protected ConflictItem[] conflictItems;
        protected Item[] items;
        protected Item[] nonConflicts;
        /// <summary>
        /// Alle Items, auf die diese Operation angewendet werden soll, also alle Dateien aus einem angegebenen Verzeichnis,
        /// erst verfügbar, wenn alles entpackt wurde
        /// </summary>
        List<ConflictItem> operationItems = new List<ConflictItem>();
    }
}
