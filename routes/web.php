<?php

use App\Models\Message;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Controller;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('test','ChatController@test');


Route::get('/', function () {
    return view('welcome');
});
Route::get('/login', 'LoginController@getLogin');
Route::get('/signup', 'SignupController@index');
Route::get('/chat/conversation', 'ChatController@index');
Route::get('/connect', 'ChatController@newConnect');
Route::get('/logout', 'LogoutController@logout');


Route::post('/chat/conversation/{slug}', 'ChatController@showConversation');
Route::post('/login', 'LoginController@postLogin');
Route::post('/signup', 'SignupController@store');
Route::post('/change-name', 'ChatController@changeName');
Route::post('/send-chat', 'ChatController@sendChat');
Route::post('/connect', 'ConnectController@connect');
Route::post('/accept-connect', 'ConnectController@acceptConnect');
Route::post('/connect/getUser', 'ConnectController@getUserbyPhone');

Route::post('/cancel-connect', 'ConnectController@cancelConnect');



//Route::post('/message', function (Request $request) {
//    $user = 'abc';
//    broadcast(new \App\Events\MessageSent($user, $request->input('message')));
//    dd($request);
//});
