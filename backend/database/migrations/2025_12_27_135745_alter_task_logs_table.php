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
        Schema::table('task_logs', function (Blueprint $table) {
             $table->date('work_date')->after('user_id');
             $table->decimal('hours', 4, 2)->after('work_date');
             $table->enum('status', ['pending', 'approved', 'rejected'])
             ->default('pending')
             ->after('hours');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('task_logs', function (Blueprint $table) {
            $table->dropColumn(['work_date', 'hours', 'status']);
        });
    }
};
