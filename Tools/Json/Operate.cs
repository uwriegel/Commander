using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

[DataContract]
public class Operate
{
    [DataMember(EmitDefaultValue = false)]
    public string[] idsToRefresh;
    [DataMember(EmitDefaultValue = false)]
    public bool ignoreConflicts;
}

