<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void{
        Schema::create('accounting_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payroll_id')->constrained()->cascadeOnDelete();
            $table->string('type'); // salary_expense, tax_payable, net_payable
            $table->decimal('amount', 10, 2);
            $table->enum('direction', ['debit', 'credit']);
            $table->date('entry_date');
            $table->timestamps();
        });
    }

    
    public function down(): void
    {
        Schema::dropIfExists('accounting_entries');
    }
};
