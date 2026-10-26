<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->unsignedInteger('likes_count')->default(0)->after('status');
        });

        Schema::table('certificates', function (Blueprint $table) {
            $table->unsignedInteger('likes_count')->default(0)->after('description');
        });

        Schema::table('news', function (Blueprint $table) {
            $table->unsignedInteger('likes_count')->default(0)->after('slug');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn('likes_count');
        });

        Schema::table('certificates', function (Blueprint $table) {
            $table->dropColumn('likes_count');
        });

        Schema::table('news', function (Blueprint $table) {
            $table->dropColumn('likes_count');
        });
    }
};
