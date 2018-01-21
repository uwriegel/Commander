using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using Tools;

[DataContract]
public class ConflictItem
{
    static public ConflictItem CreateConflictFileItem(string name, string extension, string fullname, long sourceFileSize, DateTime sourceDateTime, string subPath)
    {
        return new ConflictItem(ImageUrl.Get(name, extension, fullname), name, subPath)
        {
            Extension = extension,
            SourceFileSize = sourceFileSize,
            SourceVersion = FileVersion.Get(fullname),
            kind = Kind.File,
            SourceDateTime = sourceDateTime
        };
    }

    static public ConflictItem CreateConflictFileItem(Item fileItem)
    {
        return new ConflictItem(fileItem.ImageUrl, fileItem.Name, null)
        {
            Extension = fileItem.Extension,
            SourceFileSize = fileItem.fileSize,
            kind = Kind.File,
            SourceDateTime = fileItem.DateTime
        };
    }

    static public ConflictItem CreateConflictDirectoryItem(string name, string subPath)
    {
        return new ConflictItem(null, name, subPath)
        {
            kind = Kind.Directory
        };
    }

    ConflictItem(string imageUrl, string name, string subPath)
    {
        this.imageUrl = imageUrl;
        Name = name;
        SubPath = subPath;
    }

#pragma warning disable 0414
    [DataMember]
    Kind kind;
    [DataMember(EmitDefaultValue = false)]
    public string imageUrl;
    [DataMember(EmitDefaultValue = false, Name = "name")]
    public string Name { get; private set; }
    [DataMember(EmitDefaultValue = false)]
    public string SubPath { get; private set; }
    public string NameWithSubPath
    {
        get { return SubPath != null ? Path.Combine(SubPath, Name) : Name; }
    }

    [DataMember(EmitDefaultValue = false, Name = "extension")]
    public string Extension { get; private set; }
    [DataMember(EmitDefaultValue = false, Name = "sourceVersion")]
    public string SourceVersion { get; set; }
    [DataMember(EmitDefaultValue = false, Name = "targetVersion")]
    public string TargetVersion { get; set; }
    [DataMember(EmitDefaultValue = false, Name = "sourceFileSize")]
    public long SourceFileSize { get; set; }
    [DataMember(EmitDefaultValue = false, Name = "targetFileSize")]
    public long TargetFileSize { get; set; }

    public DateTime SourceDateTime { get; set; }
    public DateTime TargetDateTime { get; set; }

    [DataMember(EmitDefaultValue = false)]
    string sourceDateTime;

    [DataMember(EmitDefaultValue = false)]
    string targetDateTime;

    [OnSerializing]
    public void OnSerializing(StreamingContext context)
    {
        if (SourceDateTime != default(DateTime))
            sourceDateTime = SourceDateTime.ToUniversalTime().ToString("o");
        if (TargetDateTime != default(DateTime))
            targetDateTime = TargetDateTime.ToUniversalTime().ToString("o");
    }
}


