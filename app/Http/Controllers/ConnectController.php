<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\ReceiveConnect;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ConnectController extends Controller
{
    public function getUserbyPhone (Request $request) {
        $user = User::wherePhone($request->phone)->first();
        return response()->json([
            'user_name' => $user->name,
            'id' => $user->id,
        ]);
    }
    public function connect(Request $request) {
        $request->validate([
            'phone' => 'required|numeric|digits:10',
        ]);
        $user_id = $request->user_id;

        $receiver = User::wherePhone($request->phone)
            ->first();

        if($receiver == null) {
            $msg = "Phone not found.";
            return response()->json([
                'status' => 'failed',
                'msg' => $msg,
            ]);
        }
        if ($receiver->id == $user_id) {
            $msg = "Can't connect yourself. Please try another one.";
            return response()->json([
                'status' => 'failed',
                'msg' => $msg,
            ]);
        }

        $connect = (new ReceiveConnect());
        $connect->user_id = $user_id;
        $connect->status = 'pending';
        $connect->receiver_id = $receiver->id;

        $checkDupConnect = ReceiveConnect::whereUser_id($connect->user_id)
            ->whereStatus('pending')
            ->whereReceiver_id($connect->receiver_id)
            ->get();
        $checkDupConversation1 = Conversation::whereReceiver_id($receiver->id)
            ->whereRequester_id($user_id)
            ->get();
        $checkDupConversation2 = Conversation::whereReceiver_id($user_id)
            ->whereRequester_id($receiver->id)
            ->get();

        if(!$checkDupConnect->isEmpty()) {
            $msg = "You have requested connect this user. Please wait.";
            return response()->json([
                'status' => 'failed',
                'msg' => $msg,
            ]);
        }

        if(!$checkDupConversation1->isEmpty() || !$checkDupConversation2->isEmpty()) {
            $msg = "You have connected this user.";
            return response()->json([
                'status' => 'failed',
                'msg' => $msg,
            ]);
        }

        $connect->save();


        return response()->json([
            'status' => 'success',
        ]);
    }
    public function acceptConnect(Request $request) {
        $conversation = (new Conversation());
        $conversation->id = Conversation::max('id') + 1;
        $conversation->receiver_id = $request->receiver_id;
        $conversation->requester_id = $request->requester_id;
        $conversation->name = "$request->requester_name" . "-" . "$request->receiver_name";
        $conversation->save();

        ReceiveConnect::whereReceiver_id($request->receiver_id)
            ->whereUser_id($request->requester_id)->delete();

        return response()->json([
            'status' => "success",
            'conversation' => $conversation,
        ]);
    }
    public function cancelConnect(Request $request) {
        ReceiveConnect::whereReceiver_id($request->receiver_id)
            ->whereUser_id($request->requester_id)->delete();

        return response()->json([
            'status' => "success",
        ]);
    }
}
