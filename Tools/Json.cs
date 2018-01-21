using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading.Tasks;

namespace Tools
{
    static class Json
    {
        public static string Stringify<T>(T item)
        {
            var dcjs = new DataContractJsonSerializer(item.GetType());
            var ms = new MemoryStream();
            dcjs.WriteObject(ms, item);
            ms.Capacity = (int)ms.Length;
            return Encoding.UTF8.GetString(ms.GetBuffer());
        }

        public static string StringifyBase64<T>(T item)
        {
            var dcjs = new DataContractJsonSerializer(item.GetType());
            var ms = new MemoryStream();
            dcjs.WriteObject(ms, item);
            ms.Capacity = (int)ms.Length;
            return Convert.ToBase64String(ms.GetBuffer());
        }

        public static T ParseBase64<T>(string base64)
        {
            var dcjs = new DataContractJsonSerializer(typeof(T));
            var bytes = Convert.FromBase64String(base64);
            var ms = new MemoryStream(bytes);
            return (T)dcjs.ReadObject(ms);
        }
    }
}
