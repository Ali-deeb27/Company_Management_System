<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        
           DB::table('task_logs')
            ->whereNull('work_date')
            ->update(['work_date' => now()]);
            
    }
    

    
    public function down(): void
    {
        
           DB::table('task_logs')
            ->update(['work_date' => null]);
        
    }
};

