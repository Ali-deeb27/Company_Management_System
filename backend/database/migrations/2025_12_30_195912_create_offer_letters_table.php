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
        Schema::create('offer_letters', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('job_application_id')->nullable();
            $table->foreign('job_application_id')->references('id')->on('job_applications')->cascadeOnDelete();
            $table->date('offer_date');
            $table->decimal('salary', 10, 2)->nullable();
            $table->enum('status', ['sent', 'accepted', 'rejected'])
                  ->default('sent');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offer_letters');
    }
};
