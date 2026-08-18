<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('about_mes', function (Blueprint $table) {
            // Gallery images: JSON array of file paths for the carousel
            $table->json('gallery_images')->nullable()->after('description');
            // Chart/skill stats data: JSON object for various chart visualizations
            $table->json('skill_stats')->nullable()->after('gallery_images');
        });
    }

    public function down(): void
    {
        Schema::table('about_mes', function (Blueprint $table) {
            $table->dropColumn(['gallery_images', 'skill_stats']);
        });
    }
};
