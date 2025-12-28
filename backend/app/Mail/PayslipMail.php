<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PayslipMail extends Mailable
{
    use Queueable, SerializesModels;

    public $payroll;
    public $pdfContent;
    public $adminName;

    public function __construct($payroll, $pdfContent, $adminName = null)
    {
        $this->payroll = $payroll;
        $this->pdfContent = $pdfContent;
        $this->adminName = $adminName ?? config('mail.from.name');
    }

    public function build()
    {
        return $this->from(config('mail.from.address'), $this->adminName)
                    ->subject('Your Payslip for ' . $this->payroll->month)
                    ->view('emails.payslip') // your Blade email view
                    ->attachData(
                        $this->pdfContent,
                        'Payslip.pdf',
                        ['mime' => 'application/pdf']
                    );
    }
}
