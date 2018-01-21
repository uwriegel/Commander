using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

[DataContract]
class ProcessItem
{
    [DataMember(EmitDefaultValue = false)]
    public string file = null;
    [DataMember(EmitDefaultValue = false)]
    public bool openWith = false;
    [DataMember(EmitDefaultValue = false)]
    public bool showProperties = false;
}