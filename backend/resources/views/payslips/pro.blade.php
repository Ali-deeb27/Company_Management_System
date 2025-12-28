<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: DejaVu Sans; font-size: 12px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #2c3e50; padding-bottom: 10px; margin-bottom: 20px; }
        .company-name { font-size: 20px; font-weight: bold; color: #2c3e50; }
        .section { margin-bottom: 15px; }
        .section-title { background: #f2f2f2; padding: 6px; font-weight: bold; border-left: 4px solid #2c3e50; margin-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ccc; padding: 6px; text-align: left; }
        th { background: #eee; }
        .net-pay { font-size: 16px; font-weight: bold; color: #27ae60; text-align: right; }
        .footer { text-align: center; font-size: 10px; color: #777; margin-top: 30px; }
    </style>
</head>
<body>

    <!-- HEADER -->
    <div class="header">
        <div class="company-name">Company Management System</div>
        <div>Payslip for {{ $payroll->month }}</div>
    </div>

    <!-- EMPLOYEE INFO -->
    <div class="section">
        <div class="section-title">Employee Information</div>
        <table>
            <tr>
                <th>Name</th>
                <td>{{ $payroll->employee->user->name }}</td>
                <th>Employee ID</th>
                <td>{{ $payroll->employee->id }}</td>
            </tr>
            <tr>
                <th>Position</th>
                <td>{{ $payroll->employee->position ?? 'N/A' }}</td>
                <th>Department</th>
                <td>{{ $payroll->employee->user->department_id ?? 'N/A' }}</td>
            </tr>
        </table>
    </div>

    <!-- EARNINGS -->
    <div class="section">
        <div class="section-title">Earnings</div>
        <table>
            <tr>
                <th>Component</th>
                <th>Amount</th>
            </tr>
            @foreach($components as $component)
            <tr>
                <td>{{ $component->name }}</td>
                <td>{{ number_format($component->amount, 2) }}</td>
            </tr>
            @endforeach
            <tr>
                <th>Total Gross</th>
                <th>{{ number_format($gross, 2) }}</th>
            </tr>
        </table>
    </div>

    <!-- DEDUCTIONS -->
    <div class="section">
        <div class="section-title">Deductions</div>
        <table>
            <tr>
                <th>Deduction</th>
                <th>Amount</th>
            </tr>
            @foreach($deductions as $deduction)
            <tr>
                <td>{{ $deduction['name'] }} ({{ $deduction['percentage'] }}%)</td>
                <td>{{ number_format($deduction['amount'], 2) }}</td>
            </tr>
            @endforeach
            <tr>
                <th>Total Deductions</th>
                <th>{{ number_format($deductions_total, 2) }}</th>
            </tr>
        </table>
    </div>

    <!-- NET PAY -->
    <div class="section">
        <table>
            <tr>
                <th>Net Pay</th>
                <td class="net-pay">{{ number_format($net_pay, 2) }}</td>
            </tr>
        </table>
    </div>

    <!-- FOOTER -->
    <div class="footer">
        This is a system-generated payslip and does not require a signature.
    </div>

</body>
</html>

