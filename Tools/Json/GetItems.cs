using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

[DataContract]
class GetItems
{
    [DataMember(EmitDefaultValue = false, Name = "directory")]
    public string Directory { get; set; } = null;

    [DataMember(EmitDefaultValue = false, Name = "requestNumber")]
    public int RequestNumber { get; set; }

    [DataMember(EmitDefaultValue = false, Name = "id")]
    public string Id { get; set; } = null;
}
