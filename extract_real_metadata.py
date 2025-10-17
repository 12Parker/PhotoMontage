#!/usr/bin/env python3
"""
Extract Real EXIF Metadata from Photos

This script uses ExifTool to extract the actual EXIF data from photos
and creates a JSON file with the real timestamps for the timeline app.
"""

import os
import json
import subprocess
from datetime import datetime
from pathlib import Path

def extract_exif_metadata(photo_path):
    """Extract EXIF metadata using ExifTool"""
    try:
        result = subprocess.run([
            'exiftool', '-json', '-DateTimeOriginal', '-CreateDate', 
            '-ModifyDate', '-FileModifyDate', str(photo_path)
        ], capture_output=True, text=True, timeout=10)
        
        if result.returncode == 0:
            data = json.loads(result.stdout)
            if data:
                return data[0]
    except (subprocess.TimeoutExpired, json.JSONDecodeError):
        pass
    return {}

def get_best_timestamp(metadata):
    """Extract the best available timestamp from metadata"""
    # Priority order for timestamps
    timestamp_fields = [
        'DateTimeOriginal',
        'CreateDate', 
        'ModifyDate',
        'FileModifyDate'
    ]
    
    for field in timestamp_fields:
        if field in metadata and metadata[field]:
            try:
                # Parse ExifTool timestamp format
                timestamp_str = metadata[field]
                if ':' in timestamp_str:
                    # Format: 2023:12:25 14:30:00
                    dt = datetime.strptime(timestamp_str, '%Y:%m:%d %H:%M:%S')
                    return dt.isoformat()
            except ValueError:
                continue
    
    return None

def main():
    photos_folder = Path("pictures")
    metadata_results = {}
    
    print("🔍 Extracting real EXIF metadata from photos...")
    print("=" * 60)
    
    # Get all image files
    image_extensions = ['.jpg', '.jpeg', '.JPG', '.JPEG']
    photo_files = []
    for ext in image_extensions:
        photo_files.extend(photos_folder.glob(f"*{ext}"))
    
    if not photo_files:
        print("❌ No photos found in the pictures folder")
        return
    
    print(f"📸 Found {len(photo_files)} photos")
    print()
    
    for i, photo_path in enumerate(sorted(photo_files), 1):
        print(f"[{i:2d}/{len(photo_files)}] {photo_path.name}")
        
        # Extract metadata
        metadata = extract_exif_metadata(photo_path)
        timestamp = get_best_timestamp(metadata)
        
        if timestamp:
            metadata_results[photo_path.name] = {
                'timestamp': timestamp,
                'formatted': datetime.fromisoformat(timestamp).strftime('%Y-%m-%d %H:%M:%S'),
                'source': 'EXIF'
            }
            print(f"   ✅ {datetime.fromisoformat(timestamp).strftime('%Y-%m-%d %H:%M:%S')} (EXIF)")
        else:
            print("   ❌ No EXIF timestamp found")
        
        print()
    
    # Save results
    results_file = photos_folder / "real_metadata.json"
    with open(results_file, 'w') as f:
        json.dump(metadata_results, f, indent=2)
    
    print("💾 Real metadata saved to pictures/real_metadata.json")
    
    # Show summary
    print("\n📊 SUMMARY")
    print("=" * 40)
    print(f"Total photos: {len(photo_files)}")
    print(f"With EXIF data: {len(metadata_results)}")
    
    if metadata_results:
        # Show date range
        timestamps = [datetime.fromisoformat(m['timestamp']) for m in metadata_results.values()]
        if timestamps:
            earliest = min(timestamps)
            latest = max(timestamps)
            print(f"Date range: {earliest.strftime('%Y-%m-%d')} to {latest.strftime('%Y-%m-%d')}")
            print(f"Time span: {(latest - earliest).days} days")
    
    print(f"\n✅ Real metadata extraction complete!")
    print(f"📁 Results saved to: {results_file}")

if __name__ == "__main__":
    main()
