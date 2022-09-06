<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    public function getLogin () {
        return response()->json([
            'name' => 'Abigail',
            'state' => 'CA',
        ]);
    }
    public function postLogin (Request $request) {
        $request->validate([
            'phone' => 'required|numeric|digits:10',
            'password' => 'required'
        ]);

        $user = DB::table('users')->where('phone', '=' , $request->phone)
            ->first();
        if (isset($user)) {
            if (Auth::attempt(['phone' => $request->phone, 'password' => $request->password], $request->remember)) {
                return response()->json([
                    'status' => 'success',
                    'user' => $user,
                ]);
            }
            else {
                $msg = 'Wrong password';
                return response()->json([
                    'status' => 'failed',
                    'msg' => $msg,
                ]);
            }
        }
        else {
            $msg = 'Wrong phone number';
            return response()->json([
                'status' => 'failed',
                'msg' => $msg,
            ]);
        }

    }

}
