<?php

namespace App\Observers;

use App\Models\User;
use App\Models\Intern;
use App\Models\Employee;

class UserObserver
{
    public function updated(User $user)
    {
        // Check if role of user was changed
        if ($user->isDirty('role')) {
            $oldRole = $user->getOriginal('role');
            $newRole = $user->role;

            // if new role is intern and doesn't exist in interns table, add it.
            if ($newRole === 'intern' && $oldRole !== 'intern') {
                if (!$user->intern) {
                    Intern::create([
                        'user_id' => $user->id,
                        'department_id' => $user->department_id,
                        'mentor_id' => null,
                        'start_date' => now()->toDateString(),
                        'end_date' => now()->addMonths(3)->toDateString(),
                        'status' => 'active',
                    ]);
                }
            }


            //if changed from intern to another role, delete from interns table
            if ($oldRole === 'intern' && $newRole !== 'intern') {
                if ($user->intern) {
                    $user->intern->delete();
                }
            }

            // when role becomes one of these, create Employee
            $employeeRoles = [
                'employee',
                'HR_manager',
                'department_manager',
                'project_manager',
                'accountant',
            ];

            if (in_array($newRole, $employeeRoles, true) && !in_array($oldRole, $employeeRoles, true)) {
                if (!$user->employee) {
                    Employee::create([
                        'user_id' => $user->id,
                        'hire_date' => now()->toDateString(),
                        'position' => $user->role,
                        'salary' => 0,
                        'bank_details' => null,
                        'experience' => null,
                    ]);
                }
            }

            //if role changed from employee to something else, remove from employees table
            if (in_array($oldRole, $employeeRoles, true) && !in_array($newRole, $employeeRoles, true)) {
                if ($user->employee) {
                    $user->employee->delete();
                }
            }
        }
    }
}
