<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Spatie\Translatable\HasTranslations;

class Experience extends Model
{
    use HasTranslations;

    /**
     * Max allowed storage per experience record in Kilobytes (50 MB)
     */
    public const MAX_RECORD_STORAGE_KB = 51200;

    /**
     * Max allowed single file size in Kilobytes (25 MB)
     */
    public const MAX_SINGLE_FILE_KB = 25600;

    protected $fillable = [
        'type',
        'role',
        'company',
        'location',
        'period',
        'badge_type',
        'points',
        'skills',
        'icon',
        'accent_color',
        'media',
        'is_active',
        'priority_order',
    ];

    public array $translatable = [
        'role',
        'company',
        'location',
        'period',
        'badge_type',
    ];

    protected $casts = [
        'points' => 'array',
        'skills' => 'array',
        'media' => 'array',
        'is_active' => 'boolean',
        'priority_order' => 'integer',
    ];

    /**
     * Get indexed and optimized media items with full URLs and metadata
     */
    public function getOptimizedMediaAttribute(): array
    {
        $rawMedia = $this->media;
        if (empty($rawMedia) || ! is_array($rawMedia)) {
            return [];
        }

        $items = [];
        foreach ($rawMedia as $item) {
            if (is_string($item)) {
                $path = $item;
                $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
                $isVideo = in_array($extension, ['mp4', 'webm', 'ogg', 'mov', 'quicktime']);

                $items[] = [
                    'path' => $path,
                    'url' => str_starts_with($path, 'http') ? $path : Storage::disk('public')->url($path),
                    'type' => $isVideo ? 'video' : 'image',
                    'extension' => $extension,
                    'size_kb' => null,
                    'thumbnail' => null,
                ];
            } elseif (is_array($item) && isset($item['path'])) {
                $path = $item['path'];
                $isVideo = ($item['type'] ?? '') === 'video' || in_array(strtolower(pathinfo($path, PATHINFO_EXTENSION)), ['mp4', 'webm', 'ogg', 'mov']);
                $url = $item['url'] ?? (str_starts_with($path, 'http') ? $path : Storage::disk('public')->url($path));

                $items[] = [
                    'path' => $path,
                    'url' => $url,
                    'type' => $isVideo ? 'video' : 'image',
                    'extension' => $item['extension'] ?? strtolower(pathinfo($path, PATHINFO_EXTENSION)),
                    'size_kb' => $item['size_kb'] ?? null,
                    'width' => $item['width'] ?? null,
                    'height' => $item['height'] ?? null,
                    'thumbnail' => $item['thumbnail'] ?? null,
                ];
            }
        }

        return $items;
    }

    /**
     * Indexes, analyzes and enforces storage limits on uploaded media.
     * Generates metadata (type, dimensions, size, mime) to prevent frontend lagging and layout shift.
     */
    public static function indexUploadedMedia(?array $filePaths): array
    {
        if (empty($filePaths)) {
            return [];
        }

        $disk = Storage::disk('public');
        $indexed = [];
        $totalStorageKb = 0;

        foreach ($filePaths as $filePath) {
            if (empty($filePath)) {
                continue;
            }

            // If already indexed array
            if (is_array($filePath) && isset($filePath['path'])) {
                $filePath = $filePath['path'];
            }

            if (! is_string($filePath)) {
                continue;
            }

            $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
            $isVideo = in_array($extension, ['mp4', 'webm', 'ogg', 'mov', 'quicktime']);
            $sizeKb = 0;
            $width = null;
            $height = null;
            $mime = null;

            if ($disk->exists($filePath)) {
                $sizeBytes = $disk->size($filePath);
                $sizeKb = round($sizeBytes / 1024, 2);
                $totalStorageKb += $sizeKb;
                $mime = $disk->mimeType($filePath);

                // For images, index dimensions to prevent layout shifts
                if (! $isVideo) {
                    $fullPath = $disk->path($filePath);
                    if (file_exists($fullPath)) {
                        $imageInfo = @getimagesize($fullPath);
                        if ($imageInfo) {
                            $width = $imageInfo[0];
                            $height = $imageInfo[1];
                        }
                    }
                }
            }

            $indexed[] = [
                'path' => $filePath,
                'url' => $disk->url($filePath),
                'type' => $isVideo ? 'video' : 'image',
                'extension' => $extension,
                'mime' => $mime,
                'size_kb' => $sizeKb,
                'width' => $width,
                'height' => $height,
            ];
        }

        return $indexed;
    }

    /**
     * Append optimized_media to array/JSON serialization
     */
    protected $appends = ['optimized_media'];
}
