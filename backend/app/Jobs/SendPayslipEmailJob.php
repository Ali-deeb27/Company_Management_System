<?php

namespace App\Jobs;

use App\Models\Payroll;
use App\Mail\PayslipMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendPayslipEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected Payroll $payroll;

    public function __construct(Payroll $payroll)
    {
        $this->payroll = $payroll;
        
    }

    
    public function handle()
    {
        $employee = $this->payroll->employee;

        if (!$employee || !$employee->user) {
            return;
        }

        Mail::to($employee->user->email)
            ->send(new PayslipMail($this->payroll));

        $this->payroll->sent_at = now();
        $this->payroll->save();
    }
}

