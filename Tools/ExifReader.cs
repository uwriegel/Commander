using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tools
{
    public class ExifReader : IDisposable
    {
        #region IDisposable Members

        public void Dispose()
        {
            // Make sure the file handle is released
            if (reader != null)
                reader.Close();
            if (fileStream != null)
                fileStream.Close();
        }

        #endregion

        #region Enums

        public enum ExifTags : ushort
        {
            // IFD0 items
            ImageWidth = 0x100,
            ImageLength = 0x101,
            BitsPerSample = 0x102,
            Compression = 0x103,
            PhotometricInterpretation = 0x106,
            ImageDescription = 0x10E,
            Make = 0x10F,
            Model = 0x110,
            StripOffsets = 0x111,
            Orientation = 0x112,
            SamplesPerPixel = 0x115,
            RowsPerStrip = 0x116,
            StripByteCounts = 0x117,
            XResolution = 0x11A,
            YResolution = 0x11B,
            PlanarConfiguration = 0x11C,
            ResolutionUnit = 0x128,
            TransferFunction = 0x12D,
            Software = 0x131,
            DateTime = 0x132,
            Artist = 0x13B,
            WhitePoint = 0x13E,
            PrimaryChromaticities = 0x13F,
            JPEGInterchangeFormat = 0x201,
            JPEGInterchangeFormatLength = 0x202,
            YCbCrCoefficients = 0x211,
            YCbCrSubSampling = 0x212,
            YCbCrPositioning = 0x213,
            ReferenceBlackWhite = 0x214,
            Copyright = 0x8298,

            // SubIFD items
            ExposureTime = 0x829A,
            FNumber = 0x829D,
            ExposureProgram = 0x8822,
            SpectralSensitivity = 0x8824,
            ISOSpeedRatings = 0x8827,
            OECF = 0x8828,
            ExifVersion = 0x9000,
            DateTimeOriginal = 0x9003,
            DateTimeDigitized = 0x9004,
            ComponentsConfiguration = 0x9101,
            CompressedBitsPerPixel = 0x9102,
            ShutterSpeedValue = 0x9201,
            ApertureValue = 0x9202,
            BrightnessValue = 0x9203,
            ExposureBiasValue = 0x9204,
            MaxApertureValue = 0x9205,
            SubjectDistance = 0x9206,
            MeteringMode = 0x9207,
            LightSource = 0x9208,
            Flash = 0x9209,
            FocalLength = 0x920A,
            SubjectArea = 0x9214,
            MakerNote = 0x927C,
            UserComment = 0x9286,
            SubsecTime = 0x9290,
            SubsecTimeOriginal = 0x9291,
            SubsecTimeDigitized = 0x9292,
            FlashpixVersion = 0xA000,
            ColorSpace = 0xA001,
            PixelXDimension = 0xA002,
            PixelYDimension = 0xA003,
            RelatedSoundFile = 0xA004,
            FlashEnergy = 0xA20B,
            SpatialFrequencyResponse = 0xA20C,
            FocalPlaneXResolution = 0xA20E,
            FocalPlaneYResolution = 0xA20F,
            FocalPlaneResolutionUnit = 0xA210,
            SubjectLocation = 0xA214,
            ExposureIndex = 0xA215,
            SensingMethod = 0xA217,
            FileSource = 0xA300,
            SceneType = 0xA301,
            CFAPattern = 0xA302,
            CustomRendered = 0xA401,
            ExposureMode = 0xA402,
            WhiteBalance = 0xA403,
            DigitalZoomRatio = 0xA404,
            FocalLengthIn35mmFilm = 0xA405,
            SceneCaptureType = 0xA406,
            GainControl = 0xA407,
            Contrast = 0xA408,
            Saturation = 0xA409,
            Sharpness = 0xA40A,
            DeviceSettingDescription = 0xA40B,
            SubjectDistanceRange = 0xA40C,
            ImageUniqueID = 0xA420,

            // GPS subifd items
            GPSVersionID = 0x0,
            GPSLatitudeRef = 0x1,
            GPSLatitude = 0x2,
            GPSLongitudeRef = 0x3,
            GPSLongitude = 0x4,
            GPSAltitudeRef = 0x5,
            GPSAltitude = 0x6,
            GPSTimeStamp = 0x7,
            GPSSatellites = 0x8,
            GPSStatus = 0x9,
            GPSMeasureMode = 0xA,
            GPSDOP = 0xB,
            GPSSpeedRef = 0xC,
            GPSSpeed = 0xD,
            GPSTrackRef = 0xE,
            GPSTrack = 0xF,
            GPSImgDirectionRef = 0x10,
            GPSImgDirection = 0x11,
            GPSMapDatum = 0x12,
            GPSDestLatitudeRef = 0x13,
            GPSDestLatitude = 0x14,
            GPSDestLongitudeRef = 0x15,
            GPSDestLongitude = 0x16,
            GPSDestBearingRef = 0x17,
            GPSDestBearing = 0x18,
            GPSDestDistanceRef = 0x19,
            GPSDestDistance = 0x1A,
            GPSProcessingMethod = 0x1B,
            GPSAreaInformation = 0x1C,
            GPSDateStamp = 0x1D,
            GPSDifferential = 0x1E
        }

        #endregion

        #region Constructor

        public ExifReader(string fileName)
        {
            // JPEG encoding uses big endian (i.e. Motorola) byte aligns. The TIFF encoding
            // found later in the document will specify the byte aligns used for the
            // rest of the document.
            isLittleEndian = false;
            try
            {
                // Open the file in a stream
                fileStream = new FileStream(fileName, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
                reader = new BinaryReader(fileStream);

                if (!Initialize())
                    Dispose();
            }
            catch
            {
                Dispose();
            }
        }

        #endregion

        #region Exif data catalog and retrieval methods

        public bool GetTagValue<T>(ExifTags tag, out T result)
        {
            return GetTagValue((ushort)tag, out result);
        }

        /// <summary>
        /// Retrieves an Exif value with the requested tag ID
        /// </summary>
        /// <param name="tagID"></param>
        /// <param name="result"></param>
        /// <returns></returns>
        public bool GetTagValue<T>(ushort tagID, out T result)
        {
            var tagData = GetTagBytes(tagID, out var tiffDataType, out var numberOfComponents);

            if (tagData == null)
            {
                result = default(T);
                return false;
            }

            var fieldLength = GetTIFFFieldLength(tiffDataType);

            // Convert the data to the appropriate datatype. Note the weird boxing via object.
            // The compiler doesn't like it otherwise.
            switch (tiffDataType)
            {
                case 1:
                    // unsigned byte
                    if (numberOfComponents == 1)
                        result = (T)(object)tagData[0];
                    else
                        result = (T)(object)tagData;
                    return true;
                case 2:
                    // ascii string
                    var str = Encoding.ASCII.GetString(tagData);

                    // There may be a null character within the string
                    var nullCharIndex = str.IndexOf('\0');
                    if (nullCharIndex != -1)
                        str = str.Substring(0, nullCharIndex);

                    // Special processing for dates.
                    if (typeof(T) == typeof(DateTime))
                    {
                        result =
                            (T)(object)DateTime.ParseExact(str, "yyyy:MM:dd HH:mm:ss", CultureInfo.InvariantCulture);
                        return true;
                    }

                    result = (T)(object)str;
                    return true;
                case 3:
                    // unsigned short
                    if (numberOfComponents == 1)
                        result = (T)(object)ToUShort(tagData);
                    else
                        result = (T)(object)GetArray(tagData, fieldLength, ToUShort);
                    return true;
                case 4:
                    // unsigned long
                    if (numberOfComponents == 1)
                        result = (T)(object)ToUint(tagData);
                    else
                        result = (T)(object)GetArray(tagData, fieldLength, ToUint);
                    return true;
                case 5:
                    // unsigned rational
                    if (numberOfComponents == 1)
                        result = (T)(object)ToURational(tagData);
                    else
                        result = (T)(object)GetArray(tagData, fieldLength, ToURational);
                    return true;
                case 6:
                    // signed byte
                    if (numberOfComponents == 1)
                        result = (T)(object)ToSByte(tagData);
                    else
                        result = (T)(object)GetArray(tagData, fieldLength, ToSByte);
                    return true;
                case 7:
                    // undefined. Treat it as an unsigned integer.
                    if (numberOfComponents == 1)
                        result = (T)(object)ToUint(tagData);
                    else
                        result = (T)(object)GetArray(tagData, fieldLength, ToUint);
                    return true;
                case 8:
                    // Signed short
                    if (numberOfComponents == 1)
                        result = (T)(object)ToShort(tagData);
                    else
                        result = (T)(object)GetArray(tagData, fieldLength, ToShort);
                    return true;
                case 9:
                    // Signed long
                    if (numberOfComponents == 1)
                        result = (T)(object)ToInt(tagData);
                    else
                        result = (T)(object)GetArray(tagData, fieldLength, ToInt);
                    return true;
                case 10:
                    // signed rational
                    if (numberOfComponents == 1)
                        result = (T)(object)ToRational(tagData);
                    else
                        result = (T)(object)GetArray(tagData, fieldLength, ToRational);
                    return true;
                case 11:
                    // single float
                    if (numberOfComponents == 1)
                        result = (T)(object)ToSingle(tagData);
                    else
                        result = (T)(object)GetArray(tagData, fieldLength, ToSingle);
                    return true;
                case 12:
                    // double float
                    if (numberOfComponents == 1)
                        result = (T)(object)ToDouble(tagData);
                    else
                        result = (T)(object)GetArray(tagData, fieldLength, ToDouble);
                    return true;
                default:
                    //throw new Exception(string.Format("Unknown TIFF datatype: {0}", tiffDataType));
                    result = default(T);
                    return false;
            }
        }

        /// <summary>
        /// Gets the data in the specified tag ID, starting from before the IFD block.
        /// </summary>
        /// <param name="tiffDataType"></param>
        /// <param name="numberOfComponents">The number of items which make up the data item - i.e. for a string, this will be the
        /// number of characters in the string</param>
        /// <param name="tagID"></param>
        byte[] GetTagBytes(ushort tagID, out ushort tiffDataType, out uint numberOfComponents)
        {
            // Get the tag's offset from the catalogue and do some basic error checks
            if (fileStream == null || reader == null || catalogue == null || !catalogue.ContainsKey(tagID))
            {
                tiffDataType = 0;
                numberOfComponents = 0;
                return null;
            }

            var tagOffset = catalogue[tagID];

            // Jump to the TIFF offset
            fileStream.Position = tagOffset;

            // Read the tag number from the file
            ushort currentTagID = ReadUShort();

            if (currentTagID != tagID)
                throw new Exception("Tag number not at expected offset");

            // Read the offset to the Exif IFD
            tiffDataType = ReadUShort();
            numberOfComponents = ReadUint();
            var tagData = ReadBytes(4);

            // If the total space taken up by the field is longer than the
            // 2 bytes afforded by the tagData, tagData will contain an offset
            // to the actual data.
            var dataSize = (int)(numberOfComponents * GetTIFFFieldLength(tiffDataType));

            if (dataSize > 4)
            {
                var offsetAddress = ToUShort(tagData);
                return ReadBytes(offsetAddress, dataSize);
            }

            // The value is stored in the tagData starting from the left
            Array.Resize(ref tagData, dataSize);

            return tagData;
        }

        /// <summary>
        /// Records all Exif tags and their offsets within
        /// the file from the current IFD
        /// </summary>
        void CatalogueIFD()
        {
            if (catalogue == null)
                catalogue = new Dictionary<ushort, long>();

            // Assume we're just before the IFD.

            // First 2 bytes is the number of entries in this IFD
            var entryCount = ReadUShort();

            for (ushort currentEntry = 0; currentEntry < entryCount; currentEntry++)
            {
                var currentTagNumber = ReadUShort();

                // Record this in the catalogue
                catalogue[currentTagNumber] = fileStream.Position - 2;

                // Go to the end of this item (10 bytes, as each entry is 12 bytes long)
                reader.BaseStream.Seek(10, SeekOrigin.Current);
            }
        }

        #endregion

        #region TIFF methods

        bool Initialize()
        {
            try
            {
                // Make sure the file's a JPEG.
                if (ReadUShort() != 0xFFD8)
                    //throw new Exception("File is not a valid JPEG");
                    return false;

                // Scan to the start of the Exif content
                if (!ReadToExifStart())
                    return false;

                // Create an index of all Exif tags found within the document
                if (!CreateTagIndex())
                    return false;
                return true;
            }
            catch (Exception)
            {
                // If instantiation fails, make sure there's no mess left behind
                Dispose();
                return false;
            }
        }

        /// <summary>
        /// Returns the length (in bytes) per component of the specified TIFF data type
        /// </summary>
        /// <returns></returns>
        byte GetTIFFFieldLength(ushort tiffDataType)
        {
            switch (tiffDataType)
            {
                case 1:
                case 2:
                case 6:
                    return 1;
                case 3:
                case 8:
                    return 2;
                case 4:
                case 7:
                case 9:
                case 11:
                    return 4;
                case 5:
                case 10:
                case 12:
                    return 8;
                default:
                    throw new Exception(string.Format("Unknown TIFF datatype: {0}", tiffDataType));
            }
        }

        #endregion

        #region Methods for reading data directly from the filestream

        /// <summary>
        /// Gets a 2 byte unsigned integer from the file
        /// </summary>
        /// <returns></returns>
        ushort ReadUShort()
        {
            return ToUShort(ReadBytes(2));
        }

        /// <summary>
        /// Gets a 4 byte unsigned integer from the file
        /// </summary>
        /// <returns></returns>
        uint ReadUint()
        {
            return ToUint(ReadBytes(4));
        }

        string ReadString(int chars)
        {
            return Encoding.ASCII.GetString(ReadBytes(chars));
        }

        byte[] ReadBytes(int byteCount)
        {
            return reader.ReadBytes(byteCount);
        }

        /// <summary>
        /// Reads some bytes from the specified TIFF offset
        /// </summary>
        /// <param name="tiffOffset"></param>
        /// <param name="byteCount"></param>
        /// <returns></returns>
        byte[] ReadBytes(ushort tiffOffset, int byteCount)
        {
            // Keep the current file offset
            var originalOffset = fileStream.Position;

            // Move to the TIFF offset and retrieve the data
            fileStream.Seek(tiffOffset + tiffHeaderStart, SeekOrigin.Begin);

            var data = reader.ReadBytes(byteCount);

            // Restore the file offset
            fileStream.Position = originalOffset;

            return data;
        }

        #endregion

        #region Data conversion methods for interpreting datatypes from a byte array

        /// <summary>
        /// Converts 2 bytes to a ushort using the current byte aligns
        /// </summary>
        /// <returns></returns>
        ushort ToUShort(byte[] data)
        {
            if (isLittleEndian != BitConverter.IsLittleEndian)
                Array.Reverse(data);

            if (data.Count() == 0)
                return 0;
            return BitConverter.ToUInt16(data, 0);
        }

        /// <summary>
        /// Converts 8 bytes to an unsigned rational using the current byte aligns.
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <seealso cref="ToRational"/>
        double ToURational(byte[] data)
        {
            var numeratorData = new byte[4];
            var denominatorData = new byte[4];

            Array.Copy(data, numeratorData, 4);
            Array.Copy(data, 4, denominatorData, 0, 4);

            var numerator = ToUint(numeratorData);
            var denominator = ToUint(denominatorData);

            return numerator / (double)denominator;
        }

        /// <summary>
        /// Converts 8 bytes to a signed rational using the current byte aligns.
        /// </summary>
        /// <remarks>
        /// A TIFF rational contains 2 4-byte integers, the first of which is
        /// the numerator, and the second of which is the denominator.
        /// </remarks>
        /// <param name="data"></param>
        /// <returns></returns>
        double ToRational(byte[] data)
        {
            var numeratorData = new byte[4];
            var denominatorData = new byte[4];

            Array.Copy(data, numeratorData, 4);
            Array.Copy(data, 4, denominatorData, 0, 4);

            var numerator = ToInt(numeratorData);
            var denominator = ToInt(denominatorData);

            return numerator / (double)denominator;
        }

        /// <summary>
        /// Converts 4 bytes to a uint using the current byte aligns
        /// </summary>
        /// <returns></returns>
        uint ToUint(byte[] data)
        {
            if (isLittleEndian != BitConverter.IsLittleEndian)
                Array.Reverse(data);

            return BitConverter.ToUInt32(data, 0);
        }

        /// <summary>
        /// Converts 4 bytes to an int using the current byte aligns
        /// </summary>
        /// <returns></returns>
        int ToInt(byte[] data)
        {
            if (isLittleEndian != BitConverter.IsLittleEndian)
                Array.Reverse(data);

            return BitConverter.ToInt32(data, 0);
        }

        double ToDouble(byte[] data)
        {
            if (isLittleEndian != BitConverter.IsLittleEndian)
                Array.Reverse(data);

            return BitConverter.ToDouble(data, 0);
        }

        float ToSingle(byte[] data)
        {
            if (isLittleEndian != BitConverter.IsLittleEndian)
                Array.Reverse(data);

            return BitConverter.ToSingle(data, 0);
        }

        short ToShort(byte[] data)
        {
            if (isLittleEndian != BitConverter.IsLittleEndian)
                Array.Reverse(data);

            return BitConverter.ToInt16(data, 0);
        }

        sbyte ToSByte(byte[] data)
        {
            // An sbyte should just be a byte with an offset range.
            return (sbyte)(data[0] - byte.MaxValue);
        }

        /// <summary>
        /// Retrieves an array from a byte array using the supplied converter
        /// to read each individual element from the supplied byte array
        /// </summary>
        /// <param name="data"></param>
        /// <param name="elementLengthBytes"></param>
        /// <param name="converter"></param>
        /// <returns></returns>
        Array GetArray<T>(byte[] data, int elementLengthBytes, ConverterMethod<T> converter)
        {
            var convertedData = Array.CreateInstance(typeof(T), data.Length / elementLengthBytes);

            var buffer = new byte[elementLengthBytes];

            // Read each element from the array
            for (var elementCount = 0; elementCount < data.Length / elementLengthBytes; elementCount++)
            {
                // Place the data for the current element into the buffer
                Array.Copy(data, elementCount * elementLengthBytes, buffer, 0, elementLengthBytes);

                // Process the data and place it into the output array
                convertedData.SetValue(converter(buffer), elementCount);
            }

            return convertedData;
        }

        /// <summary>
        /// A delegate used to invoke any of the data conversion methods
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        delegate T ConverterMethod<out T>(byte[] data);

        #endregion

        #region Stream seek methods - used to get to locations within the JPEG

        /// <summary>
        /// Scans to the Exif block
        /// </summary>
        bool ReadToExifStart()
        {
            // The file has a number of blocks (Exif/JFIF), each of which
            // has a tag number followed by a length. We scan the document until the required tag (0xFFE1)
            // is found. All tags start with FF, so a non FF tag indicates an error.

            // Get the next tag.
            byte markerStart;
            byte markerNumber = 0;
            while (((markerStart = reader.ReadByte()) == 0xFF) && (markerNumber = reader.ReadByte()) != 0xE1)
            {
                // Get the length of the data.
                var dataLength = ReadUShort();

                // Jump to the end of the data (note that the size field includes its own size)!
                reader.BaseStream.Seek(dataLength - 2, SeekOrigin.Current);
            }

            // It's only success if we found the 0xFFE1 marker
            if (markerStart != 0xFF || markerNumber != 0xE1)
                //throw new Exception("Could not find Exif data block");
                return false;
            return true;
        }

        /// <summary>
        /// Reads through the Exif data and builds an index of all Exif tags in the document
        /// </summary>
        /// <returns></returns>
        bool CreateTagIndex()
        {
            // The next 4 bytes are the size of the Exif data.
            ReadUShort();

            // Next is the Exif data itself. It starts with the ASCII "Exif" followed by 2 zero bytes.
            if (ReadString(4) != "Exif")
                //throw new Exception("Exif data not found");
                return false;

            // 2 zero bytes
            if (ReadUShort() != 0)
                //throw new Exception("Malformed Exif data");
                return false;

            // We're now into the TIFF format
            tiffHeaderStart = reader.BaseStream.Position;

            // What byte align will be used for the TIFF part of the document? II for Intel, MM for Motorola
            isLittleEndian = ReadString(2) == "II";

            // Next 2 bytes are always the same.
            if (ReadUShort() != 0x002A)
                //throw new Exception("Error in TIFF data");
                return false;

            // Get the offset to the IFD (image file directory)
            uint ifdOffset = ReadUint();

            // Note that this offset is from the first byte of the TIFF header. Jump to the IFD.
            fileStream.Position = ifdOffset + tiffHeaderStart;

            // Catalogue this first IFD (there will be another IFD)
            CatalogueIFD();

            // There's more data stored in the subifd, the offset to which is found in tag 0x8769.
            // As with all TIFF offsets, it will be relative to the first byte of the TIFF header.
            if (!GetTagValue(0x8769, out uint offset))
                // throw new Exception("Unable to locate Exif data");
                return false;

            // Jump to the exif SubIFD
            fileStream.Position = offset + tiffHeaderStart;

            // Add the subIFD to the catalogue too
            CatalogueIFD();

            // Go to the GPS IFD and catalogue that too. It's an optional
            // section.
            if (GetTagValue(0x8825, out offset))
            {
                // Jump to the GPS SubIFD
                fileStream.Position = offset + tiffHeaderStart;

                // Add the subIFD to the catalogue too
                CatalogueIFD();
            }
            return true;
        }

        #endregion

        #region Fields

        readonly FileStream fileStream;
        readonly BinaryReader reader;

        /// <summary>
        /// The catalogue of tag ids and their absolute offsets within the
        /// file
        /// </summary>
        Dictionary<ushort, long> catalogue;

        /// <summary>
        /// Indicates whether to read data using big or little endian byte aligns
        /// </summary>
        bool isLittleEndian;

        /// <summary>
        /// The position in the filestream at which the TIFF header starts
        /// </summary>
        long tiffHeaderStart;

        #endregion
    }
}
