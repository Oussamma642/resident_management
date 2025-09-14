<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemoveEtageUniqueFromProprietairesTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('proprietaires', function (Blueprint $table) {
            // Preferred: drop unique by column name (works cross-DB)
            $table->dropUnique(['etage']);

            // Alternative: drop by index name (if needed)
            // $table->dropUnique('proprietaires_etage_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('proprietaires', function (Blueprint $table) {
            // Recreate the unique index (be careful: this will fail if duplicates exist)
            $table->unique('etage');
        });
    }
}
