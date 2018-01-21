using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tools
{
    class DeleteOperation : Operation
    {
        public DeleteOperation(string sourceDir, Item[] items)
            : base(sourceDir, null, items)
        {
        }

        protected override void RunOperation(IEnumerable<ConflictItem> operationItems, bool ignoreConflicts)
        {
            sourceProcessor.Delete(items);
        }

        protected override bool IsDualOperation()
        {
            return false;
        }

        public override string CheckException()
        {
            return base.CheckException();
        }
    }
}
