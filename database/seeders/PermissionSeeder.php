<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'manage users',
            'manage roles',
            'manage permissions',
            'manage products',
            'manage orders',
            'manage customers',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission);
        }

        $owner = Role::findOrCreate('owner');
        $owner->syncPermissions([
            'manage users',
            'manage roles',
            'manage permissions',
            'manage products',
            'manage orders',
            'manage customers',
        ]);

        // staff
        $staff = Role::findOrCreate('staff');
        $staff->syncPermissions([
            'manage products',
            'manage orders',
            'manage customers',
        ]);

        // admin
        $admin = Role::findOrCreate('admin');
        $admin->syncPermissions($permissions);

        $user = User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'superadmin@example.com',
        ]);
        $user->assignRole($admin);
    }
}
