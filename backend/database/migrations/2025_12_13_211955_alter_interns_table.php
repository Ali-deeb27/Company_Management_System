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
        Schema::table('interns', function (Blueprint $table) {
            $table->dropForeign(['department_id']);
            $table->dropForeign(['mentor_id']);

            $table->unsignedBigInteger('department_id')->nullable()->change();
            $table->unsignedBigInteger('mentor_id')->nullable()->change();

            $table->foreign('department_id')->references('id')->on('departments')->nullOnDelete();
            $table->foreign('mentor_id')->references('id')->on('employees')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('interns', function (Blueprint $table) {
            $table->dropForeign(['department_id']);
            $table->dropForeign(['mentor_id']);

            $table->unsignedBigInteger('department_id')->nullable(false)->change();
            $table->unsignedBigInteger('mentor_id')->nullable(false)->change();

            $table->foreign('department_id')->references('id')->on('departments')->cascadeOnDelete();
            $table->foreign('mentor_id')->references('id')->on('employees')->cascadeOnDelete();
        });
    }
};
