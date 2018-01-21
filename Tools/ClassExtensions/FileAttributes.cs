using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tools
{
    static class FileAttributes
    {
        public static bool IsHidden(System.IO.FileAttributes attributes)
            => (attributes & System.IO.FileAttributes.Hidden) == System.IO.FileAttributes.Hidden;
    }
}
