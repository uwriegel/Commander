using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using Tools;

[DataContract]
public class CheckFileOperation
{
    [DataMember(EmitDefaultValue = false)]
    public string operation;
    [DataMember(EmitDefaultValue = false)]
    public string sourceDir;
    [DataMember(EmitDefaultValue = false)]
    public string targetDir;
    [DataMember(EmitDefaultValue = false)]
    public Item[] items;
}

[DataContract]
class CheckFileOperationResult
{
    [DataMember(Name = "conflictItems")]
    public ConflictItem[] ConflictItems { get; set; } = new ConflictItem[0];
    [DataMember(Name = "result")]
    public OperationCheckResult Result { get; set; }
    [DataMember(EmitDefaultValue = false, Name = "exception")]
    public string Exception { get; set; }
}
