<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Employee;
use App\Models\SalaryComponent;
use App\Models\PayrollDeduction;
use App\Models\Payroll;
use App\Models\Intern;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;// facade from barryvdh/laravel-dompdf
use App\Jobs\SendPayslipEmailJob;
use Illuminate\Support\Facades\DB;
use App\Models\AccountingEntry;

class PayrollController extends Controller
{
    public function run(Request $request)
    {
        
        $user = $request->user();
        if ($user->role !== 'accountant') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        
        $validated = $request->validate([
            'month' => 'required|date_format:Y-m', 
        ]);
        $month = $validated['month'];

        //Check if payroll already run for this month
        $existing = Payroll::where('month', $month)->exists();
        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => "Payroll already processed for $month"
            ], 409);
        }

        //Fetch active employees
        $employees = Employee::with('user')->get();
        $deductions = PayrollDeduction::all();

        $processedPayrolls = [];

        foreach ($employees as $employee) {

            //Load salary components
            $components = SalaryComponent::where('employee_id', $employee->id)->get();

            $base = $components->where('type', 'base')->sum('amount');
            $allowances = $components->where('type', 'allowance')->sum('amount');
            $bonuses = $components->where('type', 'bonus')->sum('amount');
            $componentDeductions = $components->where('type', 'deduction')->sum('amount');

            //Apply deductions (percentage-based)
            $percentageDeductions = 0;
            foreach ($deductions as $deduction) {
                if ($deduction->applies_to === 'employee' || $deduction->applies_to === 'both') {
                    $percentageDeductions += ($base + $allowances + $bonuses) * ($deduction->percentage / 100);
                }
            }

            //Calculate net pay
            $gross = $base + $allowances + $bonuses;
            $totalDeductions = $componentDeductions + $percentageDeductions;
            $netPay = $gross - $totalDeductions;

            //Store payroll record
            $payroll = Payroll::create([
                'employee_id' => $employee->id,
                'month' => $month,
                'gross' => $gross,
                'deductions' => $totalDeductions,
                'net_pay' => $netPay,
                'status' => 'pending',
            ]);

            $processedPayrolls[] = $payroll;
        }

       
        return response()->json([
            'success' => true,
            'message' => 'Payroll processed successfully',
            'data' => $processedPayrolls
        ]);
    }

    public function runInterns(Request $request)
    {
        //Authorization
        $user = $request->user();
        if ($user->role !== 'accountant') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        //Validate month
        $validated = $request->validate([
            'month' => 'required|date_format:Y-m',
        ]);

        $month = $validated['month'];

        // Prevent duplicate payroll runs
        $alreadyRun = Payroll::where('month', $month)
            ->where('status', 'intern')
            ->exists();

        if ($alreadyRun) {
            return response()->json([
                'success' => false,
                'message' => "Intern payroll already processed for $month"
            ], 409);
        }

        //Fetch active interns
        $interns = Intern::where('status', 'active')->get();

        //Fetch deductions applicable to interns
        $deductions = PayrollDeduction::whereIn('applies_to', ['intern', 'both'])->get();

        $processedPayrolls = [];

        foreach ($interns as $intern) {

            //Get stipend (salary components or fixed stipend)
            $components = SalaryComponent::where('employee_id', $intern->user_id)->get();

            //Assume stipend stored as allowance or bonus
            $stipend = $components->sum('amount');

            //If no stipend found, skip intern
            if ($stipend <= 0) {
                continue;
            }

            //Apply limited deductions
            $deductionAmount = 0;
            foreach ($deductions as $deduction) {
                $deductionAmount += $stipend * ($deduction->percentage / 100);
            }

            //Calculate net pay
            $gross = $stipend;
            $netPay = $gross - $deductionAmount;

            //Store payroll
            $payroll = Payroll::create([
                'employee_id' => $intern->user_id,
                'month' => $month,
                'gross' => $gross,
                'deductions' => $deductionAmount,
                'net_pay' => $netPay,
                'status' => 'pending',
            ]);

            $processedPayrolls[] = $payroll;
        }

        
        return response()->json([
            'success' => true,
            'message' => 'Intern payroll processed successfully',
            'data' => $processedPayrolls
        ]);
    }

     public function preview(Request $request){
        
        $user = $request->user();

        if (!in_array($user->role, ['accountant', 'admin'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        
        $validated = $request->validate([
            'month' => 'required|date_format:Y-m'
        ]);

        $month = $validated['month'];

        //Fetch ACTIVE employees (status comes from users table)
        $employees = Employee::whereHas('user', function ($query) {
                $query->where('status', 'active');
            })
            ->with('user')
            ->get();

        //Fetch active deductions
        $deductions = PayrollDeduction::where('is_active', true)->get();

        $preview = [];
        $totals = [
            'gross' => 0,
            'deductions' => 0,
            'net' => 0
        ];

        //Loop employees
        foreach ($employees as $employee) {

            //Fetch salary components
            $components = SalaryComponent::where('employee_id', $employee->id)
                ->where('is_active', true)
                ->get();

            //Calculate gross
            $gross = $components->sum('amount');

            //Skip employees without salary
            if ($gross <= 0) {
                continue;
            }

            //Calculate deductions
            $deductionAmount = 0;
            foreach ($deductions as $deduction) {
                $deductionAmount += $gross * ($deduction->percentage / 100);
            }

            //Net pay
            $netPay = $gross - $deductionAmount;

            //Collect preview data
            $preview[] = [
                'employee_id' => $employee->id,
                'employee_name' => $employee->user->name,
                'gross' => round($gross, 2),
                'deductions' => round($deductionAmount, 2),
                'net_pay' => round($netPay, 2),
                'components' => $components
            ];

            //Totals
            $totals['gross'] += $gross;
            $totals['deductions'] += $deductionAmount;
            $totals['net'] += $netPay;
        }

        //Response (NO DB WRITE)
        return response()->json([
            'success' => true,
            'month' => $month,
            'employees_count' => count($preview),
            'totals' => [
                'gross' => round($totals['gross'], 2),
                'deductions' => round($totals['deductions'], 2),
                'net' => round($totals['net'], 2)
            ],
            'data' => $preview
        ]);
    }

     public function index(Request $request)
    {
        
        $user = $request->user();
        if (!in_array($user->role, ['accountant', 'admin'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        
        $month = $request->query('month');          // YYYY-MM
        $employee_id = $request->query('employee'); 
        $status = $request->query('status');        //pending, approved, etc.

        
        $query = Payroll::query();

        
        $query->join('employees', 'payrolls.employee_id', '=', 'employees.id')
              ->join('users', 'employees.user_id', '=', 'users.id')
              ->select(
                  'payrolls.*',
                  'users.name as employee_name'
              );

        
        if ($month) {
            $query->where('payrolls.month', $month);
        }

        if ($employee_id) {
            $query->where('payrolls.employee_id', $employee_id);
        }

        if ($status) {
            $query->where('payrolls.status', $status);
        }

        // 5️⃣ Optional: order by most recent
        $query->orderBy('payrolls.month', 'desc')
              ->orderBy('payrolls.id', 'desc');

    
        $payrolls = $query->paginate(20);

        
        return response()->json([
            'success' => true,
            'data' => $payrolls
        ]);
    }

    public function show($id, Request $request)
    {
        
        $user = $request->user();
        if (!in_array($user->role, ['accountant', 'admin'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        //Fetch payroll
        $payroll = Payroll::find($id);

        if (!$payroll) {
            return response()->json([
                'success' => false,
                'message' => 'Payroll record not found'
            ], 404);
        }

        //Fetch employee + user info
        $employee = Employee::with('user')->find($payroll->employee_id);
        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found'
            ], 404);
        }

        //Fetch salary components (active only)
        $components = SalaryComponent::where('employee_id', $employee->id)
            ->where('is_active', true)
            ->get();

        //Fetch deductions (active only)
        $deductions = PayrollDeduction::where('is_active', true)->get();

        //Calculate breakdown (optional, for display)
        $gross = $components->sum('amount');

        $deductionAmount = 0;
        $deductionBreakdown = [];
        foreach ($deductions as $deduction) {
            $amount = $gross * ($deduction->percentage / 100);
            $deductionAmount += $amount;
            $deductionBreakdown[] = [
                'name' => $deduction->name,
                'percentage' => $deduction->percentage,
                'amount' => round($amount, 2)
            ];
        }

        $netPay = $gross - $deductionAmount;

        //Prepare response
        return response()->json([
            'success' => true,
            'data' => [
                'payroll_id' => $payroll->id,
                'month' => $payroll->month,
                'status' => $payroll->status,
                'gross' => round($gross, 2),
                'deductions_total' => round($deductionAmount, 2),
                'net_pay' => round($netPay, 2),
                'employee' => [
                    'id' => $employee->id,
                    'name' => $employee->user->name,
                    'position' => $employee->position,
                    'department_id' => $employee->department_id
                ],
                'salary_components' => $components,
                'deductions' => $deductionBreakdown,
                'payslip_link' => $payroll->payslip_link ?? null
            ]
        ]);
    }

    public function updateStatus($id, Request $request)
    {
        
        $user = $request->user();
        if (!in_array($user->role, ['accountant', 'admin'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        
        $validated = $request->validate([
            'status' => 'required|in:pending,paid,failed'
        ]);

        $status = $validated['status'];

        
        $payroll = Payroll::find($id);
        if (!$payroll) {
            return response()->json([
                'success' => false,
                'message' => 'Payroll record not found'
            ], 404);
        }

        
        $payroll->status = $status;
        $payroll->save();

        
        return response()->json([
            'success' => true,
            'message' => "Payroll status updated to '{$status}'",
            'data' => $payroll
        ]);
    }

    public function generatePayslip($payroll_id, Request $request){
        $payroll = Payroll::findOrFail($payroll_id);
        $user = $request->user();
        if (!in_array($user->role, ['accountant', 'admin'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        //Fetch payroll
        $payroll = Payroll::with('employee.user')->find($payroll_id);
        if (!$payroll) {
            return response()->json([
                'success' => false,
                'message' => 'Payroll record not found'
            ], 404);
        }

        //Fetch employee and salary components
        $employee = $payroll->employee;
        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found'
            ], 404);
        }

        $components = SalaryComponent::where('employee_id', $employee->id)
            ->where('is_active', true)
            ->get();

        $deductions = PayrollDeduction::where('is_active', true)->get();

        //Calculate gross, total deductions, net pay
        $gross = $components->sum('amount');

        $deductionAmount = 0;
        $deductionBreakdown = [];
        foreach ($deductions as $deduction) {
            $amount = $gross * ($deduction->percentage / 100);
            $deductionAmount += $amount;
            $deductionBreakdown[] = [
                'name' => $deduction->name,
                'percentage' => $deduction->percentage,
                'amount' => round($amount, 2)
            ];
        }

        $netPay = $gross - $deductionAmount;

        //Generate PDF
        $pdf = Pdf::loadView('payslips.pro', [
            'payroll' => $payroll,
            'components' => $components,
            'deductions' => $deductionBreakdown,
            'gross' => $gross,
            'deductions_total' => $deductionAmount,
            'net_pay' => $netPay,
        ])->setPaper('A4');

        //Save PDF in storage
        $fileName = 'payslip_' . $payroll->id . '.pdf';
        $filePath = 'payslips/' . $fileName;

        Storage::disk('public')->put($filePath, $pdf->output());

        SendPayslipEmailJob::dispatch($payroll);

        //Update payroll record with PDF link
        $payroll->update([
            'payslip_link' => '/storage/' . $filePath
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Payslip generated successfully',
            'payslip_link' => asset('storage/' . $filePath)
        ]);
    }

    public function myPayslips(Request $request)
{
    
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }

        if (!in_array($user->role, ['employee', 'intern'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        
        if ($user->role === 'employee') {
            $employee = Employee::where('user_id', $user->id)->first();

            if (!$employee) {
                return response()->json([
                    'success' => false,
                    'message' => 'Employee record not found'
                ], 404);
            }

            $payrolls = Payroll::where('employee_id', $employee->id)
                ->orderBy('month', 'desc')
                ->get();
            //Employee case
            return response()->json([
                'success' => true,
                'data' => $payrolls
            ]);
        }
        // Intern case
        return response()->json([
            'success' => true,
            'data' => []
        ]);

    }
    
    public function downloadPayslip($id, Request $request){
        $user = $request->user();

        $payroll = Payroll::with('employee.user')->findOrFail($id);

        
        if ($user->role === 'Employee' && $payroll->employee->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Path to the generated PDF
        $filePath = storage_path("app/public/payslips/payslip_{$payroll->id}.pdf");

        if (!file_exists($filePath)) {
            return response()->json(['message' => 'Payslip not found'], 404);
        }

        return response()->download($filePath, "payslip_{$payroll->month}.pdf");
    }

    public function emailPayslip($id, Request $request)
{
    $payroll = Payroll::find($id);

    if (!$payroll || !file_exists(storage_path('app/public/payslips/' . basename($payroll->payslip_link)))) {
        return response()->json(['message' => 'Payslip not found or not generated'], 404);
    }

    $user = request()->user();

    // Dispatch email job
    SendPayslipEmailJob::dispatch($payroll);

    return response()->json(['message' => 'Payslip email is queued for sending']);
}

    public function exportToAccounting($id, Request $request){
    
        $user = $request->user();
        if (!in_array($user->role, ['accountant', 'admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

    
        $payroll = Payroll::with('employee')->find($id);
        if (!$payroll) {
            return response()->json(['message' => 'Payroll not found'], 404);
        }

    //Prevent duplicate export
        if ($payroll->exported_at) {
            return response()->json([
                'message' => 'Payroll already exported'
            ], 409);
        }

        DB::beginTransaction();
        try {

        //Salary Expense (Debit)
            AccountingEntry::create([
                'payroll_id' => $payroll->id,
                'type' => 'salary_expense',
                'amount' => $payroll->gross,
                'direction' => 'debit',
                'entry_date' => now()->toDateString(),
            ]);

        //Tax / Deductions Payable (Credit)
            if ($payroll->deductions > 0) {
                AccountingEntry::create([
                    'payroll_id' => $payroll->id,
                    'type' => 'tax_payable',
                    'amount' => $payroll->deductions,
                    'direction' => 'credit',
                    'entry_date' => now()->toDateString(),
                ]);
            }

        //Net Salary Payable (Credit)
            AccountingEntry::create([
                'payroll_id' => $payroll->id,
                'type' => 'net_payable',
                'amount' => $payroll->net_pay,
                'direction' => 'credit',
                'entry_date' => now()->toDateString(),
            ]);

            //Mark payroll as exported
            $payroll->exported_at = now();
            $payroll->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Payroll exported to accounting successfully'
            ]);

        }catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Export failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}