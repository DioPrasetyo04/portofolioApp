<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('certificates', function (Blueprint $table) {
            $table->json('detail')->nullable()->after('description');
            $table->string('issuer_icon')->nullable()->after('issuer');
            $table->string('credential_id')->nullable()->after('url');
            $table->json('gallery')->nullable()->after('image');
        });
    }

    public function down(): void
    {
        Schema::table('certificates', function (Blueprint $table) {
            $table->dropColumn(['detail', 'issuer_icon', 'credential_id', 'gallery']);
        });
    }
};
