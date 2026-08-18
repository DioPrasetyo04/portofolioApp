<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            // Priority ordering for featured projects (lower = higher priority)
            $table->unsignedTinyInteger('priority_order')->default(99)->after('is_featured');
            // Project status: completed, in_progress, archived
            $table->string('status')->default('completed')->after('priority_order');
            // Highlight bullet points (JSON array of strings)
            $table->json('highlights')->nullable()->after('status');
            // Additional gallery images (JSON array of paths)
            $table->json('gallery')->nullable()->after('highlights');
            // Project category/type label
            $table->string('category')->nullable()->after('gallery');
            // Year the project was built/completed
            $table->string('year')->nullable()->after('category');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['priority_order', 'status', 'highlights', 'gallery', 'category', 'year']);
        });
    }
};
