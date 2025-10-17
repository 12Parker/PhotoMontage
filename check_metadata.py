#!/usr/bin/env python3
"""
Photo Metadata Checker

This script checks the metadata (EXIF data) of photos to extract
original timestamps and other information.
"""

import os
import json
from datetime import datetime
from pathlib import Path
import subprocess
import sys

class PhotoMetadataChecker:
    def __init__(self, photos_folder="pictures"):
        self.photos_folder = Path(photos_folder)
        self.metadata = {}
    
    def check_exiftool_available(self):
        """Check if ExifTool is available"""
        try:
            result = subprocess.run(['exiftool', '-ver'], 
                                  capture_output=True, text=True, timeout=5)
            return result.returncode == 0
        except (subprocess.TimeoutExpired, FileNotFoundError):
            return False
    
    def install_exiftool_mac(self):
        """Install ExifTool on Mac using Homebrew"""
        try:
            print("Installing ExifTool via Homebrew...")
            subprocess.run(['brew', 'install', 'exiftool'], check=True)
            print("✅ ExifTool installed successfully!")
            return True
        except subprocess.CalledProcessError:
            print("❌ Failed to install ExifTool. Please install manually:")
            print("   brew install exiftool")
            return False
    
    def get_metadata_with_exiftool(self, photo_path):
        """Get metadata using ExifTool"""
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
    
    def get_file_timestamp(self, photo_path):
        """Get file system timestamp as fallback"""
        stat = photo_path.stat()
        return {
            'FileModifyDate': datetime.fromtimestamp(stat.st_mtime).strftime('%Y:%m:%d %H:%M:%S'),
            'FileCreateDate': datetime.fromtimestamp(stat.st_ctime).strftime('%Y:%m:%d %H:%M:%S')
        }
    
    def extract_best_timestamp(self, metadata):
        """Extract the best available timestamp from metadata"""
        # Priority order for timestamps
        timestamp_fields = [
            'DateTimeOriginal',
            'CreateDate', 
            'ModifyDate',
            'FileModifyDate',
            'FileCreateDate'
        ]
        
        for field in timestamp_fields:
            if field in metadata and metadata[field]:
                try:
                    # Parse ExifTool timestamp format
                    timestamp_str = metadata[field]
                    if ':' in timestamp_str:
                        # Format: 2023:12:25 14:30:00
                        dt = datetime.strptime(timestamp_str, '%Y:%m:%d %H:%M:%S')
                        return dt
                except ValueError:
                    continue
        
        return None
    
    def check_all_photos(self):
        """Check metadata for all photos in the folder"""
        print(f"🔍 Checking metadata for photos in {self.photos_folder}")
        print("=" * 60)
        
        # Check if ExifTool is available
        if not self.check_exiftool_available():
            print("⚠️  ExifTool not found. Installing...")
            if not self.install_exiftool_mac():
                print("❌ Cannot proceed without ExifTool")
                return
        
        photo_files = list(self.photos_folder.glob("*.jpg")) + list(self.photos_folder.glob("*.jpeg")) + list(self.photos_folder.glob("*.JPG")) + list(self.photos_folder.glob("*.JPEG"))
        
        if not photo_files:
            print("❌ No photos found in the pictures folder")
            return
        
        print(f"📸 Found {len(photo_files)} photos")
        print()
        
        for i, photo_path in enumerate(sorted(photo_files), 1):
            print(f"[{i:2d}/{len(photo_files)}] {photo_path.name}")
            
            # Get metadata with ExifTool
            metadata = self.get_metadata_with_exiftool(photo_path)
            
            # If no metadata, try file system timestamps
            if not metadata:
                metadata = self.get_file_timestamp(photo_path)
                print("   📁 Using file system timestamp")
            
            # Extract best timestamp
            best_timestamp = self.extract_best_timestamp(metadata)
            
            if best_timestamp:
                self.metadata[photo_path.name] = {
                    'timestamp': best_timestamp.isoformat(),
                    'formatted': best_timestamp.strftime('%Y-%m-%d %H:%M:%S'),
                    'source': 'EXIF' if 'DateTimeOriginal' in metadata else 'File System'
                }
                print(f"   ✅ {best_timestamp.strftime('%Y-%m-%d %H:%M:%S')} ({self.metadata[photo_path.name]['source']})")
            else:
                print("   ❌ No timestamp found")
            
            print()
        
        # Save results
        self.save_results()
        self.show_summary()
    
    def save_results(self):
        """Save metadata results to JSON file"""
        results_file = self.photos_folder / "metadata_results.json"
        with open(results_file, 'w') as f:
            json.dump(self.metadata, f, indent=2)
        print(f"💾 Results saved to {results_file}")
    
    def show_summary(self):
        """Show summary of findings"""
        print("📊 SUMMARY")
        print("=" * 40)
        
        total_photos = len(self.metadata)
        exif_photos = sum(1 for m in self.metadata.values() if m['source'] == 'EXIF')
        filesystem_photos = total_photos - exif_photos
        
        print(f"Total photos: {total_photos}")
        print(f"With EXIF data: {exif_photos}")
        print(f"File system only: {filesystem_photos}")
        
        if self.metadata:
            # Show date range
            timestamps = [datetime.fromisoformat(m['timestamp']) for m in self.metadata.values()]
            if timestamps:
                earliest = min(timestamps)
                latest = max(timestamps)
                print(f"Date range: {earliest.strftime('%Y-%m-%d')} to {latest.strftime('%Y-%m-%d')}")
                print(f"Time span: {(latest - earliest).days} days")

def main():
    checker = PhotoMetadataChecker()
    checker.check_all_photos()

if __name__ == "__main__":
    main()
