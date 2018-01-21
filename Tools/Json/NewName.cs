using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

[DataContract]
public class NewName
{
    [DataMember(EmitDefaultValue = false)]
    public string directory = null;
    [DataMember(EmitDefaultValue = false)]
    public string newName = null;
    [DataMember(EmitDefaultValue = false)]
    public string oldName = null;
    [DataMember(EmitDefaultValue = false)]
    public bool makeCopy = false;
    [DataMember(EmitDefaultValue = false)]
    public string[] idsToRefresh = null;
}