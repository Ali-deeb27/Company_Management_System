<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PayrollReportController extends Controller
{
     public function monthlySummary(Request $request){
        $user = $request->user();

        
        if (!in_array($user->role, ['admin', 'accountant'])) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        
        $request->validate([
            'month' => 'required|date_format:Y-m', 
        ]);

        $month = $request->month;

        
        $summary = DB::table('payrolls')
            ->select(
                DB::raw('SUM(gross) as total_gross'),
                DB::raw('SUM(deductions) as total_deductions'),
                DB::raw('SUM(net_pay) as total_net_pay'),
                DB::raw('SUM(CASE WHEN status="paid" THEN 1 ELSE 0 END) as paid_count'),
                DB::raw('SUM(CASE WHEN status!="paid" THEN 1 ELSE 0 END) as unpaid_count')
            )
            ->where('month', $month)
            ->first();

        return response()->json([
            'month' => $month,
            'total_gross' => $summary->total_gross,
            'total_deductions' => $summary->total_deductions,
            'total_net_pay' => $summary->total_net_pay,
            'paid_count' => $summary->paid_count,
            'unpaid_count' => $summary->unpaid_count,
        ]);
    }

     public function byDepartment(Request $request){
        $user = $request->user();

        
        if (!in_array($user->role, ['admin', 'accountant'])) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        
        $request->validate([
            'month' => 'required|date_format:Y-m', 
        ]);

        $month = $request->month;

        
        $payrolls = DB::table('payrolls')
            ->join('employees', 'payrolls.employee_id', '=', 'employees.id')
            ->join('departments', 'employees.department_id', '=', 'departments.id')
            ->select(
                'departments.id as department_id',
                'departments.name as department_name',
                DB::raw('SUM(payrolls.gross) as total_gross'),
                DB::raw('SUM(payrolls.deductions) as total_deductions'),
                DB::raw('SUM(payrolls.net_pay) as total_net_pay'),
                DB::raw('SUM(CASE WHEN payrolls.status="paid" THEN 1 ELSE 0 END) as paid_count'),
                DB::raw('SUM(CASE WHEN payrolls.status!="paid" THEN 1 ELSE 0 END) as unpaid_count')
            )
            ->where('payrolls.month', $month)
            ->groupBy('departments.id', 'departments.name')
            ->get();

        return response()->json([
            'month' => $month,
            'report' => $payrolls
        ]);
    }

    
}
