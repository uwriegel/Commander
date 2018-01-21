using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tools
{
    enum OperationCheckResult
    {
        OK,
        Cancelled,
        IdenticalDirectories,
        NoSelection,
        SubordinateDirectory,
        ServiceNotSupported,
        Incompatible,
        AlreadyExists,
        Unauthorized,
        CopyToFavorites,
        DeleteFavorites,
        DeleteSavedViews
    }
}
