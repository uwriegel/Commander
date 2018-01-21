using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tools
{
    class CopyOperation : Operation
    {
        public CopyOperation(string sourceDir, string targetDir, Item[] items)
            : base(sourceDir, targetDir, items)
        {
        }

        protected override void RunOperation(IEnumerable<ConflictItem> operationItems, bool ignoreConflicts)
        {
            if (targetProcessor.HandleOperation(this))
            {
                targetProcessor.TargetOperationOperate(sourceProcessor.Directory, items);
                return;
            }

            FileOperation fi = new FileOperation(sourceProcessor.Directory, targetProcessor.Directory, Api.FileFuncFlags.FO_COPY);
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
            return true;
        }
    }
}
