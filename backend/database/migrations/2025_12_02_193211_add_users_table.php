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
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['admin','employee','intern','HR_manager','department_manager','project_manager','accountant'])->default('intern')->after('email_verified_at');
            $table->unsignedBigInteger('department_id')->nullable()->after('role');
            $table->foreign('department_id')->references('id')->on('departments')->cascadeOnDelete();
            $table->string('phone')->after('password');
            $table->string('address')->after('phone');
            $table->string('status'); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
            $table->dropColumn('department_id');
            $table->dropColumn('phone');
            $table->dropColumn('address');
            $table->dropColumn('status');

        });
    }
};
