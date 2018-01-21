using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tools
{
    static class FileVersion
    {
        public static string Get(string path)
        {
            var fvi = FileVersionInfo.GetVersionInfo(path);
            if (fvi != null && !(fvi.FileMajorPart == 0 && fvi.FileMinorPart == 0 && fvi.FileBuildPart == 0 && fvi.FilePrivatePart == 0))
                return string.Format("{0}.{1}.{2}.{3}", fvi.FileMajorPart, fvi.FileMinorPart, fvi.FileBuildPart, fvi.FilePrivatePart);
            return null;
        }
    }
}
