<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('converted_to_employee')->default(false)->after('role')
                  ->comment('Indicates if an intern has been converted to an employee');
        });
    }

    
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('converted_to_employee');
        });
    }
};
