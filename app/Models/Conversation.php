<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use HasFactory;

    protected $table = 'conversations';
    protected $primaryKey = 'id';

    protected $fillable = [
        'name',
    ];

    public function user_conversation() {
        return $this->belongsTo(Conversation::class, 'receiver_id');
    }
    public function message() {
        return $this->hasMany(Message::class, 'conversation_id');
    }

}
