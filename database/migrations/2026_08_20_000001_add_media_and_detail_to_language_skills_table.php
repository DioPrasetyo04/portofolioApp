<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('language_skills', function (Blueprint $table) {
            $table->json('detail')->nullable()->after('description');
            $table->json('media')->nullable()->after('photo');
            $table->json('gallery')->nullable()->after('media');
            $table->string('video')->nullable()->after('gallery');
        });
    }

    public function down(): void
    {
        Schema::table('language_skills', function (Blueprint $table) {
            $table->dropColumn(['detail', 'media', 'gallery', 'video']);
        });
    }
};
