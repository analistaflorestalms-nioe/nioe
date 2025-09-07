<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

/**
 * Modelo Collaborator - Background dos Colaboradores
 * 
 * Armazena informações detalhadas sobre colaboradores (terceirizados e orgânicos):
 * - Dados pessoais e documentos
 * - Vínculos e antecedentes
 * - Relações políticas e tendências
 * - Avaliação de risco
 * 
 * @package App\Models
 * @author NIOE Team - T35
 * @version 2.0.0
 */
class Collaborator extends Model
{
    use HasFactory, LogsActivity;

    /**
     * Atributos que podem ser atribuídos em massa
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'full_name',
        'cpf',
        'rg',
        'position',
        'branch',
        'status',
        'risk_level',
        'hire_date',
        'salary',
        'department',
        'supervisor',
        'phone',
        'email',
        'address',
        'emergency_contact',
        'notes',
        'created_by',
    ];

    /**
     * Atributos que devem ser convertidos para tipos nativos
     *
     * @var array<string, string>
     */
    protected $casts = [
        'hire_date' => 'date',
        'salary' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Configuração do log de atividades
     *
     * @return LogOptions
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['full_name', 'cpf', 'position', 'branch', 'status', 'risk_level'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    /**
     * Relacionamento: Colaborador pertence a um usuário (criador)
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Relacionamento: Colaborador tem muitos documentos de inteligência
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function intelligenceDocuments()
    {
        return $this->hasMany(IntelligenceDocument::class, 'collaborator_id');
    }

    /**
     * Relacionamento: Colaborador tem muitas ocorrências
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function occurrences()
    {
        return $this->hasMany(Occurrence::class, 'collaborator_id');
    }

    /**
     * Scope: Filtrar colaboradores por filial
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $branch
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByBranch($query, $branch)
    {
        return $query->where('branch', $branch);
    }

    /**
     * Scope: Filtrar colaboradores por status
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $status
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope: Filtrar colaboradores por nível de risco
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $riskLevel
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByRiskLevel($query, $riskLevel)
    {
        return $query->where('risk_level', $riskLevel);
    }

    /**
     * Scope: Filtrar colaboradores por departamento
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $department
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByDepartment($query, $department)
    {
        return $query->where('department', $department);
    }

    /**
     * Scope: Buscar colaboradores por nome ou CPF
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $search
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('full_name', 'like', "%{$search}%")
              ->orWhere('cpf', 'like', "%{$search}%")
              ->orWhere('email', 'like', "%{$search}%");
        });
    }

    /**
     * Verificar se o colaborador está ativo
     *
     * @return bool
     */
    public function isActive()
    {
        return $this->status === 'active';
    }

    /**
     * Verificar se o colaborador tem alto risco
     *
     * @return bool
     */
    public function isHighRisk()
    {
        return in_array($this->risk_level, ['high', 'critical']);
    }

    /**
     * Obter cor do nível de risco para interface
     *
     * @return string
     */
    public function getRiskColorAttribute()
    {
        return match($this->risk_level) {
            'low' => 'green',
            'medium' => 'yellow',
            'high' => 'orange',
            'critical' => 'red',
            default => 'gray'
        };
    }

    /**
     * Obter cor do status para interface
     *
     * @return string
     */
    public function getStatusColorAttribute()
    {
        return match($this->status) {
            'active' => 'green',
            'inactive' => 'red',
            'suspended' => 'orange',
            'terminated' => 'gray',
            default => 'gray'
        };
    }

    /**
     * Obter CPF formatado
     *
     * @return string
     */
    public function getFormattedCpfAttribute()
    {
        return preg_replace('/(\d{3})(\d{3})(\d{3})(\d{2})/', '$1.$2.$3-$4', $this->cpf);
    }

    /**
     * Obter telefone formatado
     *
     * @return string
     */
    public function getFormattedPhoneAttribute()
    {
        if (strlen($this->phone) === 11) {
            return preg_replace('/(\d{2})(\d{5})(\d{4})/', '($1) $2-$3', $this->phone);
        }
        return $this->phone;
    }

    /**
     * Obter salário formatado
     *
     * @return string
     */
    public function getFormattedSalaryAttribute()
    {
        return 'R$ ' . number_format($this->salary, 2, ',', '.');
    }

    /**
     * Obter tempo de empresa em anos
     *
     * @return int
     */
    public function getYearsOfServiceAttribute()
    {
        if (!$this->hire_date) {
            return 0;
        }

        return $this->hire_date->diffInYears(now());
    }

    /**
     * Obter resumo do colaborador
     *
     * @return string
     */
    public function getSummaryAttribute()
    {
        return "{$this->full_name} - {$this->position} ({$this->branch}) - Risco: {$this->risk_level}";
    }
}
