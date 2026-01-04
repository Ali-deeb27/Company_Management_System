<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;


class EmployeeReportController extends Controller
{
    public function overview(Request $request){
        
        $user = $request->user();

        if (!in_array($user->role, ['admin', 'HR_manager'])) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        
        $totalEmployees = DB::table('employees')->count();

        //active employees
        $activeEmployees = DB::table('employees')
            ->join('users', 'employees.user_id', '=', 'users.id')
            ->where('users.status', 'active')
            ->count();

        //inactive employees
        $inactiveEmployees = DB::table('employees')
            ->join('users', 'employees.user_id', '=', 'users.id')
            ->where('users.status', 'inactive')
            ->count();

        // employees hired this year
        $currentYear = Carbon::now()->year;//carbon::now()->year [to bring this current year]

        $hiredThisYear = DB::table('employees')
            ->whereYear('hire_date', $currentYear)
            ->count();

        // average salary
        $averageSalary = DB::table('employees')->avg('salary');

       
        $totalPromotions = DB::table('promotions')->count();

        
        return response()->json([
            'total_employees'    => $totalEmployees,
            'active_employees'   => $activeEmployees,
            'inactive_employees' => $inactiveEmployees,
            'hired_this_year'    => $hiredThisYear,
            'average_salary'     => round($averageSalary, 2),
            'total_promotions'   => $totalPromotions,
        ]);
    }

    public function byDepartment(Request $request){
        $user = $request->user();

    
        if (!in_array($user->role, ['admin', 'HR_manager', 'Department Manager'])) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

    
        $query = DB::table('employees')
            ->join('users', 'employees.user_id', '=', 'users.id')
            ->join('departments', 'users.department_id', '=', 'departments.id')
            ->select('departments.id', 'departments.name', DB::raw('COUNT(employees.id) as employee_count'))
            ->groupBy('departments.id', 'departments.name');

        
        // If the user is a department manager, filter to only their department    
        if ($user->role === 'department_manager') {
            $query->where('departments.id', $user->department_id);
        }

    
        $departments = $query->get();

        return response()->json([
            'data' => $departments
        ]);
    }

    public function internshipOverview(Request $request){
        $user = $request->user();

  
        if (!in_array($user->role, ['admin', 'HR_manager'])) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        // total interns
        $totalInterns = DB::table('interns')->count();

        // active interns
        $activeInterns = DB::table('interns')
            ->where('status', 'active')
            ->count();

        // completed internships
        $completedInternships = DB::table('interns')
            ->where('status', 'completed')
            ->count();

        // completion rate
        $completionRate = $totalInterns > 0
            ? round(($completedInternships / $totalInterns) * 100, 2)
            : 0;


        // converted to employees
        // Count interns whose user_id exists in employees table
        $convertedToEmployees = DB::table('users')
            ->where('converted_to_employee', true)
            ->count();

        return response()->json([
            'total_interns'           => $totalInterns,
            'active_interns'          => $activeInterns,
            'completed_internships'   => $completedInternships,
            'completion_rate'         => $completionRate, // %
            'converted_to_employee'   => $convertedToEmployees,
        ]);
    }
    
    public function internshipsByDepartment(Request $request){
        $user = $request->user();

        if (!in_array($user->role, ['admin', 'HR_manager'])) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        //Fetch internship positions grouped by department
        $internships = DB::table('internship_positions')
            ->select(
                'departments.id as department_id',
                'departments.name as department_name',
                DB::raw('COUNT(internship_positions.id) as total_internships'),
                DB::raw("SUM(CASE WHEN internship_positions.is_active = 1 THEN 1 ELSE 0 END) as active_internships"),
                DB::raw("SUM(CASE WHEN internship_positions.is_active = 0 THEN 1 ELSE 0 END) as inactive_internships")
            )
            ->join('departments', 'internship_positions.department_id', '=', 'departments.id')
            ->groupBy('departments.id', 'departments.name')
            ->get();

        return response()->json([
            'report' => $internships
        ]);
    }
    
}
