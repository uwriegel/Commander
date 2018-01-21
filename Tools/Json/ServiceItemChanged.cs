using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Json
{
    [DataContract]

    class ServiceItemChanged
    {
        [DataMember(EmitDefaultValue = false)]
        public string method = null;

        [DataMember(EmitDefaultValue = false)]
        public Item serviceItem = null;
    }
}
