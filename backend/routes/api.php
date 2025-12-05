<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\Api\EmployeeController;


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
});