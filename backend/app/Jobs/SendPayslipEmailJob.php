<?php

namespace App\Jobs;

use App\Mail\PayslipMail;
use App\Models\Payroll;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendPayslipEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $payroll;
    protected $adminName;

    
    public function __construct(Payroll $payroll, $adminName)
    {
        $this->payroll = $payroll;
        $this->adminName = $adminName;
    }

    /**
     * Execute the job.
     */
    public function handle()
    {
        $employeeEmail = $this->payroll->employee->user->email;

        // Send email
        Mail::to($employeeEmail)->send(new PayslipMail($this->payroll, $this->adminName));

        // Record sent timestamp
        $this->payroll->sent_at = now();
        $this->payroll->save();
    }
}

