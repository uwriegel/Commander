using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Tools
{
    static class OperationRunner
    {
        public static void Operate(Action action, Action finished)
        {
            var uiThread = new Thread(() =>
            {
                var foreThread = GetWindowThreadProcessId(GetForegroundWindow(), IntPtr.Zero);
                var appThread = GetCurrentThreadId();
                if (foreThread != appThread)
                    AttachThreadInput(foreThread, appThread, true);
                action();
                finished();
            });
            uiThread.SetApartmentState(ApartmentState.STA);
            uiThread.Start();
        }

        [DllImport("kernel32.dll")]
        static extern uint GetCurrentThreadId();

        [DllImport("user32.dll")]
        static extern uint GetWindowThreadProcessId(IntPtr hWnd, IntPtr lpdwProcessId);

        [DllImport("user32.dll")]
        static extern IntPtr GetForegroundWindow();

        [DllImport("user32.dll")]
        [return: MarshalAs(UnmanagedType.Bool)]
        static extern bool AttachThreadInput(uint threadID, uint threadIdTo, bool attach);
    }
}
