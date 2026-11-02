<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('experiences', function (Blueprint $table) {
            $table->id();
            $table->string('type', 32)->default('work')->index(); // 'work', 'education', 'organization'
            $table->json('role'); // translatable: en, id, zh
            $table->json('company'); // translatable: en, id, zh
            $table->json('location')->nullable(); // translatable: en, id, zh
            $table->json('period'); // translatable: en, id, zh
            $table->json('badge_type')->nullable(); // translatable: en, id, zh
            $table->json('points')->nullable(); // array of bullet points
            $table->json('skills')->nullable(); // array of skill tags
            $table->string('icon', 32)->default('briefcase'); // briefcase, graduation, organization, award, book
            $table->string('accent_color', 16)->default('#EF4444');
            $table->json('media')->nullable(); // array of media items: path, url, type, size_kb, width, height, mime, thumbnail
            $table->boolean('is_active')->default(true)->index();
            $table->integer('priority_order')->default(0)->index();
            $table->timestamps();

            // Compound index for optimal querying by section & order
            $table->index(['type', 'is_active', 'priority_order'], 'idx_exp_type_active_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('experiences');
    }
};

