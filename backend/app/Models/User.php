<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'address',
        'role',
        'department_id',
        'status'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [

            'email_verified_at' => 'datetime',
            'department_id'=> 'integer',
            'role' => 'string',
            'password' => 'hashed',
        ];
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function employee(): HasOne
    {
        return $this->hasOne(Employee::class);
    }

    public function intern(): HasOne
    {
        return $this->hasOne(Intern::class);
    }

    public function tasks():HasMany {
        return $this->hasMany(Task::class, 'assignee_id');
    }

     public function attendance():HasMany {
        return $this->hasMany(Attendance::class);
    }

    public function documents():HasMany {
        return $this->hasMany(Document::class, 'uploaded_by');
    }

    public function internApplications():HasMany
    {
        return $this->hasMany(InternApplication::class, 'user_id');
    }

     public function approvedInternApplications():HasMany
    {
        return $this->hasMany(InternApplication::class, 'approved_by');
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin'; 
    }

     public function logs(){
        return $this->hasMany(TaskLog::class);
    }
    public function projects(){
        return $this->belongsToMany(Project::class, 'project_user', 'user_id', 'project_id');
    }

}
