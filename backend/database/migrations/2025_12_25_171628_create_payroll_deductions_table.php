<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        Schema::create('payroll_deductions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('percentage', 5, 2); // e.g., 7.5%
            $table->enum('applies_to', ['employee','intern','both'])->default('employee');
            $table->timestamps();
        });
    }

    
    public function down(): void
    {
        Schema::dropIfExists('payroll_deductions');
    }
};
