using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Tools
{
    static class ElevatedOperation
    {
        public static bool CreateFolder(string path)
        {
            return RunElevated($"-create {Json.StringifyBase64(path)}");
        }

        public static bool StartServices(string[] items)
        {
            return RunElevated($"-startServices {Json.StringifyBase64(items)}");
        }

        public static bool StopServices(string[] items)
        {
            return RunElevated($"-stopServices {Json.StringifyBase64(items)}");
        }

        static bool RunElevated(string arg)
        {
            var exe = Assembly.GetExecutingAssembly().Location;
            var info = new ProcessStartInfo(exe)
            {
                Arguments = $"-adminMode {arg}",
                Verb = "runas",
                UseShellExecute = true,
            };

            var process = new Process
            {
                StartInfo = info
            };

            try
            {
                process.Start();
            }
            catch (Win32Exception)
            {
                // Durch den Benutzer abgebrochen
            }
            process.WaitForExit();
            return process.ExitCode == 0;
        }
    }
}
