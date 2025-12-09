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
        Schema::create('intern_evaluations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('intern_id');
            $table->foreign('intern_id')->references('id')->on('interns')->cascadeOnDelete();
            $table->unsignedBigInteger('mentor_id');
            $table->foreign('mentor_id')->references('id')->on('employees')->cascadeOnDelete();
            $table->integer('rating');
            $table->text('comments')->nullable();
            $table->date('evaluation_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('intern_evaluations');
    }
};
