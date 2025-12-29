<?php

namespace App\Mail;

use App\Models\Payroll;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PayslipMail extends Mailable
{
    use Queueable, SerializesModels;

    public Payroll $payroll;

    public function __construct(Payroll $payroll)
    {
        $this->payroll = $payroll;
        
    }

    public function build()
    {
        return $this->subject('Your Payslip')
            ->view('emails.payslip')
            ->attach(storage_path(
                'app/public/payslips/payslip_' . $this->payroll->id . '.pdf'
            ));
    }
}
