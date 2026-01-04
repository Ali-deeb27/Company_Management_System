<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Department;

class AttendanceReportController extends Controller
{
    public function summary(Request $request){
        $user = Auth::user();

        if (!in_array($user->role, ['admin', 'HR_manager', 'department_manager'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        //date range of the month
        $from = $request->query('from', Carbon::now()->startOfMonth()->toDateString());
        $to   = $request->query('to', Carbon::now()->endOfMonth()->toDateString());

        $attendanceQuery = DB::table('attendance')
            ->join('users', 'attendance.user_id', '=', 'users.id')
            ->whereBetween('attendance.date', [$from, $to]);

        if ($user->role === 'department_manager') {
            $attendanceQuery->where('users.department_id', $user->department_id);
        }

        $totalWorkingDays = $attendanceQuery->count();
        $averageWorkingHours = $attendanceQuery->avg('attendance.hours_worked') ?? 0;

        $dailyTrends = DB::table('attendance')
            ->join('users', 'attendance.user_id', '=', 'users.id')
            ->select(
                'attendance.date',
                DB::raw('COUNT(attendance.id) as total_attendance'),
                DB::raw('AVG(attendance.hours_worked) as avg_hours')
            )
            ->whereBetween('attendance.date', [$from, $to])
            ->groupBy('attendance.date')
            ->orderBy('attendance.date');

        if ($user->role === 'department_manager') {
            $dailyTrends->where('users.department_id', $user->department_id);
        }

        return response()->json([
            'period' => [
                'from' => $from,
                'to' => $to,
            ],
            'summary' => [
                'total_working_days' => $totalWorkingDays,
                'average_working_hours' => round($averageWorkingHours, 2),
            ],
            'daily_trends' => $dailyTrends->get(),
        ]);
    }

    public function byEmployee(Request $request){
        $authUser = Auth::user();

        $request->validate([
            'employee_id' => 'required|exists:users,id',
            'from' => 'nullable|date',
            'to' => 'nullable|date',
        ]);

        $employeeId = (int) $request->employee_id;

    
        if (!in_array($authUser->role, ['admin', 'HR_manager', 'department_manager', 'employee'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Employee → only own data
        if ($authUser->role === 'employee' && $authUser->id !== $employeeId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

    
        if ($authUser->role === 'department_manager') {
            $sameDepartment = DB::table('users')
                ->where('id', $employeeId)
                ->where('department_id', $authUser->department_id)
                ->exists();

            if (!$sameDepartment) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

    
        $from = $request->query('from', Carbon::now()->startOfMonth()->toDateString());
        $to   = $request->query('to', Carbon::now()->endOfMonth()->toDateString());

        //Attendance records
        $attendance = DB::table('attendance')
            ->where('user_id', $employeeId)
            ->whereBetween('date', [$from, $to])
            ->orderBy('date')
            ->get();

        //Summary calculations
        $totalDays = $attendance->count();
        $totalHours = $attendance->sum('hours_worked');
        $averageHours = $totalDays > 0
            ? round($totalHours / $totalDays, 2)
            : 0;

    
        $employee = DB::table('users')
            ->select('id', 'name', 'email', 'department_id')
            ->where('id', $employeeId)
            ->first();

    
        return response()->json([
            'employee' => $employee,
            'period' => [
                'from' => $from,
                'to' => $to,
            ],
            'summary' => [
                'total_days' => $totalDays,
                'total_hours' => $totalHours,
                'average_hours_per_day' => $averageHours,
            ],
            'attendance_records' => $attendance,
        ]);
    }

    public function byDepartment(Request $request){
        $user = $request->user();

        if (!in_array($user->role, ['admin', 'HR_manager'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $departments = Department::with(['employees.attendances' => function ($query) {
            $query->whereDate('date', now());
        }])->get();

        $report = $departments->map(function ($dept) {
            $totalEmployees = $dept->employees->count();
            $present = $dept->employees->filter(fn($e) => $e->attendances->count() > 0)->count();

            return [
                'department_id' => $dept->id,
                'department_name' => $dept->name,
                'total_employees' => $totalEmployees,
                'present_today' => $present,
                'absent_today' => $totalEmployees - $present,
            ];
        });

        return response()->json(['data' => $report]);
    }
}
