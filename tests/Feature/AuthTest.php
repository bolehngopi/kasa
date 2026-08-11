<?php

use App\Models\User;

it('logs a user in and redirects to the dashboard', function () {
    $user = User::factory()->create();

    $response = $this->post('/auth/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertRedirect(route('dashboard'));
    $this->assertAuthenticatedAs($user);
});

it('rejects invalid credentials', function () {
    $user = User::factory()->create();

    $response = $this->from('/auth/login')->post('/auth/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $response->assertRedirect('/auth/login');
    $response->assertSessionHasErrors('email');
    $this->assertGuest();
});

it('blocks brute force after 5 attempts', function () {
    $user = User::factory()->create();

    for ($i = 0; $i < 5; $i++) {
        $this->post('/auth/login', ['email' => $user->email, 'password' => 'wrong']);
    }

    $response = $this->post('/auth/login', ['email' => $user->email, 'password' => 'wrong']);

    $response->assertSessionHasErrors('email');
    expect($response->getSession()->get('errors')->first('email'))->toContain('Too many login attempts');
});

it('registers a new user and logs them in', function () {
    $response = $this->post('/auth/register', [
        'name' => 'Kasir Baru',
        'email' => 'kasir@example.com',
        'password' => 'Str0ng!Pass',
    ]);

    $response->assertRedirect(route('dashboard'));
    $this->assertDatabaseHas('users', ['email' => 'kasir@example.com']);
    $this->assertAuthenticated();
});
