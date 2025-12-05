<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class EmployeeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id|unique:employees,user_id',
            'position' => 'nullable|string|max:255',
            'hire_date' => 'nullable|date',
            'salary' => 'nullable|numeric|min:0',
            'experience' => 'nullable|string',
            'bank_details'=> 'nullable|string|max:255',
        ]);

        $employee = Employee::create($request->only(['user_id','position','hire_date','salary','experience','bank_details']));

        return response()->json(['message'=>'Employee created','employee'=>$employee], 201);
    }


    public function AllEmployees()
    {
        $employees = Employee::with('user')->get();
        return response()->json($employees);
    }

    public function show($id)
    {
        $employee = Employee::with('user')->findOrFail($id);
        return response()->json([
            'personal' => [
                'name' => $employee->user->name,
                'email' => $employee->user->email,
                'phone' => $employee->user->phone,
                'address' => $employee->user->address,
                'role' => $employee->user->role,
                'department_id' => $employee->user->department_id,
                'status'=> $employee->user->status,
            ],
            'professional' => [
                'position' => $employee->position,
                'experience' => $employee->experience,
                'hire_date' => optional($employee->hire_date)->toDateString(),
                'salary' => $employee->salary,
            ],
            'documents' => $employee->documents(),
        ]);
    }


     public function update(Request $request, $id)
    {
        $employee = Employee::with('user')->findOrFail($id);
        $userData = $request->only(['name','email','phone','address','role','department_id','status']);
        $employeeData = $request->only(['position','experience','hire_date','salary']);

        if ($employee->user) {
            $employee->user->update($userData);
        }

        $employee->update($employeeData);
        return response()->json(['message'=>'Employee updated','employee'=>$employee->load('user')]);
    }


    public function deleteProfile($id)
    {
        $employee = Employee::findOrFail($id);
        DB::table('documents')->where('associated_entity', 'employee,' . $employee->id)->delete();
        $employee->delete();
        return response()->json(['message'=>'Employee deleted successfully']);
    }


    public function uploadDocument(Request $request, $id){

    $employee = Employee::findOrFail($id);

    $request->validate([
        'title' => 'required|string|max:255',
        'file' => 'required|file|max:15360',
    ]);

    $path = $request->file('file')->store('', 'public');

    DB::table('documents')->insert([
        'title' => $request->title,
        'link' => $path,
        'uploaded_by' => $request->user()->id,
        'associated_entity' => 'employee:' . $employee->id,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    return response()->json(['message' => 'Document uploaded successfully']);
}

    public function deleteDocument($employeeId, $documentId)
    {
        $employee = Employee::findOrFail($employeeId);
        $document = DB::table('documents')->where('id', $documentId)->where('associated_entity', 'employee,' . $employee->id)->first();

        if (!$document) {
            return response()->json(['message'=>'Document is not found!'], 404);
        }

        Storage::disk('public')->delete($document->link);
        DB::table('documents')->where('id', $documentId)->delete();
        return response()->json(['message'=>'Document deleted successfully']);
    }

}

