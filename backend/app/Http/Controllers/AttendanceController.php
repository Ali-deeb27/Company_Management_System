<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function checkin(Request $request) {
        $user = Auth::user();

        $attendance = Attendance::firstOrCreate(
            [
                'user_id' => $user->id,
                'date' => now()->toDateString()
            ],
            [
                'check_in' => now()
            ]
        );

        return response()->json([
            'message' => 'Check-in successful',
            'attendance' => $attendance
        ]);
    }



    public function checkOut()
    {
        $user = Auth::user();
        $today = date('Y-m-d');
        $nowTime = date('H:i:s');

        $attendance = Attendance::where('user_id', $user->id)
            ->where('date', $today)
            ->first();

        if (!$attendance || !$attendance->check_in) {
            return response()->json([
                'message' => 'You must check in first'
            ], 400);
        }

        if ($attendance->check_out) {
            return response()->json([
                'message' => 'You already checked out today'
            ], 400);
        }

        $checkInTime  = strtotime($attendance->check_in);
        $checkOutTime = strtotime($nowTime);

        $workedSeconds = $checkOutTime - $checkInTime;
        $hoursWorked = round($workedSeconds / 3600, 2);

        $attendance->update([
            'check_out' => $nowTime,
            'hours_worked' => $hoursWorked
        ]);

        return response()->json([
            'message' => 'Check-out successful',
            'hours_worked' => $hoursWorked
        ]);
    }

    public function myAttendance()
    {
        return Attendance::where('user_id', Auth::id())
        ->orderBy('date', 'desc')
        ->get();
    }

     public function allAttendances()
    {
        $user = Auth::user();

        if (!$user->role === 'admin') {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        return Attendance::with('user')
            ->orderBy('date', 'desc')
            ->get();
    }
}
