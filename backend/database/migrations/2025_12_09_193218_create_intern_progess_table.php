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
        Schema::create('intern_progess', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('intern_id');
            $table->foreign('intern_id')->references('id')->on('interns')->cascadeOnDelete();
            $table->unsignedBigInteger('created_by');
            $table->foreign('created_by')->references('id')->on('employees')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('progress_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('intern_progess');
    }
};
