<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(){
        Schema::table('payroll_deductions', function (Blueprint $table) {
            $table->boolean('is_active')->default(true)->after('percentage');
        });
    }

    public function down(){
        Schema::table('payroll_deductions', function (Blueprint $table) {
            $table->dropColumn('is_active');
        });
    }
};
