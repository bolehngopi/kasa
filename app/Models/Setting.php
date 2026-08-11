<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

#[Fillable(['key', 'value'])]
class Setting extends Model
{
    public const CACHE_PREFIX = 'setting:';

    protected static function booted(): void
    {
        static::saved(function (Setting $setting): void {
            Cache::forget(self::CACHE_PREFIX.$setting->key);
        });

        static::deleted(function (Setting $setting): void {
            Cache::forget(self::CACHE_PREFIX.$setting->key);
        });
    }

    public static function getValue(string $key, ?string $default = null): ?string
    {
        return Cache::rememberForever(self::CACHE_PREFIX.$key, function () use ($key, $default) {
            $setting = static::where('key', $key)->first();

            return $setting?->value ?? $default;
        });
    }

    public static function setValue(string $key, string $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value]);
    }
}
