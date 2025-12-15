<?php

namespace App\Observers;

use App\Models\User;
use App\Models\Intern;
use App\Models\Employee;

class UserObserver
{
    public function created(User $user): void
    {
        if ($user->role === 'intern') {
            $this->createIntern($user);
        }

        if ($this->isEmployeeRole($user->role)) {
            $this->createEmployee($user);
        }
    }

    public function updated(User $user): void
    {
        if (! $user->wasChanged('role')) {
            return;
        }

        $oldRole = $user->getOriginal('role');
        $newRole = $user->role;

        // Changed TO intern
        if ($newRole === 'intern' && $oldRole !== 'intern') {
            $this->createIntern($user);
        }

        // Changed FROM intern
        if ($oldRole === 'intern' && $newRole !== 'intern') {
            optional($user->intern)->delete();
        }


        // Changed TO employee role
        if ($this->isEmployeeRole($newRole) && ! $this->isEmployeeRole($oldRole)) {
            $this->createEmployee($user);
        }

        // Changed FROM employee role
        if ($this->isEmployeeRole($oldRole) && ! $this->isEmployeeRole($newRole)) {
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

    private function isEmployeeRole(string $role): bool
    {
        return in_array($role, [
            'employee',
            'HR_manager',
            'department_manager',
            'project_manager',
            'accountant',
        ], true);
    }
}