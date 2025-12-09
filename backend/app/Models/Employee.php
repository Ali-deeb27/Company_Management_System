<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\DB;

class Employee extends Model
{
    protected $fillable = [
      'user_id',
      'hire_date',
      'position',
      'salary',
      'bank_details',
      'experience'
    ];

    protected function casts(): array
    {
        return [
            'user_id'=> 'integer',
            'hire_date' => 'date',
            'salary'=>'decimal:2',
        ];
    }

    public function user():BelongsTo {
        return $this->belongsTo(User::class);
    }

    public function managesDepartment():HasOne {
        return $this->hasOne(Department::class,'manager_id');
    }

    public function mentorsInterns():HasMany {
    return $this->hasMany(Intern::class, 'mentor_id');
    }

    public function payrolls():HasMany {
        return $this->hasMany(Payroll::class);
    }

    public function skills():HasMany
    {
        return $this->hasMany(Skill::class);
    }

    public function certifications():HasMany
    {
        return $this->hasMany(Certification::class);
    }

    public function employmentHistory():HasMany
    {
        return $this->hasMany(EmploymentHistory::class);
    }

    public function promotions():HasMany
    {
        return $this->hasMany(Promotion::class);
    }

    public function documents()
    {
        return DB::table('documents')->where('associated_entity', 'employee,' . $this->id)->get(['id', 'title', 'link', 'uploaded_by']);
    }

    public function createProgress():HasMany
    {
    return $this->hasMany(InternProgress::class, 'created_by');
    }

    public function giveEvaluations()
    {
    return $this->hasMany(InternEvaluation::class, 'mentor_id');
    }

    public function issueCertificates()
{
    return $this->hasMany(InternCertificate::class, 'issued_by');
}

}
