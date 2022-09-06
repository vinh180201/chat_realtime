<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use App\Models\User;

class SignupController extends Controller
{
    public function index() {
        return view('signup');
    }
    public function store(Request $request) {
        $request->validate([
            'phone' => 'required|numeric|digits:10',
            'password' => 'required',
            'password_confirmation' => 'required|same:password',
        ]);
        $user = User::where('phone', '=', $request->phone)->first();
        if (isset($user)) {
            $msg = 'This phone has been used';
            return response()->json([
                'status' => 'failed',
                'msg' => $msg,
            ]);
        }
        else {
            $idGenerate = (isset(User::find(User::max('id'))->id) ? User::find(User::max('id'))->id : 0) + 1;
            $nameGenerate = 'user' . $idGenerate;

            $storeUser = new User();
            $storeUser->id = $idGenerate;
            $storeUser->name = $nameGenerate;
            $storeUser->phone = $request->phone;
            $storeUser->password = $request->password;
            $storeUser->save();
            return response()->json([
                'status' => 'success',
            ]);
        }

    }
}
