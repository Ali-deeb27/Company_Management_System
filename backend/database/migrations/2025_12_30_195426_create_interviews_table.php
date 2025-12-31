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
        Schema::create('interviews', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('job_application_id')->nullable();
            $table->foreign('job_application_id')->references('id')->on('job_applications')->cascadeOnDelete();
            $table->dateTime('scheduled_at');
            $table->string('location')->nullable(); 
            $table->unsignedBigInteger('interviewer_id')->nullable();
            $table->foreign('interviewer_id')->references('id')->on('employees')->cascadeOnDelete();
            $table->enum('status', ['scheduled', 'completed', 'cancelled'])
            ->default('scheduled');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('interviews');
    }
};
