<?php

namespace App\Policies;

use App\Models\User;

class DocumentPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }
    public function upload(User $user){
        return in_array($user->role, ['admin', 'HR_manager', 'department_manager', 'project_manager']);
    }
}