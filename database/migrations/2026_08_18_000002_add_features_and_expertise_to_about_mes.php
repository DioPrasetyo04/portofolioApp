<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('about_mes', function (Blueprint $table) {
            // Dynamic feature checklist items (name + lucide icon name)
            $table->json('features')->nullable()->after('skill_stats');
            // Expertise tab areas (id, label, icon, items array)
            $table->json('expertise_tabs')->nullable()->after('features');
        });
    }

    public function down(): void
    {
        Schema::table('about_mes', function (Blueprint $table) {
            $table->dropColumn(['features', 'expertise_tabs']);
        });
    }
};
