<?php

namespace App\Observers;

use App\Models\User;
use App\Models\Intern;
use App\Models\Employee;

class UserObserver
{
    public function created(User $user): void
    {
         $employeeRoles = ['employee','HR_manager','department_manager','project_manager','accountant'];
        if ($user->role === 'intern') {
            $this->createIntern($user);
        }

        if (in_array($user->role, $employeeRoles, true)) {
            $this->createEmployee($user);
        }
    }

    public function updated(User $user): void
    {

        $oldRole = $user->getOriginal('role');
        $newRole = $user->role;

        if ($oldRole === $newRole) {
        return;
    }

     $employeeRoles = ['employee','HR_manager','department_manager','project_manager','accountant'];

        // Changed TO intern
        if ($newRole === 'intern' && $oldRole !== 'intern') {
            $this->createIntern($user);
        }

        // Changed FROM intern
        if ($oldRole === 'intern' && $newRole !== 'intern') {
            optional($user->intern)->delete();
        }


        // Changed TO employee role
        if (in_array($newRole, $employeeRoles, true) && !in_array($oldRole, $employeeRoles, true)) {
            $this->createEmployee($user);
        }

        // Changed FROM employee role
        if (in_array($oldRole, $employeeRoles, true) && !in_array($newRole, $employeeRoles, true)) {
            optional($user->employee)->delete();
        }
    }

    private function createIntern(User $user): void
    {
        if ($user->intern) {
            return;
        }

        Intern::create([
            'user_id'        => $user->id,
            'department_id'  => $user->department_id,
            'mentor_id'      => null,
            'start_date'     => now()->toDateString(),
            'end_date'       => now()->addMonths(3)->toDateString(),
            'status'         => 'active',
        ]);
    }

    private function createEmployee(User $user): void
    {
        if ($user->employee) {
            return;
        }

        Employee::create([
            'user_id'       => $user->id,
            'hire_date'     => now(),
            'position'      => $user->role,
            'salary'        => 0,
            'bank_details'  => null,
            'experience'    => null,
        ]);
    }
}