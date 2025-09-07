<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

/**
 * Modelo User - Usuários do Sistema NIOE
 * 
 * Representa os membros da equipe de inteligência operacional especial:
 * - Analistas (Industrial, Florestal, Portuário)
 * - Supervisores, Gerentes e Diretores
 * 
 * @package App\Models
 * @author NIOE Team - T35
 * @version 2.0.0
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles, LogsActivity;

    /**
     * Atributos que podem ser atribuídos em massa
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'email',
        'password',
        'full_name',
        'role',
        'branch',
        'department',
        'is_active',
        'last_login',
    ];

    /**
     * Atributos que devem ser ocultados na serialização
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Atributos que devem ser convertidos para tipos nativos
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
        'last_login' => 'datetime',
    ];

    /**
     * Configuração do log de atividades
     *
     * @return LogOptions
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['username', 'email', 'full_name', 'role', 'branch', 'is_active'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    /**
     * Relacionamento: Usuário tem muitos colaboradores
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function collaborators()
    {
        return $this->hasMany(Collaborator::class, 'created_by');
    }

    /**
     * Relacionamento: Usuário tem muitos documentos de inteligência
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function intelligenceDocuments()
    {
        return $this->hasMany(IntelligenceDocument::class, 'created_by');
    }

    /**
     * Relacionamento: Usuário tem muitas atividades
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function activities()
    {
        return $this->hasMany(Activity::class, 'created_by');
    }

    /**
     * Relacionamento: Usuário tem muitas atividades atribuídas
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function assignedActivities()
    {
        return $this->hasMany(Activity::class, 'assigned_to');
    }

    /**
     * Relacionamento: Usuário tem muitos artigos de notícias
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function newsArticles()
    {
        return $this->hasMany(NewsArticle::class, 'created_by');
    }

    /**
     * Relacionamento: Usuário tem muitos incidentes de incêndio
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function fireIncidents()
    {
        return $this->hasMany(FireIncident::class, 'created_by');
    }

    /**
     * Relacionamento: Usuário tem muitas ocorrências
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function occurrences()
    {
        return $this->hasMany(Occurrence::class, 'created_by');
    }

    /**
     * Relacionamento: Usuário tem muitos logs do sistema
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function systemLogs()
    {
        return $this->hasMany(SystemLog::class, 'user_id');
    }

    /**
     * Scope: Filtrar usuários por filial
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
     * Scope: Filtrar usuários por função
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $role
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByRole($query, $role)
    {
        return $query->where('role', $role);
    }

    /**
     * Scope: Filtrar usuários ativos
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Verificar se o usuário é analista
     *
     * @return bool
     */
    public function isAnalyst()
    {
        return $this->role === 'analyst';
    }

    /**
     * Verificar se o usuário é supervisor
     *
     * @return bool
     */
    public function isSupervisor()
    {
        return $this->role === 'supervisor';
    }

    /**
     * Verificar se o usuário é gerente
     *
     * @return bool
     */
    public function isManager()
    {
        return $this->role === 'manager';
    }

    /**
     * Verificar se o usuário é diretor
     *
     * @return bool
     */
    public function isDirector()
    {
        return $this->role === 'director';
    }

    /**
     * Verificar se o usuário pode acessar dados de uma filial
     *
     * @param string $branch
     * @return bool
     */
    public function canAccessBranch($branch)
    {
        // Diretores e gerentes podem acessar todas as filiais
        if ($this->isDirector() || $this->isManager()) {
            return true;
        }

        // Supervisores podem acessar sua filial e filiais relacionadas
        if ($this->isSupervisor()) {
            return in_array($branch, ['SP', 'MS', 'BA', 'PORTO_SP']);
        }

        // Analistas só podem acessar sua própria filial
        return $this->branch === $branch;
    }

    /**
     * Obter nome completo formatado
     *
     * @return string
     */
    public function getFormattedNameAttribute()
    {
        return "{$this->full_name} ({$this->role}) - {$this->branch}";
    }

    /**
     * Obter cor da função para interface
     *
     * @return string
     */
    public function getRoleColorAttribute()
    {
        return match($this->role) {
            'director' => 'red',
            'manager' => 'orange',
            'supervisor' => 'blue',
            'analyst' => 'green',
            default => 'gray'
        };
    }
}
