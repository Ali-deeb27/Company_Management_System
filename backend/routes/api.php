<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\InternshipPositionController;
use App\Http\Controllers\InternApplicationController;
use App\Http\Controllers\InternCertificateController;
use App\Http\Controllers\InternController;
use App\Http\Controllers\InternTrackingController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\MilestoneController;
use App\Http\Controllers\UserRoleController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\TaskLogController;
use App\Http\Controllers\Api\ProjectReportController;
use App\Http\Controllers\Api\DepartmentReportController;
use App\Http\Controllers\Api\ProjectReportSummaryController;
use App\Http\Controllers\Api\SalaryComponentController;
use App\Http\Controllers\Api\PayrollDeductionController;
use App\Http\Controllers\Api\PayrollController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\EvaluationController;
use App\Http\Controllers\InterviewController;
use App\Http\Controllers\JobApplicationController;
use App\Http\Controllers\JobOpeningController;
use App\Http\Controllers\OfferLetterController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\OnboardingTaskController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


    Route::post('/register', [RegisterController::class, 'register']);
    Route::post('/login',    [LoginController::class, 'login']);
    Route::middleware('auth:sanctum')->group(function () {
    
    Route::get('/employees', [EmployeeController::class, 'AllEmployees']);
    Route::post('/employees', [EmployeeController::class, 'store']);
    
    Route::get('/employee/{id}', [EmployeeController::class, 'show']);
    Route::put('/employee/{id}', [EmployeeController::class, 'update']);
    Route::delete('/employee/{id}', [EmployeeController::class, 'deleteProfile']);
    Route::post('/employee/{id}/documents', [EmployeeController::class, 'uploadDocument']);
    Route::delete('/employee/{id}/documents/{documentId}', [EmployeeController::class, 'deleteDocument']);
    
    Route::get('internship-positions', [InternshipPositionController::class, 'index']);
    Route::get('internship-positions/{id}', [InternshipPositionController::class, 'show']);
    Route::post('internship-positions', [InternshipPositionController::class, 'store']);
    Route::put('internship-positions/{id}', [InternshipPositionController::class, 'update']);
    Route::delete('internship-positions/{id}', [InternshipPositionController::class, 'destroy']);

    
    Route::get('/intern-applications', [InternApplicationController::class, 'index']);
    Route::get('/intern-applications/myApps', [InternApplicationController::class, 'myApplications']);
    Route::post('/intern-applications', [InternApplicationController::class, 'store']);
    Route::get('/intern-applications/{id}', [InternApplicationController::class, 'show']);
    Route::post('/intern-applications/{id}/approve', [InternApplicationController::class, 'approve']);
    Route::post('/intern-applications/{id}/reject', [InternApplicationController::class, 'reject']);
    Route::delete('/intern-applications/{id}', [InternApplicationController::class, 'destroy']);

    Route::post('/interns/{id}/assign-mentor', [InternController::class, 'assignMentor']);

    Route::post('/interns/{id}/progress', [InternTrackingController::class, 'addProgress']);
    Route::post('/interns/{id}/evaluation', [InternTrackingController::class, 'addEvaluation']);
    Route::get('/interns/{id}/tracking', [InternTrackingController::class, 'showTracking']);

    Route::post('/interns/{id}/certificate', [InternCertificateController::class, 'issue']);
    Route::get('/interns/{id}/certificate', [InternCertificateController::class, 'show']);
    Route::get('/interns/{id}/certificate/download', [InternCertificateController::class, 'download']);
    Route::delete('/interns/{id}/certificate', [InternCertificateController::class, 'destroy']);

    // Department Routes
    Route::get('/departments',[DepartmentController::class,'index']);
    Route::post('/departments', [DepartmentController::class, 'store']);
    Route::get('/departments/{id}', [DepartmentController::class, 'show']);
    Route::put('/departments/{id}', [DepartmentController::class, 'update']);
    Route::delete('/departments/{id}', [DepartmentController::class, 'destroy']);
    Route::post('/departments/{id}/assign-employee',[DepartmentController::class, 'assignEmployee']);
    Route::delete('/departments/{id}/remove-employee/{employee_id}',[DepartmentController::class, 'removeEmployee']);

    // Project Routes
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::get('/projects/{id}', [ProjectController::class, 'show']);
    Route::put('/projects/{id}', [ProjectController::class, 'update']);
    Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);
    Route::post('/projects/{id}/assign-employee', [ProjectController::class, 'assignEmployee']);
    Route::delete('/projects/{id}/remove-employee/{employee_id}',[ProjectController::class, 'removeEmployee']);
    Route::post('/projects/{id}/interns', [ProjectController::class, 'assignIntern']);
    Route::delete('/projects/{id}/remove-intern/{intern_id}',[ProjectController::class, 'removeIntern']);
    Route::get('/projects/{id}/milestones',[ProjectController::class, 'listMilestones']);
    Route::post('/projects/{id}/milestones',[ProjectController::class, 'storeMilestone']);
    Route::get('/projects/{id}/tasks', [ProjectController::class, 'tasks']);
    Route::post('/projects/{id}/tasks', [ProjectController::class, 'storeTask']);
    
    
    // Milestone Routes
    Route::get('/milestones/{id}',[MilestoneController::class, 'show']);
    Route::put('/milestones/{id}',[MilestoneController::class, 'update']);
    Route::delete('/milestones/{id}', [MilestoneController::class, 'destroy']);

    //Task Routes
    Route::get('/tasks/{id}', [TaskController::class, 'show']);
    Route::put('/tasks/{id}', [TaskController::class, 'update']);
    Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);
    Route::post('/tasks/{id}/logs', [TaskController::class, 'storeLog']);

    //TaskLog Routes
    Route::get('/tasks/{id}/logs', [TaskLogController::class, 'index']);
    Route::post('/task-logs', [TaskLogController::class, 'store']);
    Route::put('/logs/{id}', [TaskLogController::class, 'update']);
    Route::delete('/logs/{id}', [TaskLogController::class, 'destroy']);
    Route::get('/my-task-logs', [TaskLogController::class, 'myLogs']);
    Route::get('/task-logs/pending', [TaskLogController::class, 'pendingLogs']);
    Route::patch('/task-logs/{id}/approve', [TaskLogController::class, 'approveLogs']);
    Route::patch('/task-logs/{id}/status', [TaskLogController::class, 'updateStatus']);
    
    
    // Project Report Routes
    Route::get('/reports/projects/summary', [ProjectReportSummaryController::class, 'index']);
    Route::get('/reports/projects/{id}', [ProjectReportController::class, 'show']);
    Route::get('/reports/departments/{id}', [DepartmentReportController::class, 'show']);


    //Salary Component Routes
     Route::post('/salaries/components', [SalaryComponentController::class, 'store']);
     Route::get('/salaries/components/{employee_id}', [SalaryComponentController::class, 'indexByEmployee']);
     Route::put('/salaries/components/{id}', [SalaryComponentController::class, 'update']);
     Route::delete('/salaries/components/{id}', [SalaryComponentController::class, 'destroy']);

    //Payroll Deduction Routes
     Route::post('/deductions', [PayrollDeductionController::class, 'store']);
     Route::get('/deductions', [PayrollDeductionController::class, 'index']);
     Route::put('/deductions/{id}', [PayrollDeductionController::class, 'update']);
     Route::delete('/deductions/{id}', [PayrollDeductionController::class, 'destroy']);

     
     //Payroll Routes
     Route::post('/payroll/run', [PayrollController::class, 'run']);
     Route::post('/payroll/run-interns', [PayrollController::class, 'runInterns']);
     Route::post('/payroll/preview',[PayrollController::class, 'preview']);
     Route::get('/payroll', [PayrollController::class, 'index']);
     Route::get('/payroll/{id}',[PayrollController::class, 'show']);
     Route::put('/payroll/{id}/status',[PayrollController::class, 'updateStatus']);
     Route::post('/payroll/{id}/export', [PayrollController::class, 'exportToAccounting']);
     
     
     
     // Payslip Routes
     Route::post('/payslips/{payroll_id}/generate',[PayrollController::class, 'generatePayslip']);
     Route::get('/payslips/my', [PayrollController::class, 'myPayslips']);
     Route::get('/payslips/{id}/download', [PayrollController::class, 'downloadPayslip']);
     Route::post('/payslips/{id}/email', [PayrollController::class, 'emailPayslip']);
   

    Route::get('/users', [UserRoleController::class, 'getAllUsers']);
    Route::get('/users/{id}', [UserRoleController::class, 'getUser']);
    Route::put('/users/{id}/role', [UserRoleController::class, 'changeRole']);
    Route::delete('/users/{id}', [UserRoleController::class, 'deleteUser']);


    // Attendance Routes
    Route::post('/attendance/check-in', [AttendanceController::class, 'checkIn']);
    Route::post('/attendance/check-out', [AttendanceController::class, 'checkOut']);
    Route::get('/attendance/myAttendance', [AttendanceController::class, 'myAttendance']);
    Route::get('/attendance/allAttendances', [AttendanceController::class, 'allAttendances']);

    // Document Routes
    Route::post('/documents', [DocumentController::class, 'store']);
    Route::get('/documents', [DocumentController::class, 'index']);
    Route::get('/documents/{id}', [DocumentController::class, 'show']);
    Route::put('/documents/{id}', [DocumentController::class, 'update']);
    Route::delete('/documents/{id}', [DocumentController::class, 'destroy']);
    Route::get('/documents/{id}/download', [DocumentController::class, 'download']);
    Route::get('/documents/{id}/versions', [DocumentController::class, 'versions']);
    Route::post('/documents/{id}/versions', [DocumentController::class, 'uploadVersion']);
    Route::get('/documents/{id}/versions/{versionId}', [DocumentController::class, 'viewVersion']);
    Route::delete('/documents/{id}/versions/{versionId}', [DocumentController::class, 'deleteVersion']);
    Route::post('/documents/{id}/link', [DocumentController::class, 'linkDocument']);
    Route::get('/documents/linked/{type}/{id}', [DocumentController::class, 'getByEntity']);



    // Job Openings
    Route::get('jobs', [JobOpeningController::class, 'index']);
    Route::post('jobs', [JobOpeningController::class, 'store']); 
    Route::get('jobs/{id}', [JobOpeningController::class, 'show']);
    Route::patch('jobs/{id}/close', [JobOpeningController::class, 'close']);

    // Applications
    Route::post('jobs/{id}/apply', [JobApplicationController::class, 'apply']);
    Route::patch('applications/{id}/status', [JobApplicationController::class, 'updateStatus']);


    // Interviews
    Route::post('applications/{id}/interviews', [InterviewController::class, 'schedule']);
    Route::patch('interviews/{id}/complete', [InterviewController::class, 'complete']);

    // Evaluations
    Route::post('interviews/{id}/evaluations', [EvaluationController::class, 'store']);

    // Offer letters
    Route::post('applications/{id}/offer', [OfferLetterController::class, 'send']);
    Route::patch('offers/{id}/respond', [OfferLetterController::class, 'respond']);

    // Onboarding
    Route::post('onboarding/{userId}', [OnboardingController::class, 'create']);
    Route::get('onboarding/{userId}', [OnboardingController::class, 'show']);

    // Onboarding tasks
    Route::post('onboarding-tasks/{taskId}/submit', [OnboardingTaskController::class, 'submit']);
    Route::post('onboarding-tasks/{taskId}/approve', [OnboardingTaskController::class, 'approve']);

});