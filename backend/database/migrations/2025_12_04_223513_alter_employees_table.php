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
        Schema::table('employees', function (Blueprint $table) {
        $table->string('hire_date')->nullable()->change();
        $table->string('position')->nullable()->change();
        $table->string('salary')->nullable()->change();
        $table->string('bank_details')->nullable()->change();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->string('hire_date')->nullable(false)->change();
            $table->string('position')->nullable(false)->change();
            $table->string('salary')->nullable(false)->change();
            $table->string('bank_details')->nullable(false)->change();
        });
    }
};
