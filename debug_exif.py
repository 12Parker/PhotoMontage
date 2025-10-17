#!/usr/bin/env python3
"""
Debug EXIF Data - Check what metadata is actually available
"""

import os
from PIL import Image
from PIL.ExifTags import TAGS
from pathlib import Path

def debug_exif_data(photo_path):
    """Debug what EXIF data is actually available"""
    try:
        image = Image.open(photo_path)
        exifdata = image.getexif()
        
        print(f"\n📸 {photo_path.name}")
        print("=" * 50)
        
        if not exifdata:
            print("❌ No EXIF data at all")
            return
        
        print(f"✅ Found {len(exifdata)} EXIF fields:")
        
        # Check for timestamp fields specifically
        timestamp_fields = [
            'DateTimeOriginal', 'DateTime', 'DateTimeDigitized', 
            'CreateDate', 'ModifyDate', 'GPSInfo'
        ]
        
        found_timestamps = []
        for tagid in exifdata:
            tagname = TAGS.get(tagid, tagid)
            value = exifdata.get(tagid)
            
            if tagname in timestamp_fields:
                found_timestamps.append((tagname, value))
                print(f"  🕒 {tagname}: {value}")
        
        if not found_timestamps:
            print("  ❌ No timestamp fields found")
            print("  📋 Available fields:")
            for tagid in list(exifdata.keys())[:10]:  # Show first 10 fields
                tagname = TAGS.get(tagid, tagid)
                value = exifdata.get(tagid)
                print(f"    {tagname}: {value}")
        
    except Exception as e:
        print(f"❌ Error reading {photo_path}: {e}")

def main():
    photos_folder = Path("pictures")
    
    print("🔍 Debugging EXIF data in your photos...")
    print("=" * 60)
    
    # Check a few photos to see what's available
    test_photos = [
        '1000000680.JPG',  # One with EXIF
        '1000000681.JPG',  # One with EXIF  
        '1000000136.JPEG', # One without EXIF
        '1000000137.JPEG'  # One without EXIF
    ]
    
    for photo_name in test_photos:
        photo_path = photos_folder / photo_name
        if photo_path.exists():
            debug_exif_data(photo_path)
        else:
            print(f"❌ {photo_name} not found")

if __name__ == "__main__":
    main()
