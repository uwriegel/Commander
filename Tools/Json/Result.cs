using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

[DataContract]
class Result
{
    [DataMember(EmitDefaultValue = false)]
    public string result = null;
}
