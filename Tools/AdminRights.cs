using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace Tools
{
    class AdminRights
    {
        public static bool Process(string[] args)
        {
            try
            {
                switch (args[0])
                {
                    case "-create":
                        var path = Json.ParseBase64<string>(args[1]);
                        FolderCreator.Create(path, true);
                        return true;
                    case "-startServices":
                        var services = Json.ParseBase64<string[]>(args[1]);
                        ServiceStateProcessor.StartServices(services);
                        return true;
                    case "-stopServices":
                        services = Json.ParseBase64<string[]>(args[1]);
                        ServiceStateProcessor.StopServices(services);
                        return true;
                    default:
                        return false;
                }
            }
            catch
            {
                return false;
            }
        }

        public static bool IsAdmin()
        {
            //bool value to hold our return value
            bool isAdmin;
            try
            {
                //get the currently logged in user
                WindowsIdentity user = WindowsIdentity.GetCurrent();
                WindowsPrincipal principal = new WindowsPrincipal(user);
                isAdmin = principal.IsInRole(WindowsBuiltInRole.Administrator);
            }
            catch (UnauthorizedAccessException)
            {
                isAdmin = false;
            }
            catch (Exception)
            {
                isAdmin = false;
            }
            return isAdmin;
        }
    }
}
