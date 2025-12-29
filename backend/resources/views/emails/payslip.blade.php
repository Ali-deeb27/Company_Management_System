<!DOCTYPE html>
<html>
<head>
    <title>Payslip</title>
</head>
<body>
    <p>Hello {{ $payroll->employee->user->name }},</p>

    <p>Your payslip for <strong>{{ $payroll->month }}</strong> is attached to this email.</p>

    <p>Thanks</p>
</body>
</html>
