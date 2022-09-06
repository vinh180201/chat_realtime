<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();
        DB::table('users')->insert([
            ['id' => '1', 'name' => 'vinh', 'phone' => '0375021812', 'password' => Hash::make('vinh')],
            ['id' => '2', 'name' => 'admin', 'phone' => '0112223333', 'password' => Hash::make('admin')],
            ['id' => '3', 'name' => 'user3', 'phone' => '0112223334', 'password' => Hash::make('user')],
        ]);
        DB::table('receive_connects')->insert([
        ]);
        DB::table('request_connects')->insert([

        ]);
        DB::table('conversations')->insert([
            ['id' => '1', 'name' => 'vinh-admin', 'receiver_id' => '2', 'requester_id' => '1'],
            ['id' => '2', 'name' => 'vinh-user3', 'receiver_id' => '3', 'requester_id' => '1'],
        ]);
        DB::table('messages')->insert([
            ['id' => '1', 'message' => 'hi', 'user_id' => '1', 'conversation_id' => '1','created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['id' => '2', 'message' => 'hello', 'user_id' => '2', 'conversation_id' => '1','created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
        ]);
        DB::table('user_conversations')->insert([
            ['user_id' => '1', 'conversations_id' => '1'],
            ['user_id' => '2', 'conversations_id' => '1'],
        ]);
    }
}
