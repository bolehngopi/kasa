<?php

namespace Database\Seeders;

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

        // owner
        Permission::create(['name' => 'manage users']);
        Permission::create(['name' => 'manage roles']);
        Permission::create(['name' => 'manage permissions']);

        $owner = Role::create(['name' => 'owner']);
        $owner->givePermissionTo('manage users');
        $owner->givePermissionTo('manage roles');
        $owner->givePermissionTo('manage permissions');

        // staff
        Permission::create(['name' => 'manage products']);
        Permission::create(['name' => 'manage orders']);
        Permission::create(['name' => 'manage customers']);

        $staff = Role::create(['name' => 'staff']);
        $staff->givePermissionTo('manage products');
        $staff->givePermissionTo('manage orders');
        $staff->givePermissionTo('manage customers');

        // customer
        Permission::create(['name' => 'place orders']);

        $customer = Role::create(['name' => 'customer']);
        $customer->givePermissionTo('place orders');

        // super-admin
        $superAdmin = Role::create(['name' => 'super-admin']);

        $user = \App\Models\User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'superadmin@example.com',
        ]);
        $user->assignRole($superAdmin);
    }
}
