<?php

namespace App\Observers;

use App\Models\User;
use App\Models\Intern;
use App\Models\Employee;

class UserObserver
{
    private array $employeeRoles = ['employee','HR_manager','department_manager','project_manager','accountant'];

    public function created(User $user): void
    {
        $this->updateRole($user, null, $user->role);
    }

    public function updated(User $user): void
    {
        $oldRole = $user->getOriginal('role');
        $newRole = $user->role;

        if ($oldRole === $newRole) {
            return;
        }

        $this->updateRole($user, $oldRole, $newRole);
    }

    private function updateRole(User $user, ?string $oldRole, string $newRole): void
    {
        if ($newRole === 'intern' && $oldRole !== 'intern') {
            $this->createOrUpdateIntern($user);
        } elseif ($oldRole === 'intern' && $newRole !== 'intern') {
            optional($user->intern)->delete();
        }

        if (in_array($newRole, $this->employeeRoles, true) && !in_array($oldRole, $this->employeeRoles, true)) {
            $this->createOrUpdateEmployee($user);
        } elseif (!in_array($newRole, $this->employeeRoles, true) && in_array($oldRole, $this->employeeRoles, true)) {
            optional($user->employee)->delete();
        }

        if (in_array($oldRole, $this->employeeRoles, true) && in_array($newRole, $this->employeeRoles, true)) {
            if ($employee = $user->employee) {
                $employee->update(['position' => $newRole]);
            }
        }
    }

    private function createOrUpdateIntern(User $user): void
    {
        if ($user->intern()->exists()){
            return;
        }

        Intern::create([
            'user_id'       => $user->id,
            'department_id' => $user->department_id,
            'mentor_id'     => null,
            'start_date'    => now()->toDateString(),
            'end_date'      => now()->addMonths(3)->toDateString(),
            'status'        => 'active',
        ]);
    }

    private function createOrUpdateEmployee(User $user): void
    {
        $employee = $user->employee()->first();

        if ($employee) {
            $employee->update([
                'position' => $user->role,
            ]);
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