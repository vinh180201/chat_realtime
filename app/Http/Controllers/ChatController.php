<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\ReceiveConnect;
use App\Models\RequestConnect;
use App\Models\UserConversation;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use phpDocumentor\Reflection\Utils;

class ChatController extends Controller
{
    public function showConversation ($active, Request $request) {
        $user_id = $request->user_id;
        if ($user_id) {
            $connects = ReceiveConnect::whereReceiver_id($user_id)
                ->whereStatus('pending')
                ->with('user')
                ->with('receiver')
                ->get();
            $conversations = Conversation::whereRequester_id($user_id)
                ->orWhere('receiver_id', $user_id)
                ->with('message')
                ->get();
            if(!$conversations->isEmpty()) {
                $opposite_id = ($conversations[$active]->requester_id == $user_id) ? $conversations[$active]->receiver_id : $conversations[$active]->requester_id;
                $opposite = User::whereId($opposite_id)->first();
                return response()->json([
                    'conversations' => $conversations,
                    'opposite' => $opposite,
                    'connects' => $connects,
                    'active' => $active
                ]);
            }
            else {
                return response()->json([
                    'connects' => $connects,
                    'active' => $active
                ]);            }

        }
        else {
            return response()->json([
                'redirect' => 'login',
            ]);
        }
    }
    public function index () {
        $user = Auth::user();
        $active = 0;
        if ($user) {
            $connects = ReceiveConnect::whereReceiver_id($user->id)
                ->whereStatus('pending')
                ->get();
            $conversations = Conversation::whereRequester_id($user->id)
                ->orWhere('receiver_id', $user->id)
                ->with('message')
                ->get();
            if(!$conversations->isEmpty()) {
                $opposite_id = ($conversations->first()->requester_id == Auth::user()->id) ? $conversations[0]->receiver_id : $conversations[0]->requester_id;
                $opposite = User::whereId($opposite_id)->first();
                return response()->json([
                    'user' => $user,
                    'conversations' => $conversations,
                    'opposite' => $opposite,
                    'connects' => $connects,
                    'active' => $active
                ]);
            }
            else {
                return response()->json([
                    'user' => $user,
                    'connects' => $connects,
                    'active' => $active
                ]);
            }

        }
        else {
            return response()->json([
                'redirect' => 'login',
            ]);
        }
    }
    public function newConnect() {
        $user = Auth::user();
        if ($user) {
            return view('connect');
        }
        else {
            return redirect('login');
        }
    }
    public function changeName(Request $request) {
        $user_id = $request->user_id;
        $user = User::find($user_id);
        $user->name = $request->name;
        $user->save();

        $conversations = Conversation::whereReceiver_id($user_id)
            ->orWhere('requester_id', $user->id)
            ->get();
        foreach ($conversations as $conversation) {
            $conversation->name = (User::whereId($conversation->requester_id)->first()->name) . "-"
                . (User::whereId($conversation->receiver_id)->first()->name);
            $change_conversation = Conversation::find($conversation->id);
            $change_conversation->name = $conversation->name;
            $change_conversation->save();
        }

        return response()->json([
            'msg' => 'success',
        ]);
    }
    public function sendChat(Request $request) {
        $message = (new Message());
        $message->message = $request->message;
        $message->user_id = $request->user_id;
        $message->conversation_id = $request->conversation_id;
        $message->save();
        return response()->json([
            'status' => 'success',
        ]);
    }
}
