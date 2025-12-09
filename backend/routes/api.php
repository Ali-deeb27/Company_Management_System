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
    
});