<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PortfolioLike extends Model
{
    use HasFactory;

    protected $fillable = [
        'ip_address',
        'user_agent',
    ];

    /**
     * Helper to get total portfolio likes count
     */
    public static function getTotalLikes(): int
    {
        return static::count();
    }
}
