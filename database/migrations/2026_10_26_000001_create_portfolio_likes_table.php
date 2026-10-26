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
        Schema::create('portfolio_likes', function (Blueprint $table) {
            $table->id();
            $table->string('ip_address', 45)->index();
            $table->text('user_agent')->nullable();
            $table->timestamps();

            // Unique constraint to enforce anti-spam at database level
            $table->unique('ip_address');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('portfolio_likes');
    }
};
