using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tools
{
    class MoveOperation : Operation
    {
        public MoveOperation(string sourceDir, string targetDir, Item[] items)
            : base(sourceDir, targetDir, items)
        {
        }

        protected override void RunOperation(IEnumerable<ConflictItem> operationItems, bool ignoreConflicts)
        {
            FileOperation fi = new FileOperation(sourceProcessor.Directory, targetProcessor.Directory, Api.FileFuncFlags.FO_MOVE);
            if (conflictItems == null || ignoreConflicts)
                fi.Copy(items);
            else if (conflictItems != null && conflictItems.Length > 0 && !ignoreConflicts)
                fi.Copy(nonConflicts, operationItems, conflictItems);
        }

        protected override bool IsDualOperation()
        {
            return true;
        }

        protected override bool CheckExtendedCompatibility()
        {
            if (targetProcessor is DriveProcessor)
                return false;
            //else if (targetProcessor is FavoritesProcessor)
            //    return false;
            return true;
        }
    }

}
